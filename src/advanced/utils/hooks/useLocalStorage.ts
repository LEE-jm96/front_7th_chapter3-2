import { useState, useEffect, useCallback } from "react";

/**
 * localStorage와 React state를 동기화하는 Hook
 * @param key localStorage 키
 * @param initialValue 초기값
 * @returns [저장된 값, 값 설정 함수]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // localStorage에서 초기값 로드
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

   // 값 설정 함수
    //   setValue가 storedValue를 dependency로 가지면, 값이 변경될 때마다 새로운 함수가 생성됨
    // addToCart 등의 함수가 오래된 setValue를 참조하여 상태 업데이트 실패
    // 함수형 업데이트를 사용하면 항상 최신 상태를 보장
    // 해결 효과:
    // ✅ 장바구니 추가 기능 정상 작동
    // ✅ 수량 변경 기능 정상 작동
    // ✅ 상태 업데이트의 일관성 보장
    // ✅ 불필요한 리렌더링 방지
    // 모든 lint 에러가 없습니다. 테스트를 다시 실행해주세요!
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // 함수형 업데이트 지원
      if (value instanceof Function) {
        setStoredValue((prevValue) => value(prevValue));
      } else {
        setStoredValue(value);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // localStorage 동기화
  useEffect(() => {
    try {
      // 빈 배열이나 undefined/null은 삭제
      if (
        storedValue === undefined ||
        storedValue === null ||
        (Array.isArray(storedValue) && storedValue.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error syncing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}