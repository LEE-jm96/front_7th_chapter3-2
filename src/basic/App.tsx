import React, { useState } from 'react';
import { Product } from '../types';

import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';

import Notifications from './components/notifications';
import Header from './components/layout/Header';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';
import { useNotifications } from './hooks/useNotifications';
import { useDebounce } from './utils/hooks/useDebounce';
import { initialProducts, initialCoupons } from './constants';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 알림 관리 Hook
  const { notifications, addNotification, removeNotification } = useNotifications();

  const {
    cart,
    totalItemCount,
    addToCart: addToCartAction,
    removeFromCart,
    updateQuantity: updateQuantityAction,
    getRemainingStock,
    completeOrder: completeOrderAction,
  } = useCart();

  const {
    coupons,
    addCoupon: addCouponAction,
    deleteCoupon,
  } = useCoupons({ initialCoupons });

  const {
    products,
    addProduct: addProductAction,
    updateProduct: updateProductAction,
    deleteProduct,
  } = useProducts<ProductWithUI>({ initialProducts });

  const addToCart = (product: ProductWithUI) => {
    const result = addToCartAction(product);
    if (result.error) {
      addNotification(result.error, 'error');
    } else if (result.message) {
      addNotification(result.message, 'success');
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const result = updateQuantityAction(productId, quantity, products);
    if (result.error) {
      addNotification(result.error, 'error');
    }
  };

  const completeOrder = () => {
    const result = completeOrderAction();
    if (result.message) {
      addNotification(result.message, 'success');
    }
  };

  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    const result = addProductAction(newProduct);
    if (result.message) {
      addNotification(result.message, 'success');
    }
  };

  const updateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    const result = updateProductAction(productId, updates);
    if (result.message) {
      addNotification(result.message, 'success');
    }
  };

  const addCoupon = (newCoupon: any) => {
    const result = addCouponAction(newCoupon);
    if (result.error) {
      addNotification(result.error, 'error');
    } else if (result.message) {
      addNotification(result.message, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && 
        <Notifications 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
      }
      <Header 
        isAdmin={isAdmin} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        setIsAdmin={setIsAdmin} 
        cart={cart} 
        totalItemCount={totalItemCount} 
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? 
          <AdminPage
            addNotification={addNotification}
            products={products}
            coupons={coupons}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
          />
          : 
          <CartPage 
            products={products} 
            cart={cart} 
            debouncedSearchTerm={debouncedSearchTerm} 
            getRemainingStock={getRemainingStock}
            addToCart={addToCart} 
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            completeOrder={completeOrder}
            coupons={coupons}
            addNotification={addNotification}
          />
        }
      </main>
    </div>
  );
};

export default App;
