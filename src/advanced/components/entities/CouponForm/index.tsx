import React from 'react';
import { Coupon } from '../../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useCouponForm } from '../../../hooks/useCouponForm';

interface CouponFormProps {
  onSubmit: (coupon: Coupon) => void;
  onCancel: () => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  onSubmit,
  onCancel,
  addNotification
}) => {
  const {
    coupon,
    handleFieldChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleValueChange,
    handleValueBlur,
    validateForm,
    resetForm
  } = useCouponForm({
    onValidationError: (message) => addNotification(message, 'error')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      validation.errors.forEach(error => addNotification(error, 'error'));
      return;
    }

    onSubmit(coupon);
    resetForm();
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="쿠폰명"
            value={coupon.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="신규 가입 쿠폰"
            className="text-sm"
            required
          />
          
          <Input
            label="쿠폰 코드"
            value={coupon.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="WELCOME2024"
            className="text-sm font-mono"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할인 타입</label>
            <select
              value={coupon.discountType}
              onChange={(e) => handleDiscountTypeChange(e.target.value as 'amount' | 'percentage')}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          
          <Input
            label={coupon.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
            type="text"
            value={coupon.discountValue === 0 ? '' : coupon.discountValue}
            onChange={(e) => handleValueChange(e.target.value)}
            onBlur={(e) => handleValueBlur(e.target.value)}
            placeholder={coupon.discountType === 'amount' ? '5000' : '10'}
            className="text-sm"
            required
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} variant="secondary">
            취소
          </Button>
          <Button type="submit" variant="primary">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};
