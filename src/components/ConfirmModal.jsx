function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="confirm-modal-overlay"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="confirm-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="table-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="table-btn delete-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
