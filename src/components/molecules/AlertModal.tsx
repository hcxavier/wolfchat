import { useRef, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '../atoms/Buttons';

export type AlertType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

interface AlertModalProps {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const AlertModal = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  showCancel = false
}: AlertModalProps & { showCancel?: boolean }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ... (keep useEffect)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-in zoom-in-50 duration-300">
            <AlertTriangle size={36} className="text-red-500 drop-shadow-md" />
          </div>
        );
      case 'warning':
        return (
          <div className="bg-amber-500/10 p-4 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-in zoom-in-50 duration-300">
            <AlertTriangle size={36} className="text-amber-500 drop-shadow-md" />
          </div>
        );
      case 'success':
        return (
          <div className="bg-green-500/10 p-4 rounded-full border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-in zoom-in-50 duration-300">
            <CheckCircle size={36} className="text-green-500 drop-shadow-md" />
          </div>
        );
      case 'confirm':
      default:
        return (
          <div className="bg-brand-500/10 p-4 rounded-full border border-brand-500/20 shadow-[0_0_15px_rgba(255,20,87,0.3)] animate-in zoom-in-50 duration-300">
            <Info size={36} className="text-brand-500 drop-shadow-md" />
          </div>
        );
    }
  };

  const getConfirmButtonVariant = (): 'solid' | 'outline' | 'ghost' | 'sidebar' => {
    if (type === 'error' ) return 'solid'; 
    return 'solid';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-sm bg-surface-card border border-white/10 dark:border-white/5 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden scale-100 animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 text-primary ring-1 ring-white/5"
      >
        
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="p-8 flex flex-col items-center text-center">
          <div className="mb-6">
            {getIcon()}
          </div>
          
          <div className="space-y-3 mb-8">
            <h3 className="text-xl font-bold text-primary tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-primary/60 leading-relaxed font-medium">
              {message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            {showCancel ? (
              <>
                <Button 
                  onClick={onClose}
                  variant="ghost"
                  className="w-full sm:flex-1 text-primary/60 hover:text-primary hover:bg-primary/5 rounded-xl h-11 border border-primary/10"
                >
                  {cancelText}
                </Button>
                <Button 
                  onClick={() => {
                    if (onConfirm) onConfirm();
                  }}
                  variant={getConfirmButtonVariant()}
                  className={`w-full sm:flex-1 h-11 shadow-lg ${type === 'error' || type === 'warning' ? 'shadow-red-500/20 hover:shadow-red-500/40' : 'shadow-brand-500/20'}`}
                >
                  {confirmText}
                </Button>
              </>
            ) : (
              <Button 
                onClick={onClose}
                variant="solid"
                className="w-full h-11"
              >
                OK
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
