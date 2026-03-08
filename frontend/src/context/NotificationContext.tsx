import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

import ToastNotification from '../components/ui/ToastNotification';
import { setNotifyCallback } from '../utils/notify';
import { useEffect } from 'react';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    setNotification({ id: Date.now(), message, type });
  }, []);

  useEffect(() => {
    setNotifyCallback(showNotification);
  }, [showNotification]);

  const handleClose = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <ToastNotification 
          key={notification.id}
          message={notification.message} 
          type={notification.type} 
          onClose={handleClose} 
        />
      )}
    </NotificationContext.Provider>
  );
};
