import React from 'react';
import { PlusIcon, TrashIcon } from "../components/icons";
import { Product, Coupon } from "../../types";
import { formatAdminPrice } from "../utils/formatters";
import { getCouponDisplayText } from "../utils/couponHelpers";
import { Button } from "../components/ui/Button";
import { ProductForm } from "../components/entities/ProductForm";
import { CouponForm } from "../components/entities/CouponForm";
import { useAdminPage } from "../hooks/useAdminPage";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface AdminPageProps {
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
  products: ProductWithUI[];
  coupons: Coupon[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
}

const AdminPage = ({ 
  addNotification, 
  products, 
  coupons, 
  addProduct,
  updateProduct,
  deleteProduct,
  addCoupon,
  deleteCoupon
}: AdminPageProps) => {
    // 관리자 페이지 상태 관리 로직 분리
    const {
      activeTab,
      showProductForm,
      showCouponForm,
      editingProduct,
      setActiveTab,
      startEditProduct,
      startAddProduct,
      handleProductSubmit,
      handleProductCancel,
      handleCouponSubmit,
      handleCouponCancel,
      toggleCouponForm
    } = useAdminPage({
      onAddProduct: addProduct,
      onUpdateProduct: updateProduct,
      onAddCoupon: addCoupon
    });

    return (
        <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
        </div>
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button 
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products' 
                  ? 'border-gray-900 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              상품 관리
            </button>
            <button 
              onClick={() => setActiveTab('coupons')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'coupons' 
                  ? 'border-gray-900 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              쿠폰 관리
            </button>
          </nav>
        </div>

        {activeTab === 'products' ? (
          <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              <Button
                onClick={startAddProduct}
                variant="primary"
                size="sm"
              >
                <PlusIcon className="w-4 h-4 mr-2" aria-hidden />
                새 상품 추가
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">재고</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatAdminPrice(product.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}개
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showProductForm && (
            <ProductForm
              initialProduct={editingProduct || undefined}
              onSubmit={handleProductSubmit}
              onCancel={handleProductCancel}
              addNotification={addNotification}
              isEditing={!!editingProduct}
            />
          )}
          </section>
        ) : (
          <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">쿠폰 관리</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map(coupon => (
                <div key={coupon.code} className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                          {getCouponDisplayText(coupon)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <Button
                  onClick={toggleCouponForm}
                  variant="ghost"
                  className="flex-col h-auto"
                >
                  <PlusIcon className="w-8 h-8" aria-hidden />
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </Button>
              </div>
            </div>

            {showCouponForm && (
              <CouponForm
                onSubmit={handleCouponSubmit}
                onCancel={handleCouponCancel}
                addNotification={addNotification}
              />
            )}
          </div>
          </section>
        )}
      </div>
    )
}

export default AdminPage;
