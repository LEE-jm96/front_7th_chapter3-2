import { useCallback, useEffect } from "react";
import { Product, Discount } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

interface UseProductsOptions<T extends Product> {
  initialProducts?: T[];
}

interface UseProductsResult {
  success: boolean;
  error?: string;
  message?: string;
}

export function useProducts<T extends Product = Product>(options?: UseProductsOptions<T>) {
  const { initialProducts = [] as T[] } = options || {};

  const [products, setProducts] = useLocalStorage<T[]>('products', initialProducts);

  // 초기 데이터가 변경될 때 localStorage에 반영
  useEffect(() => {
    if (initialProducts.length > 0 && products.length === 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts, products.length, setProducts]);

  // 상품 추가 (순수 함수 - ID는 외부에서 주입)
  const addProduct = useCallback((product: T): UseProductsResult => {
    setProducts(prev => [...prev, product]);
    return { success: true, message: '상품이 추가되었습니다.' };
  }, [setProducts]);

  // 상품 수정
  const updateProduct = useCallback((productId: string, updates: Partial<T>): UseProductsResult => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
    return { success: true, message: '상품이 수정되었습니다.' };
  }, [setProducts]);

  // 상품 삭제
  const deleteProduct = useCallback((productId: string): UseProductsResult => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    return { success: true, message: '상품이 삭제되었습니다.' };
  }, [setProducts]);

  // 재고 수정
  const updateProductStock = useCallback((productId: string, stock: number): UseProductsResult => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, stock }
          : product
      )
    );
    return { success: true, message: '재고가 수정되었습니다.' };
  }, [setProducts]);

  // 할인 규칙 추가
  const addProductDiscount = useCallback((productId: string, discount: Discount): UseProductsResult => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, discounts: [...product.discounts, discount] }
          : product
      )
    );
    return { success: true, message: '할인 규칙이 추가되었습니다.' };
  }, [setProducts]);

  // 할인 규칙 삭제
  const removeProductDiscount = useCallback((productId: string, discountIndex: number): UseProductsResult => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, discounts: product.discounts.filter((_, index) => index !== discountIndex) }
          : product
      )
    );
    return { success: true, message: '할인 규칙이 삭제되었습니다.' };
  }, [setProducts]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  };
}
