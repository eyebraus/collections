import { Dict } from '../dict/dict';
import { List } from '../list/list';
import { isEmpty } from './collection';

describe('collection.ts', () => {
    describe('isEmpty', () => {
        it('should return true with a Dict that does not contain any entries', () => {
            expect(isEmpty(Dict())).toBe(true);
        });

        it('should return false with a Dict that contains entries', () => {
            expect(isEmpty(Dict({ foo: 'bar', fuu: 'bez' }))).toBe(false);
        });

        it('should return true with a List that does not contain any items', () => {
            expect(isEmpty(List())).toBe(true);
        });

        it('should return false with a Dict that contains items', () => {
            expect(isEmpty(List(['foo', 'bar']))).toBe(false);
        });
    });
});
