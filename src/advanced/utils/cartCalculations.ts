import { CartItem, Coupon } from "../../types";

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율을 계산
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니 (대량 구매 할인 확인용)
 * @returns 적용 가능한 최대 할인율 (0.0 ~ 1.0)
 */
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  // 대량 구매 여부 확인 (10개 이상 구매 시 추가 5% 할인)
  const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
  
  // 상품별 할인 규칙에서 최대 할인율 찾기
  const baseDiscount = item.product.discounts.reduce((maxDiscount, discount) => {
    return item.quantity >= discount.quantity && discount.rate > maxDiscount 
      ? discount.rate 
      : maxDiscount;
  }, 0);

  // 대량 구매 시 추가 5% 할인 (최대 50%)
  return hasBulkPurchase ? Math.min(baseDiscount + 0.05, 0.5) : baseDiscount;
};

/**
 * 장바구니 아이템의 총 금액을 계산 (할인 적용 후)
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니
 * @returns 할인 적용 후 금액
 */
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const discount = getMaxApplicableDiscount(item, cart);
  return Math.round(item.product.price * item.quantity * (1 - discount));
};

/**
 * 장바구니 전체 금액을 계산
 * @param cart 장바구니 아이템 목록
 * @param selectedCoupon 선택된 쿠폰
 * @returns { subtotal: 소계, discountAmount: 쿠폰 할인 금액, total: 최종 금액 }
 */
export const calculateCartTotal = (
  cart: CartItem[], 
  selectedCoupon: Coupon | null
): { subtotal: number; discountAmount: number; total: number } => {
  // 1. 소계 계산 (상품 할인 적용 후)
  const subtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item, cart), 0);
  
  // 2. 쿠폰 할인 계산
  let discountAmount = 0;
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'percentage') {
      // 비율 할인 (10,000원 이상일 때만 적용)
      if (subtotal >= 10000) {
        discountAmount = Math.round(subtotal * (selectedCoupon.discountValue / 100));
      }
    } else {
      // 정액 할인
      discountAmount = selectedCoupon.discountValue;
    }
  }
  
  // 3. 최종 금액 (음수 방지)
  const total = Math.max(0, subtotal - discountAmount);
  
  return { subtotal, discountAmount, total };
};

/**
 * 장바구니 아이템 수량 업데이트
 * @param cart 현재 장바구니
 * @param productId 상품 ID
 * @param newQuantity 새로운 수량
 * @returns 업데이트된 장바구니
 */
export const updateCartItemQuantity = (
  cart: CartItem[], 
  productId: string, 
  newQuantity: number
): CartItem[] => {
  // 수량이 0 이하면 제거
  if (newQuantity <= 0) {
    return cart.filter(item => item.product.id !== productId);
  }
  
  // 수량 업데이트
  return cart.map(item =>
    item.product.id === productId
      ? { ...item, quantity: newQuantity }
      : item
  );
};

