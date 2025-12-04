import { useEffect } from 'react';
import { Coupon, CartItem } from '../../types';
import { calculateCartTotal } from '../utils/cartCalculations';

interface UseCouponValidationOptions {
  selectedCoupon: Coupon | null;
  coupons: Coupon[];
  cart: CartItem[];
  onCouponInvalid?: () => void;
  onMinimumAmountWarning?: (message: string) => void;
}

interface CouponValidationResult {
  isValid: boolean;
  warningMessage?: string;
  errorMessage?: string;
}

/**
 * 쿠폰 검증 로직을 처리하는 Hook
 */
export function useCouponValidation({
  selectedCoupon,
  coupons,
  cart,
  onCouponInvalid,
  onMinimumAmountWarning
}: UseCouponValidationOptions) {
  
  // 선택된 쿠폰이 삭제되었는지 확인
  useEffect(() => {
    if (selectedCoupon && !coupons.some(coupon => coupon.code === selectedCoupon.code)) {
      onCouponInvalid?.();
    }
  }, [coupons, selectedCoupon, onCouponInvalid]);

  // 장바구니가 비어있으면 쿠폰 초기화
  useEffect(() => {
    if (cart.length === 0 && selectedCoupon) {
      onCouponInvalid?.();
    }
  }, [cart.length, selectedCoupon, onCouponInvalid]);

  /**
   * 쿠폰 적용 가능 여부 검증
   */
  const validateCouponApplicability = (coupon: Coupon | null): CouponValidationResult => {
    if (!coupon) {
      return { isValid: true };
    }

    // 장바구니가 비어있는 경우
    if (cart.length === 0) {
      return { 
        isValid: false, 
        errorMessage: '장바구니에 상품을 추가해주세요' 
      };
    }

    // 비율 할인 쿠폰의 최소 금액 체크
    if (coupon.discountType === 'percentage') {
      const { subtotal } = calculateCartTotal(cart, null);
      
      if (subtotal < 10000) {
        return {
          isValid: false,
          warningMessage: '10,000원 이상 구매시 쿠폰을 사용할 수 있습니다!'
        };
      }
    }

    return { isValid: true };
  };

  /**
   * 쿠폰 적용 시 경고 메시지 표시
   */
  useEffect(() => {
    if (selectedCoupon) {
      const validation = validateCouponApplicability(selectedCoupon);
      if (validation.warningMessage && onMinimumAmountWarning) {
        onMinimumAmountWarning(validation.warningMessage);
      }
    }
  }, [selectedCoupon, cart]);

  return {
    validateCouponApplicability
  };
}

