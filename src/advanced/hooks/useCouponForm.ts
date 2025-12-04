import { useState, useCallback } from 'react';
import { Coupon } from '../../types';
import { 
  validateCouponCode, 
  validateCouponName, 
  validateCouponDiscountValue 
} from '../utils/validators';

interface UseCouponFormOptions {
  onValidationError?: (message: string) => void;
}

interface CouponFormValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 쿠폰 폼의 모든 비즈니스 로직을 관리하는 Hook
 */
export function useCouponForm({ onValidationError }: UseCouponFormOptions = {}) {
  const [coupon, setCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  });

  /**
   * 필드 변경
   */
  const handleFieldChange = useCallback((field: keyof Coupon, value: string | number) => {
    setCoupon(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * 쿠폰 코드 변경 (대문자로 변환)
   */
  const handleCodeChange = useCallback((value: string) => {
    setCoupon(prev => ({ ...prev, code: value.toUpperCase() }));
  }, []);

  /**
   * 할인 타입 변경
   */
  const handleDiscountTypeChange = useCallback((type: 'amount' | 'percentage') => {
    setCoupon(prev => ({ ...prev, discountType: type }));
  }, []);

  /**
   * 숫자 입력 처리 (숫자만 허용)
   */
  const handleValueChange = useCallback((value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setCoupon(prev => ({ 
        ...prev, 
        discountValue: value === '' ? 0 : parseInt(value) 
      }));
    }
  }, []);

  /**
   * 숫자 입력 검증 (blur 시)
   */
  const handleValueBlur = useCallback((value: string) => {
    const numValue = parseInt(value) || 0;
    
    const validation = validateCouponDiscountValue(numValue, coupon.discountType);
    if (!validation.isValid) {
      onValidationError?.(validation.error!);
      
      // 최대값 설정
      if (coupon.discountType === 'percentage') {
        setCoupon(prev => ({ 
          ...prev, 
          discountValue: numValue > 100 ? 100 : 0 
        }));
      } else {
        setCoupon(prev => ({ 
          ...prev, 
          discountValue: numValue > 100000 ? 100000 : 0 
        }));
      }
    }
  }, [coupon.discountType, onValidationError]);

  /**
   * 폼 검증
   */
  const validateForm = useCallback((): CouponFormValidationResult => {
    const errors: string[] = [];

    const nameValidation = validateCouponName(coupon.name);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error!);
    }

    const codeValidation = validateCouponCode(coupon.code);
    if (!codeValidation.isValid) {
      errors.push(codeValidation.error!);
    }

    const valueValidation = validateCouponDiscountValue(coupon.discountValue, coupon.discountType);
    if (!valueValidation.isValid) {
      errors.push(valueValidation.error!);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [coupon]);

  /**
   * 폼 리셋
   */
  const resetForm = useCallback(() => {
    setCoupon({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
  }, []);

  return {
    coupon,
    handleFieldChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleValueChange,
    handleValueBlur,
    validateForm,
    resetForm
  };
}

