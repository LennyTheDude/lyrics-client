import './ConfirmLeaveModal.scss';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmLeaveModal({ open, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="confirm-leave-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-leave-title">
      <div className="confirm-leave-modal">
        <p id="confirm-leave-title" className="confirm-leave-modal-message">
          You have unsaved changes. Are you sure you want to leave?
        </p>
        <div className="confirm-leave-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Stay</button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>Leave</button>
        </div>
      </div>
    </div>
  );
}
