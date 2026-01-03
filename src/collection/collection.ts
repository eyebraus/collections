import { type Defined, isBlank } from '@eyebraus/core';

import { type Dict, isDict } from '../dict';
import { type List } from '../list';

/**
 * A collection of defined values. Used primarily for cases where there's a name collision between a {@link Dict}
 * operation and a {@link List} operation, so we can support both without needing overloads.
 */
export type Collection<TValue extends Defined> = Dict<TValue> | List<TValue>;

/**
 * Checks whether a {@link Collection} contains no defined items.
 * @param value A {@link Collection}.
 * @returns True if the given {@link Collection} contains no items, false otherwise.
 */
export const isEmpty = <TValue extends Defined>(collection: Collection<TValue>): boolean =>
    isDict(collection) ? isBlank(collection) : collection.length < 1;
