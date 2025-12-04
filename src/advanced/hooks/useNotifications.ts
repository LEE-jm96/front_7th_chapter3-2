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
   * 알림 추가
   * @param message 알림 메시지
   * @param type 알림 타입 (error | success | warning)
   */
  const addNotification = useCallback((
    message: string, 
    type: 'error' | 'success' | 'warning' = 'success'
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // 자동으로 제거
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
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

