import { type Defined, first, isArray, isNone, type Maybe, Pair, second, wrap } from '@eyebraus/core';

import { type Collection } from '../collection';
import { Dict } from '../dict/dict';

/**
 * A list of defined values.
 *
 * **Important note:** in general, it's still recommended to use the native {@link Array} type and methods where
 * possible, as these methods are immutable or have immutable variants in almost all cases. However, {@link List} can be
 * useful in contexts like the following:
 *
 * - You want to restrict elements to things that are {@link Defined}.
 * - You are doing {@link Set}-like operations in a Redux context, where you can't use {@link Set} itself, due to lack
 *   of serializability and immutability in the {@link Set} type itself.
 * - You want to use functions that support {@link List} because they offer tighter integration with \@konvay/* types,
 *   creating less boilerplate.
 *
 * Importantly, since {@link List} is just a specialized kind of {@link Array}, it's still possible (and recommended!)
 * to use the existing {@link Array} methods on {@link List}s. For example, we don't provide a filter implementation
 * specific to a {@link List} - {@link Array.filter} suffices.
 */
export type List<TValue extends Defined> = TValue[];

/**
 * Creates a {@link List}.
 * @param value Optional existing {@link List} or array of defined objects.
 * @returns A {@link List} either copying the passed value or a new empty {@link List}.
 */
export const List = <TValue extends Defined>(value?: TValue[]): List<TValue> => (value ? [...value] : []);

/**
 * Gets the last item in the {@link List} if the {@link List} is non-empty.
 * @param list A {@link List}.
 * @returns A {@link Maybe} containing the last item in the {@link List} if the {@link List} is non-empty.
 */
export const end = <TItem extends Defined>(list: List<TItem>): Maybe<TItem> =>
    wrap(isNone(list) ? undefined : list[list.length - 1]);

/**
 * Gets a {@link List} of all but the last item in a {@link List}.
 * @param list A {@link List}.
 * @returns A {@link List} containing all items except the last one.
 */
export const front = <TItem extends Defined>(list: List<TItem>): List<TItem> => list.slice(0, -1);

/**
 * Gets the first item in the {@link List} if the {@link List} is non-empty.
 * @param list A {@link List}.
 * @returns A {@link Maybe} containing the first item in the {@link List} if the {@link List} is non-empty.
 */
export const head = <TItem extends Defined>(list: List<TItem>): Maybe<TItem> =>
    wrap(isNone(list) ? undefined : list[0]);

/**
 * Type guard which detects whether a given {@link Collection} is a {@link List}.
 * @param maybe A {@link Collection}.
 * @returns True if {@link List}, false otherwise.
 */
export const isList = <TValue extends Defined>(value: Collection<TValue>): value is List<TValue> => isArray(value);

/**
 * Gets a {@link List} of all but the first item in a {@link List}.
 * @param list A {@link List}.
 * @returns A new {@link List} containing all items except the first one.
 */
export const tail = <TItem extends Defined>(list: List<TItem>): List<TItem> => list.slice(1);

/**
 * Gets a {@link List} that contains all unique values from a given {@link List}.
 * @param list A {@link List}.
 * @returns A {@link List} containing all unique values from the given {@link List}.
 */
export const unique = <TItem extends Defined>(list: List<TItem>): List<TItem> => {
    const alreadySeen = new Set<TItem>();
    const copy: TItem[] = [];
    let anyRemoved = false;

    for (const value of list) {
        if (alreadySeen.has(value)) {
            anyRemoved = true;
        } else {
            copy.push(value);
            alreadySeen.add(value);
        }
    }

    return anyRemoved ? copy : list;
};

/**
 * Creates a {@link List} of key-{@link List} {@link Pair}s from a {@link List} using a key selector function.
 * @param list A {@link List}.
 * @param groupBy A function that gets the key that the given value should be grouped with.
 * @returns A {@link List} of key-{@link List} {@link Pair}s where values that have the same key belong to the same pair.
 */
export const group = <TKey extends Defined, TValue extends Defined>(
    list: TValue[],
    groupBy: (value: TValue, index: number) => TKey,
): List<Pair<TKey, List<TValue>>> => {
    const pairs = list.map((value, index) => Pair(groupBy(value, index), value));
    const groupKeys = unique(pairs.map(first));
    const groups: Pair<TKey, TValue[]>[] = [];

    for (const groupKey of groupKeys) {
        const valuesForGroup = pairs.filter((pair) => groupKey === first(pair)).map(second);
        groups.push(Pair(groupKey, valuesForGroup));
    }

    return groups;
};

/**
 * Creates a {@link Dict} of {@link List}s from a {@link List} using a key selector function.
 * @param list A {@link List}.
 * @param groupBy A function that gets the key that the given value should be grouped with.
 * @returns A {@link Dict} of {@link List}s where values that have the same key belong to the same pair.
 */
export const groupInto = <TValue extends Defined>(
    list: TValue[],
    groupBy: (value: TValue, index: number) => string,
): Dict<List<TValue>> => Dict(group(list, groupBy));
