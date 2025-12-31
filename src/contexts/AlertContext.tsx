import { createContext, useContext, useState, useCallback, type ReactNode, useRef } from 'react';
import { AlertModal, type AlertType } from '../components/molecules/AlertModal';

interface AlertOptions {
  title?: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

interface AlertContextType {
  showAlert: (message: string, options?: Omit<AlertOptions, 'message'>) => Promise<void>;
  showConfirm: (message: string, options?: Omit<AlertOptions, 'message'>) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AlertOptions>({ message: '', type: 'info', title: 'Alerta' });
  const resolveRef = useRef<((value: boolean | void) => void) | null>(null);

  const closeAlert = useCallback(() => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  const confirmAlert = useCallback(() => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  }, []);

  const showAlert = useCallback((message: string, options?: Omit<AlertOptions, 'message'>) => {
    return new Promise<void>((resolve) => {
      setConfig({
        message,
        title: 'Alerta',
        type: 'info',
        ...options
      });
      resolveRef.current = () => resolve();
      setIsOpen(true);
    });
  }, []);

  const showConfirm = useCallback((message: string, options?: Omit<AlertOptions, 'message'>) => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        message,
        title: 'Confirmação',
        type: 'confirm', 
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        showCancel: true,
        ...options
      });
      resolveRef.current = (val) => resolve(val as boolean);
      setIsOpen(true);
    });
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AlertModal
        isOpen={isOpen}
        message={config.message}
        title={config.title || ''}
        type={config.type || 'info'}
        onClose={closeAlert}
        onConfirm={confirmAlert}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        showCancel={config.showCancel}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
