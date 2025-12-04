import React from 'react';
import { CartItem as CartItemType } from '../../../../types';
import { TrashIcon } from '../../icons';
import { formatCustomerPrice, formatPercentage } from '../../../utils/formatters';

interface CartItemProps {
  item: CartItemType;
  discount: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  discount,
  onUpdateQuantity,
  onRemove
}) => {
  const originalPrice = item.product.price * item.quantity;
  const itemTotal = Math.round(originalPrice * (1 - discount));
  const hasDiscount = discount > 0;
  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <button 
          onClick={() => onRemove(item.product.id)}
          className="text-gray-400 hover:text-red-500 ml-2"
          aria-label="상품 삭제"
        >
          <TrashIcon className="w-4 h-4" aria-hidden />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} 
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label="수량 감소"
          >
            −
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} 
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label="수량 증가"
          >
            +
          </button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">-{formatPercentage(discountRate / 100)}</span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {formatCustomerPrice(itemTotal)}
          </p>
        </div>
      </div>
    </div>
  );
};

