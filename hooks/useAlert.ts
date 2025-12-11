import { useState, useCallback } from 'react';

interface AlertOptions {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

interface AlertState extends AlertOptions {
  isOpen: boolean;
  onConfirm?: () => void;
}

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      ...options,
      isOpen: true
    });
  }, []);

  const showConfirm = useCallback((options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setAlertState({
        ...options,
        type: 'confirm',
        isOpen: true,
        onConfirm: () => {
          console.log('✅ Confirmation cliquée - résolution Promise avec true');
          resolve(true);
        }
      });
      
      // Store resolve function for cancel action
      (window as any).__currentConfirmResolve = () => {
        console.log('❌ Annulation cliquée - résolution Promise avec false');
        resolve(false);
      };
    });
  }, []);

  const closeAlert = useCallback(() => {
    // If closing a confirm modal without confirming, resolve with false
    if ((window as any).__currentConfirmResolve) {
      (window as any).__currentConfirmResolve();
      (window as any).__currentConfirmResolve = null;
    }
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    alertState,
    showAlert,
    showConfirm,
    closeAlert
  };
};
