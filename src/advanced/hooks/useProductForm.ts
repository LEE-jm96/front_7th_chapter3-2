import { useState, useEffect, useCallback } from 'react';
import { Product, Discount } from '../../types';
import { validatePrice, validateStock } from '../utils/validators';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface UseProductFormOptions {
  initialProduct?: Partial<ProductWithUI>;
  onValidationError?: (message: string) => void;
}

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
}

/**
 * 상품 폼의 모든 비즈니스 로직을 관리하는 Hook
 */
export function useProductForm({ initialProduct, onValidationError }: UseProductFormOptions = {}) {
  const [product, setProduct] = useState<ProductFormData>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
    ...initialProduct
  });

  // initialProduct가 변경되면 폼 초기화
  useEffect(() => {
    setProduct({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
      ...initialProduct
    });
  }, [initialProduct]);

  /**
   * 숫자 입력 처리 (숫자만 허용)
   */
  const handleNumberChange = useCallback((field: 'price' | 'stock', value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setProduct(prev => ({ 
        ...prev, 
        [field]: value === '' ? 0 : parseInt(value) 
      }));
    }
  }, []);

  /**
   * 숫자 입력 검증 (blur 시)
   */
  const handleNumberBlur = useCallback((field: 'price' | 'stock', value: string) => {
    const numValue = parseInt(value) || 0;
    
    if (field === 'price') {
      const validation = validatePrice(numValue);
      if (!validation.isValid) {
        onValidationError?.(validation.error!);
        setProduct(prev => ({ ...prev, price: 0 }));
      }
    } else if (field === 'stock') {
      const validation = validateStock(numValue);
      if (!validation.isValid) {
        onValidationError?.(validation.error!);
        // 최대값 초과 시 9999로 설정, 음수는 0으로 설정
        setProduct(prev => ({ 
          ...prev, 
          stock: numValue > 9999 ? 9999 : 0 
        }));
      }
    }
  }, [onValidationError]);

  /**
   * 텍스트 필드 변경
   */
  const handleFieldChange = useCallback((field: keyof ProductFormData, value: string) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * 할인 추가
   */
  const addDiscount = useCallback(() => {
    setProduct(prev => ({
      ...prev,
      discounts: [...prev.discounts, { quantity: 10, rate: 0.1 }]
    }));
  }, []);

  /**
   * 할인 제거
   */
  const removeDiscount = useCallback((index: number) => {
    setProduct(prev => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index)
    }));
  }, []);

  /**
   * 할인 업데이트
   */
  const updateDiscount = useCallback((index: number, field: keyof Discount, value: number) => {
    setProduct(prev => ({
      ...prev,
      discounts: prev.discounts.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      )
    }));
  }, []);

  /**
   * 폼 리셋
   */
  const resetForm = useCallback(() => {
    setProduct({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
      ...initialProduct
    });
  }, [initialProduct]);

  return {
    product,
    handleNumberChange,
    handleNumberBlur,
    handleFieldChange,
    addDiscount,
    removeDiscount,
    updateDiscount,
    resetForm
  };
}

