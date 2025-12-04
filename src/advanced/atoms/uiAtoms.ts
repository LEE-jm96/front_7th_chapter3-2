import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// UI 상태
export const isAdminAtom = atom(false);
export const searchTermAtom = atom('');
export const debouncedSearchTermAtom = atom('');

