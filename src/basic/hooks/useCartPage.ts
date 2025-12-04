import { useState, useCallback, useMemo } from 'react';
import { Coupon, CartItem } from '../../types';
import { calculateCartTotal } from '../utils/cartCalculations';

interface UseCartPageOptions {
  coupons: Coupon[];
  cart: CartItem[];
  onCompleteOrder: () => void;
}

export function useCartPage({ 
  coupons, 
  cart,
  onCompleteOrder 
}: UseCartPageOptions) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 쿠폰 선택 핸들러
  const handleCouponChange = useCallback((couponCode: string) => {
    const coupon = coupons.find(c => c.code === couponCode) || null;
    setSelectedCoupon(coupon);
  }, [coupons]);

  // 주문 완료 핸들러
  const handleCompleteOrder = useCallback(() => {
    onCompleteOrder();
    setSelectedCoupon(null);
  }, [onCompleteOrder]);

  // 장바구니 총액 계산 (메모이제이션)
  const totals = useMemo(() => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  return {
    selectedCoupon,
    totals,
    handleCouponChange,
    handleCompleteOrder
  };
}

