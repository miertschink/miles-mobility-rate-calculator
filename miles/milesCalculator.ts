const rates = `
1 days with 50km = 45€
1 days with 100km = 64€
1 days with 150km = 81€
2 days with 100km = 70€
2 days with 300km = 144€ 
3 days with 150km = 104€ 
3 days with 350km = 174€ 
4 days with 200km = 129€ 
4 days with 400km = 179€ 
5 days with 250km = 159€ 
5 days with 550km = 249€ 
6 days with 300km = 190€ 
6 days with 750km = 339€ 
7 days with 350km = 239€ 
7 days with 750km = 339€ 
8 days with 400km = 259€
8 days with 1000km = 449€
9 days with 450km = 279€
9 days with 1100km = 489€
10 days with 500km = 309€
10 days with 1250km = 569€
11 days with 550km = 334€
11 days with 1300km = 599€
12 days with 600km = 379€
12 days with 1400km = 639€
13 days with 650km = 409€
13 days with 1600km = 729€
14 days with 700km = 449€
14 days with 1700km = 759€
15 days with 750km = 479€
15 days with 1800km = 829€
16 days with 800km = 509€
16 days with 1900km = 869€
17 days with 850km = 529€
17 days with 2000km = 879€
18 days with 900km = 549€
18 days with 2000km = 899€
19 days with 950km = 599€
19 days with 2000km = 929€
20 days with 1000km = 609€
20 days with 2000km = 939€
21 days with 1050km = 649€
21 days with 2000km = 949€
22 days with 1100km = 689€
22 days with 2200km = 1029€
23 days with 1150km = 699€
23 days with 2300km = 1059€
24 days with 1200km = 719€
24 days with 2400km = 1099€
25 days with 1250km = 749€
25 days with 2500km = 1149€
26 days with 1300km = 769€
26 days with 2500km = 1165€
27 days with 1350km = 799€
27 days with 2500km = 7169€
28 days with 1400km = 829€
28 days with 3000km = 1299€
29 days with 1450km = 879€
29 days with 3200km = 1449€
30 days with 1500km = 899€
30 days with 3500km = 1679€
`;

export type RentalResult = {
    costs: number,
    chosenRate?: Rate,
    extraKm: number,
};

export type Rate = {
    days: number,
    km: number,
    cost: number,
};

export const additionalCosts = {
    unlockFee: 1
}

export type MilesPass = {
    unlockFeeDiscount: number,
    rateDiscount: number,
    extraKmDiscount: number
}

export const silverPass: MilesPass = {
    unlockFeeDiscount: 50,
    rateDiscount: 10,
    extraKmDiscount: 10
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

export const calculateRentalCost = (pass: MilesPass, rentalDays: number, rentalKm: number): RentalResult => {
    const rates = getRates();
    let bestRate: Rate = rates[0];
    let minCost = Number.MAX_VALUE;
    let extraKm = 0;

    rates.forEach(rate => {
        // Skip this rate if the rentalDays are more than allowed
        if (rentalDays > rate.days) {
            return;
        }
        let rateCost = rate.cost * (1 - pass.rateDiscount/100);
        // rateCost = Number(rateCost.toFixed(5));
        if (rentalKm <= rate.km) {
            if (rateCost < minCost+1) {
                minCost = rateCost;
                bestRate = rate;
                extraKm = 0;
            }
        } else {
            let extraCostForThisRate = (rentalKm - rate.km) * extraKmCost * (1 - pass.extraKmDiscount/100);
            // extraCostForThisRate = Number(extraCostForThisRate.toFixed(5));
            const cost = rateCost + extraCostForThisRate;

            if (cost < minCost+1) {
                minCost = cost;
                bestRate = rate;
                extraKm = rentalKm - rate.km;
            }
        }
    });
    let costs = minCost + additionalCosts.unlockFee * (1 - pass.unlockFeeDiscount/100);
    costs = Number(costs.toFixed(5))
    return {
        costs: +costs.toFixed(5),
        chosenRate: bestRate,
        extraKm: extraKm,
    };
};

const costs = calculateRentalCost(silverPass, 4, 460);
console.warn(costs);

