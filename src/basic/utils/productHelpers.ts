/**
 * Product 엔티티 관련 헬퍼 함수들
 */

import { Product, Discount } from '../../types';

/**
 * 상품의 최대 할인율을 계산
 * @param product 상품 정보
 * @returns 최대 할인율 (0.0 ~ 1.0)
 */
export const getMaxDiscountRate = (product: Product): number => {
  if (product.discounts.length === 0) {
    return 0;
  }
  return Math.max(...product.discounts.map(d => d.rate));
};

/**
 * 상품의 첫 번째 할인 정보를 가져옴
 * @param product 상품 정보
 * @returns 첫 번째 할인 정보 또는 null
 */
export const getFirstDiscount = (product: Product): Discount | null => {
  return product.discounts.length > 0 ? product.discounts[0] : null;
};

/**
 * 상품에 할인이 있는지 확인
 * @param product 상품 정보
 * @returns 할인 존재 여부
 */
export const hasDiscounts = (product: Product): boolean => {
  return product.discounts.length > 0;
};

/**
 * 특정 수량에 적용 가능한 할인율을 계산
 * @param product 상품 정보
 * @param quantity 구매 수량
 * @returns 적용 가능한 할인율 (0.0 ~ 1.0)
 */
export const getApplicableDiscountRate = (product: Product, quantity: number): number => {
  if (product.discounts.length === 0) {
    return 0;
  }

  // 수량 조건을 만족하는 할인 중 최대 할인율 찾기
  const applicableDiscounts = product.discounts.filter(d => quantity >= d.quantity);
  
  if (applicableDiscounts.length === 0) {
    return 0;
  }

  return Math.max(...applicableDiscounts.map(d => d.rate));
};

/**
 * 상품의 할인 정보를 수량 기준으로 정렬
 * @param product 상품 정보
 * @returns 수량 기준 오름차순으로 정렬된 할인 목록
 */
export const getSortedDiscounts = (product: Product): Discount[] => {
  return [...product.discounts].sort((a, b) => a.quantity - b.quantity);
};

/**
 * 재고 상태를 판단
 * @param stock 재고 수량
 * @returns 'soldout' | 'low' | 'available'
 */
export const getStockStatus = (stock: number): 'soldout' | 'low' | 'available' => {
  if (stock <= 0) return 'soldout';
  if (stock <= 5) return 'low';
  return 'available';
};

