import { NotificationType } from '../context/NotificationContext';

type NotifyCallback = (message: string, type: NotificationType) => void;

let notifyCallback: NotifyCallback | null = null;

export const setNotifyCallback = (callback: NotifyCallback) => {
  notifyCallback = callback;
};

const notify = {
  success: (message: string) => notifyCallback?.(message, 'success'),
  error: (message: string) => notifyCallback?.(message, 'error'),
  warning: (message: string) => notifyCallback?.(message, 'warning'),
  info: (message: string) => notifyCallback?.(message, 'info'),
};

export default notify;
