import React from 'react';
import { CartItem as CartItemType, Coupon } from '../../../../types';
import { CartIcon } from '../../icons';
import { Button } from '../../ui/Button';
import { CartItem } from '../CartItem';
import { formatCustomerPrice, formatDiscountAmount } from '../../../utils/formatters';

interface CartProps {
  cart: CartItemType[];
  totals: {
    subtotal: number;
    discountAmount: number;
    total: number;
  };
  coupons: Coupon[];
  selectedCouponCode: string | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onSelectCoupon: (couponCode: string) => void;
  onCompleteOrder: () => void;
  getMaxApplicableDiscount: (item: CartItemType) => number;
}

export const Cart: React.FC<CartProps> = ({
  cart,
  totals,
  coupons,
  selectedCouponCode,
  onUpdateQuantity,
  onRemoveFromCart,
  onSelectCoupon,
  onCompleteOrder,
  getMaxApplicableDiscount
}) => {
  return (
    <div className="sticky top-24 space-y-4">
      {/* 장바구니 */}
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CartIcon className="w-5 h-5 mr-2" aria-hidden />
          장바구니
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <CartIcon className="text-gray-300 mx-auto mb-4" size={64} aria-hidden />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <CartItem
                key={item.product.id}
                item={item}
                discount={getMaxApplicableDiscount(item)}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveFromCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* 결제 정보 */}
      {cart.length > 0 && (
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">소계</span>
              <span className="font-medium">{formatCustomerPrice(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>할인 금액</span>
                <span>{formatDiscountAmount(totals.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t">
              <span>합계</span>
              <span className="text-blue-600">{formatCustomerPrice(totals.total)}</span>
            </div>
          </div>
          
          {/* 쿠폰 선택 */}
          <div className="mt-4">
            <label htmlFor="coupon-select" className="block text-sm font-medium text-gray-700 mb-2">
              쿠폰 적용
            </label>
            <select
              id="coupon-select"
              onChange={(e) => onSelectCoupon(e.target.value)}
              value={selectedCouponCode || ""}
              disabled={cart.length === 0}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">쿠폰 선택</option>
              {coupons.map(coupon => (
                <option key={coupon.code} value={coupon.code}>
                  {coupon.name} ({coupon.discountType === 'amount'
                    ? `${coupon.discountValue.toLocaleString()}원`
                    : `${coupon.discountValue}%`})
                </option>
              ))}
            </select>
          </div>
          
          {/* 주문 버튼 */}
          <div className="mt-4">
            <Button
              onClick={onCompleteOrder}
              variant="primary"
              fullWidth
            >
              {formatCustomerPrice(totals.total)}원 결제하기
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};
