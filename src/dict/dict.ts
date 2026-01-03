import { type Defined, first, isArray, type Maybe, Nothing, Pair, second, Something } from '@eyebraus/core';

import { type Collection } from '../collection';

/**
 * A dictionary of string keys to defined values. More useful in Redux contexts than {@link Map} because of
 * serializability and immutability.
 */
export type Dict<TValue extends Defined> = { [key: string]: TValue };

/**
 * Creates a {@link Dict}.
 * @param value Optional existing {@link Dict} or array of string-value pairs.
 * @returns A {@link Dict} either copying the passed value or a new empty {@link Dict}.
 */
export const Dict = <TValue extends Defined>(value?: Dict<TValue> | Pair<string, TValue>[]): Dict<TValue> => {
    // Undefined: return empty object
    if (!value) {
        return {};
    }

    const map: Dict<TValue> = {};

    // Array of pairs: add each pair to new object
    if (isArray(value)) {
        value.forEach((pair) => {
            const [key, val] = pair;
            map[key] = val;
        });

        return map;
    }

    // Existing map: copy it, with case sensitivity accounted for
    for (const key in value) {
        map[key] = value[key];
    }

    return map;
};

/**
 * Iterates through a {@link Dict} using a given function.
 * @param dict A {@link Dict}.
 * @param fn Function that will be called on each entry in the {@link Dict}.
 */
export const forEach = <TValue extends Defined>(dict: Dict<TValue>, fn: (value: TValue, key: string) => void): void => {
    for (const key in dict) {
        fn(dict[key], key);
    }
};

/**
 * Creates a new {@link Dict} that only includes key-value pairs from the original {@link Dict} that pass a given
 * predicate.
 * @param dict A {@link Dict}.
 * @param predicate A predicate function that accepts a value and a key. The filter function calls this predicate
 * function one time for each entry in the {@link Dict}.
 * @returns A new {@link Dict} only including key-value pairs that passed the predicate.
 */
export const filter = <TValue extends Defined>(
    dict: Dict<TValue>,
    predicate: (value: TValue, key: string) => boolean,
): Dict<TValue> => {
    const copy: Dict<TValue> = {};
    let anyFilteredOut = false;

    for (const key in dict) {
        if (predicate(dict[key], key)) {
            copy[key] = dict[key];
        } else {
            anyFilteredOut = true;
        }
    }

    return anyFilteredOut ? copy : dict;
};

/**
 * Checks whether a {@link Dict} has a value for a given key.
 * @param dict A {@link Dict}.
 * @param key Key.
 * @returns True if {@link Dict} has a value for the key, false otherwise.
 */
export const has = <TValue extends Defined>(dict: Dict<TValue>, key: string): boolean => Object.hasOwn(dict, key);

/**
 * Gets a value from a {@link Dict}.
 * @param dict A {@link Dict}.
 * @param key Key.
 * @returns A {@link Maybe} that is {@link Something} if the {@link Dict} has a value for the key.
 */
export const get = <TValue extends Defined>(dict: Dict<TValue>, key: string): Maybe<TValue> =>
    has(dict, key) ? Something(dict[key]) : Nothing();

/**
 * Type guard which detects whether a given {@link Collection} is a {@link Dict}.
 * @param maybe A {@link Collection}.
 * @returns True if {@link Dict}, false otherwise.
 */
export const isDict = <TValue extends Defined>(value: Collection<TValue>): value is Dict<TValue> => !isArray(value);

/**
 * Gets an array of all keys in the {@link Dict}.
 * @param dict A {@link Dict}.
 * @returns An array of all keys in the {@link Dict}.
 */
export const keys = <TValue extends Defined>(dict: Dict<TValue>): string[] => Object.keys(dict);

/**
 * Creates an equivalent array of key-value {@link Pair}s from a {@link Dict}.
 * @param dict A {@link Dict}.
 * @returns Array of key-value {@link Pair}s corresponding to the keys and values of the {@link Dict}.
 */
export const entries = <TValue extends Defined>(dict: Dict<TValue>): Pair<string, TValue>[] =>
    keys(dict).map((key) => Pair(key, dict[key]));

/**
 * Determines whether all the entries of a {@link Dict} satisfy a specified predicate.
 * @param dict A {@link Dict}.
 * @param predicate A predicate function that accepts a value and a key. The every function calls this predicate
 * function for each entry in the {@link Dict} until the predicate returns false or until the end of the {@link Dict}.
 * @returns True if all entries in the {@link Dict} return true, false otherwise.
 */
export const every = <TValue extends Defined>(
    dict: Dict<TValue>,
    predicate: (value: TValue, key: string) => boolean,
): boolean => entries(dict).every((entry) => predicate(second(entry), first(entry)));

