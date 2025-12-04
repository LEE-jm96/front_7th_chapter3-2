import { useMemo } from 'react';
import { Product } from '../../types';

interface UseSearchOptions<T extends Product> {
  items: T[];
  searchTerm: string;
  searchFields?: (keyof T)[];
}

/**
 * 검색/필터링 로직을 처리하는 Hook
 * @param items 검색할 아이템 목록
 * @param searchTerm 검색어
 * @param searchFields 검색할 필드 목록 (기본값: ['name', 'description'])
 * @returns 필터링된 아이템 목록
 */
export function useSearch<T extends Product>({
  items,
  searchTerm,
  searchFields = ['name', 'description'] as (keyof T)[]
}: UseSearchOptions<T>) {
  const filteredItems = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return items;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerSearchTerm);
        }
        return false;
      });
    });
  }, [items, searchTerm, searchFields]);

  return {
    filteredItems,
  };
}

