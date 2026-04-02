const POINTS_PER_RUPIAH = 0.01; // 1 poin per 100 rupiah
const POINTS_CONVERSION_RATE = 1000; // 1000 poin = Rp 100.000

export const calculateLoyaltyPoints = (totalAmount: number): number => {
  return Math.floor(totalAmount * POINTS_PER_RUPIAH);
};

export const calculateDiscount = (points: number): number => {
  return (points / POINTS_CONVERSION_RATE) * 100000;
};

export const isPointsRedeemable = (points: number, minRequired: number = 1000): boolean => {
  return points >= minRequired;
};