/**
 * Calls a defined callback function on each entry of a {@link Dict} and returns a {@link Dict} that contains the
 * results.
 * @param dict A {@link Dict}.
 * @param fn A function that accepts a value and associated key and returns a transformed value to add to the new
 * {@link Dict}. This function will be called on every entry in the existing {@link Dict}.
 * @returns A new {@link Dict} containing the transformed values.
 */
export const map = <TValueIn extends Defined, TValueOut extends Defined>(
    dict: Dict<TValueIn>,
    fn: (value: TValueIn, key: string) => TValueOut,
): Dict<TValueOut> => {
    const copy: Dict<TValueOut> = {};
    let anyChanged = false;

    for (const key in dict) {
        const next = fn(dict[key], key);
        copy[key] = next;

        if ((next as unknown) !== (dict[key] as unknown)) {
            anyChanged = true;
        }
    }

    // Justification: bit hacky, but Dict<TValueIn> -> Dict<TValueOut> assertion is safe at runtime. anyChanged could
    // only be false if the return type of fn is the same type as TValueIn.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return anyChanged ? copy : (dict as unknown as Dict<TValueOut>);
};

/**
 * Reduces the entries of a {@link Dict} into a single value based on a reducer function.
 * @param dict A {@link Dict}.
 * @param fn A function that accepts the current accumulated value, the current value on the {@link Dict}, and the
 * associated key. It returns the new accumulated value.
 * @param initialValue Initial value to start accumulation.
 * @returns A single value resulting from running the reducer function over all entries in the {@link Dict}.
 */
export const reduce = <TValue extends Defined, TResult extends Defined = TValue>(
    dict: Dict<TValue>,
    fn: (previousValue: TResult, currentValue: TValue, currentKey: string) => TResult,
    initialValue: TResult,
): TResult =>
    entries(dict).reduce(
        (previousValue, currentPair) => fn(previousValue, second(currentPair), first(currentPair)),
        initialValue,
    );

/**
 * Creates a new {@link Dict} that is a copy of the original {@link Dict} with the value at the specified key removed.
 * @param dict A {@link Dict}.
 * @param key The key whose value to remove.
 * @returns A copy of the original {@link Dict} with the value at the specified key removed.
 */
export const remove = <TValue extends Defined>(dict: Dict<TValue>, key: string): Dict<TValue> => {
    if (!has(dict, key)) {
        return dict;
    }

    const copy = Dict(dict);

    // Justification: copy / delete is more readable than copy-all-but.
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete copy[key];

    return copy;
};

/**
 * Creates a new {@link Dict} that is a copy of the original {@link Dict} with the specified value inserted at the
 * specified key.
 * @param dict A {@link Dict}.
 * @param key The key at which to insert the value.
 * @param value The value to insert.
 * @returns A copy of the original {@link Dict} with the specified value inserted at the specified key.
 */
export const set = <TValue extends Defined>(dict: Dict<TValue>, key: string, value: TValue): Dict<TValue> => {
    if (dict[key] === value) {
        return dict;
    }

    const copy = Dict(dict);
    copy[key] = value;

    return copy;
};

/**
 * Combines two or more {@link Dict}s. When the same key is in more than one {@link Dict}, the value from the rightmost
 * {@link Dict} in the argument list is used.
 * @param dicts One or more {@link Dict}s to merge together.
 * @returns A new {@link Dict} containing all key-value pairs from the submitted {@link Dict}s.
 */
export const merge = <TValue extends Defined>(...dicts: Dict<TValue>[]): Dict<TValue> => {
    if (dicts.length < 1) {
        return {};
    }

    if (dicts.length < 2) {
        return dicts[0];
    }

    let [copy] = dicts;
    const [, ...rest] = dicts;

    rest.forEach((dict) => {
        forEach(dict, (value, key) => {
            copy = set(copy, key, value);
        });
    });

    return copy;
};

/**
 * Gets the number of entries in the {@link Dict}.
 * @param dict A {@link Dict}.
 * @returns The number of entries in the {@link Dict}.
 */
export const size = <TValue extends Defined>(dict: Dict<TValue>): number => keys(dict).length;

/**
 * Determines whether at least one of the entries of a {@link Dict} satisfies a specified predicate.
 * @param dict A {@link Dict}.
 * @param predicate A predicate function that accepts a value and a key. The some function calls this predicate
 * function for each entry in the {@link Dict} until the predicate returns true or until the end of the {@link Dict}.
 * @returns True if at least one of the entries in the {@link Dict} returns true, false otherwise.
 */
export const some = <TValue extends Defined>(
    dict: Dict<TValue>,
    predicate: (value: TValue, key: string) => boolean,
): boolean => entries(dict).some((entry) => predicate(second(entry), first(entry)));

/**
 * Gets an array of all values in the {@link Dict}.
 * @param dict A {@link Dict}.
 * @returns An array of all values in the {@link Dict}.
 */
export const values = <TValue extends Defined>(dict: Dict<TValue>): TValue[] => Object.values(dict);
