import { useState } from "react";

import { CartItem as CartItemType, Product, Coupon } from "../../types";
import { ProductCard } from "../components/entities/ProductCard";
import { Cart } from "../components/entities/Cart";
import { 
  getMaxApplicableDiscount, 
  calculateCartTotal 
} from "../utils/cartCalculations";
import { useSearch } from "../hooks/useSearch";
import { useCouponValidation } from "../hooks/useCouponValidation";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface CartPageProps {
    products: ProductWithUI[];
    cart: CartItemType[];
    debouncedSearchTerm: string;
    getRemainingStock: (product: ProductWithUI) => number;
    addToCart: (product: ProductWithUI) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    completeOrder: () => void;
    coupons: Coupon[];
    addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

const CartPage = ({ 
  products, 
  cart, 
  debouncedSearchTerm, 
  getRemainingStock, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  completeOrder, 
  coupons, 
  addNotification 
}: CartPageProps) => {
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    
    // 검색/필터링 로직 분리
    const { filteredItems: filteredProducts } = useSearch({
      items: products,
      searchTerm: debouncedSearchTerm,
      searchFields: ['name', 'description']
    });

    // 쿠폰 검증 로직 분리
    useCouponValidation({
      selectedCoupon,
      coupons,
      cart,
      onCouponInvalid: () => setSelectedCoupon(null),
      onMinimumAmountWarning: (message) => addNotification(message, 'warning')
    });

    // 장바구니 총액 계산
    const totals = calculateCartTotal(cart, selectedCoupon);

    const handleCouponChange = (couponCode: string) => {
      const coupon = coupons.find(c => c.code === couponCode) || null;
      setSelectedCoupon(coupon);
    };

    const handleCompleteOrder = () => {
      completeOrder();
      setSelectedCoupon(null);
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* 상품 목록 */}
          <section>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
              <div className="text-sm text-gray-600">
                총 {products.length}개 상품
              </div>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    remainingStock={getRemainingStock(product)}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          <Cart
            cart={cart}
            totals={totals}
            coupons={coupons}
            selectedCouponCode={selectedCoupon?.code || null}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onSelectCoupon={handleCouponChange}
            onCompleteOrder={handleCompleteOrder}
            getMaxApplicableDiscount={(item) => getMaxApplicableDiscount(item, cart)}
          />
        </div>
      </div>
    );
}

export default CartPage;
