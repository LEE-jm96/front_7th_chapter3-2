import { useState, useEffect } from "react";

/**
 * 디바운스 Hook - 값이 변경되어도 지정된 시간 동안 대기 후 반환
 * @param value 디바운싱할 값
 * @param delay 지연 시간 (ms)
 * @returns 디바운싱된 값
 * 
 * 사용 예시: 검색어 입력 디바운싱
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 후에 debouncedValue 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: 값이 다시 변경되면 이전 타이머 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}