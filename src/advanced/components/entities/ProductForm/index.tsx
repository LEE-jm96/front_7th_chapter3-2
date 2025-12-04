import React from 'react';
import { Product } from '../../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { PlusIcon, TrashIcon } from '../../icons';
import { useProductForm } from '../../../hooks/useProductForm';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface ProductFormProps {
  initialProduct?: Partial<ProductWithUI>;
  onSubmit: (product: Omit<ProductWithUI, 'id'>) => void;
  onCancel: () => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
  isEditing: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSubmit,
  onCancel,
  addNotification,
  isEditing
}) => {
  const {
    product,
    handleNumberChange,
    handleNumberBlur,
    handleFieldChange,
    addDiscount,
    removeDiscount,
    updateDiscount
  } = useProductForm({
    initialProduct,
    onValidationError: (message) => addNotification(message, 'error')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(product as Omit<ProductWithUI, 'id'>);
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {isEditing ? '상품 수정' : '새 상품 추가'}
        </h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="상품명"
            value={product.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            required
          />
          
          <Input
            label="설명"
            value={product.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />
          
          <Input
            label="가격"
            type="text"
            value={product.price === 0 ? '' : product.price}
            onChange={(e) => handleNumberChange('price', e.target.value)}
            onBlur={(e) => handleNumberBlur('price', e.target.value)}
            placeholder="숫자만 입력"
            required
          />
          
          <Input
            label="재고"
            type="text"
            value={product.stock === 0 ? '' : product.stock}
            onChange={(e) => handleNumberChange('stock', e.target.value)}
            onBlur={(e) => handleNumberBlur('stock', e.target.value)}
            placeholder="숫자만 입력"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
          <div className="space-y-2">
            {product.discounts.map((discount, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) => updateDiscount(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => updateDiscount(index, 'rate', (parseInt(e.target.value) || 0) / 100)}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => removeDiscount(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-4 h-4" aria-hidden />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" aria-hidden />
              할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} variant="secondary">
            취소
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? '수정' : '추가'}
          </Button>
        </div>
      </form>
    </div>
  );
};
