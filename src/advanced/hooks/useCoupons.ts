import { useCallback, useEffect } from "react";
import { Coupon } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

interface UseCouponsOptions {
  initialCoupons?: Coupon[];
}

interface UseCouponsResult {
  success: boolean;
  error?: string;
  message?: string;
}

export function useCoupons(options?: UseCouponsOptions) {
  const { initialCoupons = [] } = options || {};

  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  // 초기 데이터가 변경될 때 localStorage에 반영
  useEffect(() => {
    if (initialCoupons.length > 0 && coupons.length === 0) {
      setCoupons(initialCoupons);
    }
  }, [initialCoupons, coupons.length, setCoupons]);

  // 쿠폰 추가
  const addCoupon = useCallback((newCoupon: Coupon): UseCouponsResult => {
    let result: UseCouponsResult = { success: true, message: '쿠폰이 추가되었습니다.' };

    setCoupons(prevCoupons => {
      const existingCoupon = prevCoupons.find(c => c.code === newCoupon.code);
      if (existingCoupon) {
        result = { success: false, error: '이미 존재하는 쿠폰 코드입니다.' };
        return prevCoupons;
      }
      return [...prevCoupons, newCoupon];
    });

    return result;
  }, [setCoupons]);

  // 쿠폰 삭제
  const deleteCoupon = useCallback((couponCode: string): UseCouponsResult => {
    setCoupons(prevCoupons => prevCoupons.filter(c => c.code !== couponCode));
    return { success: true, message: '쿠폰이 삭제되었습니다.' };
  }, [setCoupons]);

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
