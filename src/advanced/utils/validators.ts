/**
 * 상품 검증 관련 유틸리티
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 가격 검증
 */
export const validatePrice = (price: number): ValidationResult => {
  if (price < 0) {
    return { isValid: false, error: '가격은 0보다 커야 합니다' };
  }
  return { isValid: true };
};

/**
 * 재고 검증
 */
export const validateStock = (stock: number): ValidationResult => {
  if (stock < 0) {
    return { isValid: false, error: '재고는 0보다 커야 합니다' };
  }
  if (stock > 9999) {
    return { isValid: false, error: '재고는 9999개를 초과할 수 없습니다' };
  }
  return { isValid: true };
};

/**
 * 상품명 검증
 */
export const validateProductName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: '상품명을 입력해주세요' };
  }
  if (name.length > 100) {
    return { isValid: false, error: '상품명은 100자를 초과할 수 없습니다' };
  }
  return { isValid: true };
};

/**
 * 할인율 검증
 */
export const validateDiscountRate = (rate: number): ValidationResult => {
  if (rate < 0 || rate > 1) {
    return { isValid: false, error: '할인율은 0%에서 100% 사이여야 합니다' };
  }
  return { isValid: true };
};

/**
 * 할인 수량 검증
 */
export const validateDiscountQuantity = (quantity: number): ValidationResult => {
  if (quantity < 1) {
    return { isValid: false, error: '할인 수량은 1개 이상이어야 합니다' };
  }
  return { isValid: true };
};

/**
 * 쿠폰 코드 검증
 */
export const validateCouponCode = (code: string): ValidationResult => {
  if (!code || code.trim().length === 0) {
    return { isValid: false, error: '쿠폰 코드를 입력해주세요' };
  }
  if (!/^[A-Z0-9_-]+$/.test(code)) {
    return { isValid: false, error: '쿠폰 코드는 영문 대문자, 숫자, -, _만 사용 가능합니다' };
  }
  return { isValid: true };
};

/**
 * 쿠폰 이름 검증
 */
export const validateCouponName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: '쿠폰 이름을 입력해주세요' };
  }
  return { isValid: true };
};

/**
 * 쿠폰 할인값 검증
 */
export const validateCouponDiscountValue = (
  value: number,
  type: 'amount' | 'percentage'
): ValidationResult => {
  if (value <= 0) {
    return { isValid: false, error: '할인값은 0보다 커야 합니다' };
  }
  if (type === 'percentage' && value > 100) {
    return { isValid: false, error: '할인율은 100%를 초과할 수 없습니다' };
  }
  return { isValid: true };
};

