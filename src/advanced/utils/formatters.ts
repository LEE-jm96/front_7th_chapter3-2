/**
 * 관리자용 가격 포맷팅 (숫자 + 원)
 * @param price 가격
 * @returns 포맷된 가격 문자열 (예: "10,000원")
 */
export const formatAdminPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

/**
 * 고객용 가격 포맷팅 (₩ 기호 포함)
 * @param price 가격
 * @returns 포맷된 가격 문자열 (예: "₩10,000")
 */
export const formatCustomerPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 * @param date 날짜 객체
 * @returns 포맷된 날짜 문자열 (예: "2025-12-03")
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 소수를 퍼센트로 변환
 * @param rate 소수 형태의 비율 (0 ~ 1)
 * @returns 퍼센트 문자열 (예: "10%")
 */
export const formatPercentage = (rate: number): string => {
  return `${(rate * 100).toFixed(0)}%`;
};

/**
 * 할인 금액 포맷팅 (마이너스 기호 포함)
 * @param amount 할인 금액
 * @returns 포맷된 할인 금액 문자열 (예: "-5,000원")
 */
export const formatDiscountAmount = (amount: number): string => {
  return `-${amount.toLocaleString()}원`;
};
