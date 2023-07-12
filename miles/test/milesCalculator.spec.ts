import {calculateRentalCost} from '../milesCalculator';
import {describe, expect, test} from "@jest/globals";
import {Rate} from "../types";
import {SilverPass} from "../milesPass";

interface TestSet {
    days: number,
    km: number,
    expectedCosts: number,
    expectedFinalCosts: number,
    expectedExtraKm: number,
    expectedRate: Rate,
}

describe('calculateRentalCost', () => {
    test('should calculate correct cost and choose best rate', () => {
        const testSet: TestSet[] = [
            {days: 8, km: 399, expectedCosts: 233, expectedExtraKm: 0, expectedFinalCosts: 203, expectedRate: {days: 8, km: 400, cost: 259}},
            {days: 1, km: 597, expectedCosts: 230, expectedExtraKm: 197, expectedFinalCosts: 200, expectedRate: {days: 4, km: 400, cost: 179}},
            {days: 3, km: 546, expectedCosts: 212, expectedExtraKm: 146, expectedFinalCosts: 182, expectedRate: {days: 4, km: 400, cost: 179}},
            {days: 1, km: 249, expectedCosts: 108, expectedExtraKm: 99, expectedFinalCosts: 91, expectedRate: {days: 1, km: 150, cost: 81}},
        ]
        for (const test of testSet) {
            const result = calculateRentalCost(SilverPass, test.days, test.km, true);
            expect(Math.floor(result.costs)).toEqual(test.expectedCosts);
            expect(Math.floor(result.finalCost)).toEqual(test.expectedFinalCosts);
            expect(result.chosenRate).toStrictEqual(test.expectedRate);
            expect(result.extraKm).toEqual(test.expectedExtraKm);
        }
    });
});
