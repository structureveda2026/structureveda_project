import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  danger?: boolean;
  type?: string;
  variant?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText,
  confirmLabel,
  cancelText = 'Cancel',
  danger = false,
  type,
  variant,
}: ConfirmDialogProps) {
  const handleClose = onClose || onCancel || (() => {});
  const isDanger = danger || type === 'danger' || variant === 'danger';
  const actionText = confirmText || confirmLabel || 'Confirm';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm">
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isDanger ? 'bg-red-50' : 'bg-saffron-50'}`}>
          <AlertTriangle className={`w-6 h-6 ${isDanger ? 'text-red-500' : 'text-saffron-500'}`} />
        </div>
        <p className="text-sm text-charcoal-600 pt-3">{message}</p>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={handleClose} className="btn-secondary">{cancelText}</button>
        <button
          onClick={async () => { await onConfirm(); handleClose(); }}
          className={isDanger ? 'btn-danger' : 'btn-primary'}
        >
          {actionText}
        </button>
      </div>
    </Modal>
  );
}
