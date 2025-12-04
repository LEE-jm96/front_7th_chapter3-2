import { useCallback, useMemo } from "react";
import { CartItem, Product } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { formatDate } from "../utils/formatters";

interface UseCartResult {
  success: boolean;
  error?: string;
  message?: string;
}

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  // 총 아이템 개수 계산
  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // 재고 확인 함수
  const getRemainingStock = useCallback((product: Product): number => {
    const cartItem = cart.find(item => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  }, [cart]);

  // 장바구니에 상품 추가
  const addToCart = useCallback((product: Product): UseCartResult => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) {
      return { success: false, error: '재고가 부족합니다!' };
    }

    let result: UseCartResult = { success: true, message: '장바구니에 담았습니다' };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        
        if (newQuantity > product.stock) {
          result = { success: false, error: `재고는 ${product.stock}개까지만 있습니다.` };
          return prevCart;
        }

        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return [...prevCart, { product, quantity: 1 }];
    });
    
    return result;
  }, [getRemainingStock, setCart]);

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, [setCart]);

  // 수량 변경
  const updateQuantity = useCallback((
    productId: string, 
    newQuantity: number, 
    products: Product[]
  ): UseCartResult => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
      return { success: true };
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      return { success: false, error: '상품을 찾을 수 없습니다.' };
    }

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      return { success: false, error: `재고는 ${maxStock}개까지만 있습니다.` };
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    return { success: true };
  }, [setCart]);

  // 주문 완료 (장바구니 비우기)
  const completeOrder = useCallback((): UseCartResult => {
    const now = new Date();
    const dateStr = formatDate(now).replace(/-/g, '');
    const timeStr = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
    const orderNumber = `ORD-${dateStr}-${timeStr}`;
    
    setCart([]);
    
    return { 
      success: true, 
      message: `주문이 완료되었습니다. 주문번호: ${orderNumber}` 
    };
  }, [setCart]);

  return {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    getRemainingStock,
    completeOrder,
  };
}
