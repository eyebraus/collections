import { isNothing, isSomething, Pair } from '@eyebraus/core';

import { List } from '../list';
import {
    Dict,
    entries,
    every,
    filter,
    forEach,
    get,
    has,
    isDict,
    keys,
    map,
    merge,
    reduce,
    remove,
    set,
    size,
    some,
    values,
} from './dict';

describe('Dict', () => {
    it('should return an empty Dict when not given an argument', () => {
        expect(Dict()).toEqual({});
    });

    it('should return a new Dict when given an array of Pairs', () => {
        // Arrange
        const pairs = [Pair('foo', 123), Pair('bar', 456)];

        // Act
        const actual = Dict(pairs);

        // Assert
        expect(actual).toEqual({ bar: 456, foo: 123 });
    });

    it('should return a new Dict when given an existing Dict', () => {
        // Arrange
        const existing = Dict([Pair('foo', 123), Pair('bar', 456)]);

        // Act
        const actual = Dict(existing);

        // Assert
        expect(actual).toEqual({ bar: 456, foo: 123 });
        expect(actual).not.toBe(existing);
    });
});

describe('entries', () => {
    it('should return an empty array when given an empty Dict', () => {
        expect(entries(Dict())).toEqual([]);
    });

    it('should return an array of pairs containing only the keys and values in the original Dict', () => {
        // Arrange
        const dict = Dict({ foo: 420, fuu: 69 });

        // Act
        const actual = entries(dict);

        // Assert
        expect(actual).toHaveLength(2);
        expect(actual).toContainEqual(Pair('foo', 420));
        expect(actual).toContainEqual(Pair('fuu', 69));
    });
});

describe('every', () => {
    it('should return true when given an empty Dict', () => {
        expect(every(Dict<number>(), (n) => n > 0)).toBe(true);
    });

    it("should return true when all of a Dict's entries return true when given to the predicate", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = every(dict, (n) => n > 0);

        // Assert
        expect(actual).toBe(true);
    });

    it("should return false when any of a Dict's entries returns false when given to the predicate", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = every(dict, (n) => n < 10);

        // Assert
        expect(actual).toBe(false);
    });
});

describe('filter', () => {
    it('should return the existing Dict when given an empty Dict', () => {
        // Arrange
        const dict = Dict<number>();

        // Act
        const actual = filter(dict, (n) => n > 0);

        // Assert
        expect(actual).toBe(dict);
        expect(actual).toEqual(dict);
    });

    it('should return the existing Dict when the predicate applies to all entries', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = filter(dict, (n) => n > 0);

        // Assert
        expect(actual).toBe(dict);
        expect(actual).toEqual(dict);
    });

    it("should return a new empty Dict when the predicate doesn't apply to any entry", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = filter(dict, (n) => n < 0);

        // Assert
        expect(actual).not.toBe(dict);
        expect(actual).toEqual(Dict());
    });

    it('should return a new Dict with only passing entries from the original Dict when the predicate applies to some entries', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = filter(dict, (n) => n < 10);

        // Assert
        expect(actual).not.toBe(dict);
        expect(actual).toEqual(Dict({ a: 1, c: 3 }));
    });
});

describe('forEach', () => {
    it('should never call the given function when given an empty Dict', () => {
        // Arrange
        const dict = Dict<number>();
        const fn = jest.fn();

        // Act
        forEach(dict, fn);

        // Assert
        expect(fn.mock.calls).toEqual([]);
    });

    it('should call the given function once for every entry in the given non-empty Dict', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 100, c: 3 });
        const fn = jest.fn();

        // Act
        forEach(dict, fn);

        // Assert
        expect(fn.mock.calls).toHaveLength(3);
        expect(fn.mock.calls).toContainEqual([1, 'a']);
        expect(fn.mock.calls).toContainEqual([100, 'b']);
        expect(fn.mock.calls).toContainEqual([3, 'c']);
    });
});

describe('get', () => {
    it("should return Nothing when the given Dict doesn't contain an entry with the given key", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = get(dict, 'd');

        // Assert
        expect(isNothing(actual)).toBe(true);
    });

    it('should return Something containing the appropriate value when the given Dict does contain an entry for the given key', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = get(dict, 'b');

        // Assert
        expect(isSomething(actual)).toBe(true);
    });
});

describe('has', () => {
    it("should return false when the given Dict doesn't contain an entry with the given key", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = has(dict, 'd');

        // Assert
        expect(actual).toBe(false);
    });

    it('should return true when the given Dict does contain an entry for the given key', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = has(dict, 'b');

        // Assert
        expect(actual).toBe(true);
    });
});

describe('isDict', () => {
    it('should return true when given a Dict', () => {
        expect(isDict(Dict())).toBe(true);
    });

    it('should return false when given a List', () => {
        expect(isDict(List())).toBe(false);
    });
});

describe('keys', () => {
    it('should return an empty array when given an empty Dict', () => {
        expect(keys(Dict())).toEqual([]);
    });

    it('should return an array only containing the keys of the given Dict when given a non-empty Dict', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = keys(dict);

        // Assert
        expect(actual).toHaveLength(3);
        expect(actual).toContain('a');
        expect(actual).toContain('b');
        expect(actual).toContain('c');
    });
});

