// Hệ thống mức thành viên và phần thưởng

export const TIER_CONFIG = [
  { threshold: 500000, discount: 20000, name: 'Bạc' },
  { threshold: 1000000, discount: 40000, name: 'Vàng' },
  { threshold: 2000000, discount: 80000, name: 'Kim Cương' },
];

// Lấy mức thành viên dựa trên tổng chi tiêu
export function getTierLevel(totalSpent: number): number {
  let tierLevel = 0;
  for (const tier of TIER_CONFIG) {
    if (totalSpent >= tier.threshold) {
      tierLevel = tier.threshold;
    }
  }
  return tierLevel;
}

// Lấy thông tin tier
export function getTierInfo(tierLevel: number) {
  const tier = TIER_CONFIG.find(t => t.threshold === tierLevel);
  return tier || null;
}

// Lấy tier tiếp theo
export function getNextTier(totalSpent: number) {
  for (const tier of TIER_CONFIG) {
    if (totalSpent < tier.threshold) {
      return {
        ...tier,
        remaining: tier.threshold - totalSpent,
      };
    }
  }
  return null; // Đã đạt tier cao nhất
}

// Kiểm tra xem user có đủ điều kiện xem Flash Sale không
export function canAccessFlashSale(totalSpent: number, minTierRequired: number = 500000): boolean {
  return totalSpent >= minTierRequired;
}

// Tạo mã giảm giá cho tier mới
export function getCouponValueForTier(tierLevel: number): number {
  const tier = TIER_CONFIG.find(t => t.threshold === tierLevel);
  return tier?.discount || 0;
}
