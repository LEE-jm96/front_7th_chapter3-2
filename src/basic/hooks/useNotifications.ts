import { useState, useCallback } from "react";

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

interface UseNotificationsOptions {
  duration?: number; // 알림 표시 시간 (ms)
}

/**
 * 알림 메시지를 관리하는 Hook
 * @param options duration (기본값: 3000ms)
 * @returns { notifications, addNotification, removeNotification }
 */
export function useNotifications(options?: UseNotificationsOptions) {
  const { duration = 3000 } = options || {};
  
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * 알림 추가 (순수 함수 - ID는 외부에서 주입)
   * @param message 알림 메시지
   * @param type 알림 타입 (error | success | warning)
   * @param id 알림 ID (선택적 - 테스트용)
   */
  const addNotification = useCallback((
    message: string, 
    type: 'error' | 'success' | 'warning' = 'success',
    id?: string
  ) => {
    const notificationId = id || Date.now().toString();
    setNotifications(prev => [...prev, { id: notificationId, message, type }]);
    
    // 자동으로 제거
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, duration);
  }, [duration]);

  /**
   * 알림 수동 제거
   * @param id 제거할 알림 ID
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);


  return {
    notifications,
    addNotification,
    removeNotification,
  };
}

