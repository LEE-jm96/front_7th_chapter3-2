/**
 * Coupon 엔티티 관련 헬퍼 함수들
 * 
 * Coupon 엔티티에만 의존하는 순수 함수들을 모아둡니다.
 */

import { Coupon } from '../../types';

/**
 * 쿠폰이 비율 할인인지 확인
 * @param coupon 쿠폰 정보
 * @returns 비율 할인 여부
 */
export const isPercentageCoupon = (coupon: Coupon): boolean => {
  return coupon.discountType === 'percentage';
};

/**
 * 쿠폰이 정액 할인인지 확인
 * @param coupon 쿠폰 정보
 * @returns 정액 할인 여부
 */
export const isAmountCoupon = (coupon: Coupon): boolean => {
  return coupon.discountType === 'amount';
};

/**
 * 쿠폰의 할인 금액을 계산
 * @param coupon 쿠폰 정보
 * @param subtotal 소계 금액
 * @returns 할인 금액
 */
export const calculateCouponDiscount = (coupon: Coupon, subtotal: number): number => {
  if (isPercentageCoupon(coupon)) {
    // 비율 할인은 10,000원 이상일 때만 적용
    if (subtotal < 10000) {
      return 0;
    }
    return Math.round(subtotal * (coupon.discountValue / 100));
  }
  
  // 정액 할인
  return coupon.discountValue;
};

/**
 * 쿠폰 적용 가능 여부 확인
 * @param coupon 쿠폰 정보
 * @param subtotal 소계 금액
 * @returns { isApplicable: 적용 가능 여부, reason?: 불가 사유 }
 */
export const checkCouponApplicability = (
  coupon: Coupon, 
  subtotal: number
): { isApplicable: boolean; reason?: string } => {
  if (isPercentageCoupon(coupon) && subtotal < 10000) {
    return {
      isApplicable: false,
      reason: '10,000원 이상 구매시 쿠폰을 사용할 수 있습니다'
    };
  }
  
  return { isApplicable: true };
};

/**
 * 쿠폰 표시용 텍스트 생성
 * @param coupon 쿠폰 정보
 * @returns 할인 정보 텍스트 (예: "5,000원 할인", "10% 할인")
 */
export const getCouponDisplayText = (coupon: Coupon): string => {
  if (isAmountCoupon(coupon)) {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  }
  return `${coupon.discountValue}% 할인`;
};

