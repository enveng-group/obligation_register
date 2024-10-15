import {someUtilityFunction} from '../utils/someUtilityFile.js';

describe('someUtilityFunction', () => {
    it('should return the correct value', () => {
        const result = someUtilityFunction('input');
        expect(result).toBe('expectedOutput');
    });
});