describe('map', () => {
    it('should return the existing Dict when given an empty Dict', () => {
        // Arrange
        const dict = Dict<number>();

        // Act
        const actual = map(dict, (n) => `${n}`);

        // Assert
        expect(actual).toBe(dict);
        expect(actual).toEqual(dict);
    });

    it("should return the existing Dict when given a function that doesn't alter any values", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = map(dict, (n) => n);

        // Assert
        expect(actual).toBe(dict);
        expect(actual).toEqual(dict);
    });

    it('should return a new Dict with values from the original altered according to the given function', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = map(dict, (n) => `${n}`);

        // Assert
        expect(actual).not.toBe(dict);
        expect(actual).toEqual(Dict({ a: '1', b: '999', c: '3' }));
    });
});

describe('merge', () => {
    it('should return the existing Dict when given no Dicts', () => {
        expect(merge()).toEqual(Dict());
    });

    it('should return the existing Dict when given only one Dict', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = merge(dict);

        // Assert
        expect(actual).toBe(dict);
        expect(actual).toEqual(dict);
    });

    it('should return a new Dict when given multiple Dicts with the "rightmost" entry being present in the result', () => {
        // Arrange
        const dict1 = Dict({ a: 1, b: 999, c: 3 });
        const dict2 = Dict({ c: 1, d: 999, e: 3 });
        const dict3 = Dict({ b: 1, e: 999, f: 3 });

        // Act
        const actual = merge(dict1, dict2, dict3);

        // Assert
        expect(actual).not.toBe(dict1);
        expect(actual).toEqual(Dict({ a: 1, b: 1, c: 1, d: 999, e: 999, f: 3 }));
    });

    it('should return the first Dict if none of the following Dicts contain values that would change the value of an entry in the first Dict', () => {
        // Arrange
        const dict1 = Dict({ a: 1, b: 999, c: 3 });
        const dict2 = Dict({ c: 3 });
        const dict3 = Dict({ b: 999 });

        // Act
        const actual = merge(dict1, dict2, dict3);

        // Assert
        expect(actual).toBe(dict1);
        expect(actual).toEqual(dict1);
    });
});

describe('reduce', () => {
    it('should return the initial value when given an empty Dict', () => {
        // Arrange
        const dict = Dict<number>();

        // Act
        const actual = reduce(dict, (sum, n) => sum + n, 0);

        // Assert
        expect(actual).toBe(0);
    });

    it('should return the cumulative result of the reduce operation being applied over all entries', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 2, c: 3 });

        // Act
        const actual = reduce(dict, (sum, n) => sum + n, 0);

        // Assert
        expect(actual).toBe(6);
    });
});

describe('remove', () => {
    it('should return the existing Dict when given an empty Dict', () => {
        // Arrange
        const dict = Dict<number>();

        // Act
        const actual = remove(dict, 'b');

        // Assert
        expect(actual).toBe(dict);
        expect(actual).toEqual(Dict());
    });

    it('should return the existing Dict when given a key without a corresponding entry in the Dict', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 100, c: 3 });

        // Act
        const actual = remove(dict, 'd');

        // Assert
        expect(actual).toBe(dict);
        expect(actual).toEqual(dict);
    });

    it('should return a new Dict when given a key with a corresponding entry in the Dict', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 100, c: 3 });

        // Act
        const actual = remove(dict, 'b');

        // Assert
        expect(actual).not.toBe(dict);
        expect(actual).toEqual(Dict({ a: 1, c: 3 }));
    });
});

describe('set', () => {
    it("should return a new Dict when given a key that wasn't in the Dict", () => {
        // Arrange
        const dict = Dict<number>();

        // Act
        const actual = set(dict, 'a', 1);

        // Assert
        expect(actual).not.toBe(dict);
        expect(actual).toEqual(Dict({ a: 1 }));
    });

    it("should return a new Dict when given a key that was in the Dict and a value that's different from the existing value", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 100, c: 3 });

        // Act
        const actual = set(dict, 'b', 2);

        // Assert
        expect(actual).not.toBe(dict);
        expect(actual).toEqual(Dict({ a: 1, b: 2, c: 3 }));
    });

    it("should return the existing Dict when given a key that was in the Dict and a value that's the same as the existing value", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 100, c: 3 });

        // Act
        const actual = set(dict, 'b', 100);

        // Assert
        expect(actual).toBe(dict);
        expect(actual).toEqual(dict);
    });
});

describe('size', () => {
    it('should return 0 for an empty Dict', () => {
        expect(size(Dict())).toBe(0);
    });

    it('should return the number of entries in a non-empty Dict', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = size(dict);

        // Assert
        expect(actual).toBe(3);
    });
});

describe('some', () => {
    it('should return false when given an empty Dict', () => {
        expect(some(Dict<number>(), (n) => n > 0)).toBe(false);
    });

    it("should return true when any of a Dict's entries return true when given to the predicate", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = some(dict, (n) => n < 10);

        // Assert
        expect(actual).toBe(true);
    });

    it("should return false when all of a Dict's entries return false when given to the predicate", () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = some(dict, (n) => n < 0);

        // Assert
        expect(actual).toBe(false);
    });
});

describe('values', () => {
    it('should return an empty array for an empty Dict', () => {
        expect(values(Dict())).toEqual([]);
    });

    it('should return an array containing only values from the given Dict', () => {
        // Arrange
        const dict = Dict({ a: 1, b: 999, c: 3 });

        // Act
        const actual = values(dict);

        // Assert
        expect(actual).toHaveLength(3);
        expect(actual).toContain(1);
        expect(actual).toContain(3);
        expect(actual).toContain(999);
    });
});
