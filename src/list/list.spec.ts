import { Nothing, Pair, Something } from '@eyebraus/core';

import { Dict } from '../dict';
import { end, front, group, groupInto, head, isList, List, tail, unique } from './list';

describe('list.ts', () => {
    describe('end', () => {
        it('should return Nothing when given an empty List', () => {
            expect(end([])).toEqual(Nothing());
        });

        it('should return a Something containing the last element in the List when List is non-empty', () => {
            expect(end([1, 2, 3, 4, 5])).toEqual(Something(5));
        });
    });

    describe('front', () => {
        it('should return an empty List when given an empty List', () => {
            expect(front([])).toEqual([]);
        });

        it('should return an empty List when given a singleton List', () => {
            expect(front([1])).toEqual([]);
        });

        it('should return a new List containing all elements from the given List except the last', () => {
            expect(front([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4]);
        });
    });

    describe('group', () => {
        it('should return an empty List when given an empty List', () => {
            expect(group(List<string>(), (value) => value.length)).toEqual([]);
        });

        it('should return a List of Pairs representing the groups specified by the given grouping function', () => {
            // Arrange
            const list = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

            // Act
            const actual = group(list, (value) => value.length);

            // Assert
            expect(actual).toHaveLength(4);
            expect(actual).toContainEqual(Pair(3, ['red']));
            expect(actual).toContainEqual(Pair(4, ['blue']));
            expect(actual).toContainEqual(Pair(5, ['green']));
            expect(actual).toContainEqual(Pair(6, ['orange', 'yellow', 'indigo', 'violet']));
        });
    });

    describe('groupInto', () => {
        it('should return an empty Dict when given an empty List', () => {
            expect(groupInto(List<string>(), (value) => `${value.length}`)).toEqual(Dict());
        });

        it('should return a Dict containing entries representing the groups specified by the given grouping function', () => {
            // Arrange
            const list = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

            // Act
            const actual = groupInto(list, (value) => `${value.length}`);

            // Assert
            expect(actual).toEqual({
                '3': ['red'],
                '4': ['blue'],
                '5': ['green'],
                '6': ['orange', 'yellow', 'indigo', 'violet'],
            });
        });
    });

    describe('head', () => {
        it('should return Nothing when given an empty List', () => {
            expect(head([])).toEqual(Nothing());
        });

        it('should return a Something containing the first element in the List when List is non-empty', () => {
            expect(head([1, 2, 3, 4, 5])).toEqual(Something(1));
        });
    });

    describe('isList', () => {
        it('should return false when given a Dict', () => {
            expect(isList(Dict())).toBe(false);
        });

        it('should return true when given a List', () => {
            expect(isList(List())).toBe(true);
        });
    });

    describe('tail', () => {
        it('should return an empty List when given an empty List', () => {
            expect(tail([])).toEqual([]);
        });

        it('should return an empty List when given a singleton List', () => {
            expect(tail([1])).toEqual([]);
        });

        it('should return a new List containing all elements from the given List except the last', () => {
            expect(tail([1, 2, 3, 4, 5])).toEqual([2, 3, 4, 5]);
        });
    });

    describe('unique', () => {
        it('should return the existing List when given an empty List', () => {
            expect(unique([])).toEqual([]);
        });

        it('should return the existing List when the given List contains only unique items', () => {
            // Arrange
            const list = [1, 2, 3, 4, 5];

            // Act
            const actual = unique(list);

            // Assert
            expect(actual).toBe(list);
            expect(actual).toEqual(list);
        });

        it('should return a new List with only unique values from the original when values are repeated in the original', () => {
            // Arrange
            const list = [1, 2, 3, 1, 2];

            // Act
            const actual = unique(list);

            // Assert
            expect(actual).not.toBe(list);
            expect(actual).toHaveLength(3);
            expect(actual).toContain(1);
            expect(actual).toContain(2);
            expect(actual).toContain(3);
        });
    });
});
