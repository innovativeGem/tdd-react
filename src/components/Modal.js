import ButtonWithProgress from './ButtonWithProgress';

const Modal = (props) => {
  const {
    content,
    cancelButton,
    confirmButton,
    onClickCancel,
    onClickConfirm,
    apiProgress,
  } = props;
  return (
    <div
      className='bg-black bg-opacity-50 d-block modal show'
      data-testid='modal'
      tabIndex='-1'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-body'>
            <p>{content}</p>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={onClickCancel}
            >
              {cancelButton}
            </button>
            <ButtonWithProgress
              onClick={onClickConfirm}
              apiProgress={apiProgress}
            >
              {confirmButton}
            </ButtonWithProgress>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.defaultProps = {
  cancelButton: 'Cancel',
  confirmButton: 'Yes',
  onClickCancel: () => console.log('onClickCancel is not set'),
  onClickConfirm: () => console.log('onClickConfirm is not set'),
  apiProgress: false,
};

export default Modal;
