import {calculateRentalCost, Rate, silverPass} from '../milesCalculator';
import {expect, describe, test} from "@jest/globals";

interface TestSet {
    days: number,
    km: number,
    expectedCosts: number,
    expectedExtraKm: number,
    expectedRate: Rate,
}

describe('calculateRentalCost', () => {
    test('should calculate correct cost and choose best rate', () => {
        const testSet: TestSet[] = [
            {days: 8, km: 399, expectedCosts: 233, expectedExtraKm: 0, expectedRate: {days: 8, km: 400, cost: 259}},
            {days: 1, km: 597, expectedCosts: 230, expectedExtraKm: 197, expectedRate: {days: 4, km: 400, cost: 179}},
            {days: 3, km: 546, expectedCosts: 212, expectedExtraKm: 146, expectedRate: {days: 4, km: 400, cost: 179}},
            {days: 1, km: 249, expectedCosts: 108, expectedExtraKm: 99, expectedRate: {days: 1, km: 150, cost: 81}},
        ]
        for (const test of testSet) {
            const result = calculateRentalCost(silverPass, test.days, test.km);
            expect(Math.floor(result.costs)).toEqual(test.expectedCosts);
            expect(result.chosenRate).toStrictEqual(test.expectedRate);
            expect(result.extraKm).toEqual(test.expectedExtraKm);
        }
    });
});
