import { useState, useCallback } from 'react';
import { Product, Coupon } from '../../types';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface UseAdminPageOptions {
  onAddProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  onUpdateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  onAddCoupon: (newCoupon: Coupon) => void;
}

/**
 * 관리자 페이지의 UI 상태와 로직을 관리하는 Hook
 */
export function useAdminPage({
  onAddProduct,
  onUpdateProduct,
  onAddCoupon
}: UseAdminPageOptions) {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithUI | null>(null);

  /**
   * 상품 수정 시작
   */
  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product);
    setShowProductForm(true);
  }, []);

  /**
   * 새 상품 추가 폼 열기
   */
  const startAddProduct = useCallback(() => {
    setEditingProduct(null);
    setShowProductForm(true);
  }, []);

  /**
   * 상품 폼 제출
   */
  const handleProductSubmit = useCallback((product: Omit<ProductWithUI, 'id'>) => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, product);
    } else {
      onAddProduct(product);
    }
    setEditingProduct(null);
    setShowProductForm(false);
  }, [editingProduct, onAddProduct, onUpdateProduct]);

  /**
   * 상품 폼 취소
   */
  const handleProductCancel = useCallback(() => {
    setEditingProduct(null);
    setShowProductForm(false);
  }, []);

  /**
   * 쿠폰 폼 제출
   */
  const handleCouponSubmit = useCallback((coupon: Coupon) => {
    onAddCoupon(coupon);
    setShowCouponForm(false);
  }, [onAddCoupon]);

  /**
   * 쿠폰 폼 취소
   */
  const handleCouponCancel = useCallback(() => {
    setShowCouponForm(false);
  }, []);

  /**
   * 쿠폰 폼 토글
   */
  const toggleCouponForm = useCallback(() => {
    setShowCouponForm(prev => !prev);
  }, []);

  return {
    // 상태
    activeTab,
    showProductForm,
    showCouponForm,
    editingProduct,
    
    // 상태 변경 함수
    setActiveTab,
    
    // 상품 관련
    startEditProduct,
    startAddProduct,
    handleProductSubmit,
    handleProductCancel,
    
    // 쿠폰 관련
    handleCouponSubmit,
    handleCouponCancel,
    toggleCouponForm
  };
}

