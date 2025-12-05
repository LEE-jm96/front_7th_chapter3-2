import React from 'react';
import { Product } from '../../../../types';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { formatCustomerPrice, formatPercentage } from '../../../utils/formatters';
import { getMaxDiscountRate, getFirstDiscount } from '../../../utils/productHelpers';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface ProductCardProps {
  product: ProductWithUI;
  remainingStock: number;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  remainingStock,
  onAddToCart
}) => {
  // Entity 헬퍼 함수 사용
  const maxDiscountRate = getMaxDiscountRate(product);
  const firstDiscount = getFirstDiscount(product);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
          </svg>
        </div>
        
        {/* 뱃지 */}
        {product.isRecommended && (
          <span className="absolute top-2 right-2">
            <Badge variant="danger" size="sm">BEST</Badge>
          </span>
        )}
        {maxDiscountRate > 0 && (
          <span className="absolute top-2 left-2">
            <Badge variant="warning" size="sm">~{formatPercentage(maxDiscountRate)}</Badge>
          </span>
        )}
      </div>
      
      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
        )}
        
        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            {remainingStock <= 0 ? 'SOLD OUT' : formatCustomerPrice(product.price)}
          </p>
          {firstDiscount && (
            <p className="text-xs text-gray-500">
              {firstDiscount.quantity}개 이상 구매시 할인 {formatPercentage(firstDiscount.rate)}
            </p>
          )}
        </div>
        
        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 ? (
            <p className="text-xs text-red-600 font-medium">품절임박! {remainingStock}개 남음</p>
          ) : remainingStock > 5 ? (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          ) : null}
        </div>
        
        {/* 장바구니 버튼 */}
        <Button
          onClick={() => onAddToCart(product)}
          disabled={remainingStock <= 0}
          variant="primary"
          fullWidth
        >
          {remainingStock <= 0 ? '품절' : '장바구니 담기'}
        </Button>
      </div>
    </div>
  );
};

