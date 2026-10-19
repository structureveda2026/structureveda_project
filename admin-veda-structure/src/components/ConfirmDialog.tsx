import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  cancelLabel?: string;
  danger?: boolean;
  type?: string;
  variant?: string;
  confirmVariant?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  open,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  danger = false,
  type,
  variant,
  confirmVariant,
  loading = false,
}: ConfirmDialogProps) {
  const showOpen = Boolean(typeof isOpen !== 'undefined' ? isOpen : open);
  const handleClose = onClose || onCancel || (() => {});
  const isDanger =
    danger ||
    type === 'danger' ||
    variant === 'danger' ||
    confirmVariant === 'danger';
  const actionText = confirmText || confirmLabel || 'Confirm';
  const resolvedCancelText = cancelText || cancelLabel || 'Cancel';

  return (
    <Modal isOpen={showOpen} onClose={handleClose} title={title} size="sm">
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
