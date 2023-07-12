import {rates} from './rates.ts';
import {MilesPass, Rate, RentalResult} from "./types.ts";
import {SilverPass} from "./milesPass.ts";

export const additionalCosts = {
    unlockFee: 1
}


const getRates = (): Rate[] => {
    return rates.trim().split('\n').map(line => {
        const [daysStr, kmStr, costStr] = line.split(/days with |km = |€/);
        return {
            days: Number(daysStr.trim()),
            km: Number(kmStr.trim()),
            cost: Number(costStr.trim()),
        };
    });
};

const extraKmCost = 0.39;

export const calculateRentalCost = (pass: MilesPass, rentalDays: number, rentalKm: number, useTopUp = false): RentalResult => {
    const rates = getRates();
    let bestRate: Rate = rates[0];
    let minCost = Number.MAX_VALUE;
    let extraKm = 0;

    rates.forEach(rate => {
        // Skip this rate if the rentalDays are more than allowed
        if (rentalDays > rate.days) {
            return;
        }
        let rateCost = rate.cost * (1 - pass.rateDiscount / 100);
        // rateCost = Number(rateCost.toFixed(2));
        if (rentalKm <= rate.km) {
            if (rateCost < minCost + 1) {
                minCost = rateCost;
                bestRate = rate;
                extraKm = 0;
            }
        } else {
            let extraCostForThisRate = (rentalKm - rate.km) * extraKmCost * (1 - pass.extraKmDiscount / 100);
            // extraCostForThisRate = Number(extraCostForThisRate.toFixed(2));
            const cost = rateCost + extraCostForThisRate;

            if (cost < minCost + 1) {
                minCost = cost;
                bestRate = rate;
                extraKm = rentalKm - rate.km;
            }
        }
    });
    let costs = minCost + additionalCosts.unlockFee * (1 - pass.unlockFeeDiscount / 100);
    costs = Number(costs.toFixed(2))
    const totalCost = minCost + additionalCosts.unlockFee * (1 - pass.unlockFeeDiscount / 100);
    let finalCost = 0;
    if (useTopUp) {
        const topUpDiscount = Math.min(totalCost, 200) * 0.15;
        finalCost = totalCost - topUpDiscount;
    } else {
        finalCost = totalCost;
    }
    return {
        finalCost: +finalCost.toFixed(2),
        costs: +costs.toFixed(2),
        chosenRate: bestRate,
        extraKm: extraKm,
    };
};

const costs = calculateRentalCost(SilverPass, 4, 460, true);
// console.log(costs);

