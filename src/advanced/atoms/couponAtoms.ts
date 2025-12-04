import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Coupon } from '../../types';

// Coupon 상태 - localStorage에서 읽거나 빈 배열로 시작
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', []);

// 쿠폰 추가
export const addCouponAtom = atom(
  null,
  (get, set, newCoupon: Coupon) => {
    const coupons = get(couponsAtom);
    const existingCoupon = coupons.find(c => c.code === newCoupon.code);
    
    if (existingCoupon) {
      return { success: false, error: '이미 존재하는 쿠폰 코드입니다.' };
    }
    
    set(couponsAtom, [...coupons, newCoupon]);
    return { success: true, message: '쿠폰이 추가되었습니다.' };
  }
);

// 쿠폰 삭제
export const deleteCouponAtom = atom(
  null,
  (get, set, couponCode: string) => {
    const coupons = get(couponsAtom);
    set(couponsAtom, coupons.filter(c => c.code !== couponCode));
    return { success: true, message: '쿠폰이 삭제되었습니다.' };
  }
);

