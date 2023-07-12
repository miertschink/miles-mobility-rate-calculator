
export type RentalResult = {
    finalCost: number,
    costs: number,
    chosenRate?: Rate,
    extraKm: number,
};

export type Rate = {
    days: number,
    km: number,
    cost: number,
};

export type MilesPass = {
    unlockFeeDiscount: number,
    rateDiscount: number,
    extraKmDiscount: number
}
