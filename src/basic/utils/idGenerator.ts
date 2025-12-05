import { formatDate } from './formatters';

/**
 * 상품 ID 생성 (액션)
 * @returns 고유한 상품 ID (예: "p1733396042123")
 */
export const generateProductId = (): string => {
  return `p${Date.now()}`;
};

/**
 * 주문번호 생성 (액션)
 * @returns 고유한 주문번호 (예: "ORD-20251205-1430")
 */
export const generateOrderNumber = (): string => {
  const now = new Date();
  const dateStr = formatDate(now).replace(/-/g, '');
  const timeStr = now.getHours().toString().padStart(2, '0') + 
                  now.getMinutes().toString().padStart(2, '0');
  return `ORD-${dateStr}-${timeStr}`;
};

/**
 * 알림 ID 생성 (액션)
 * @returns 고유한 알림 ID (타임스탬프 기반)
 */
export const generateNotificationId = (): string => {
  return Date.now().toString();
};

