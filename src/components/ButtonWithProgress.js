import Spinner from './Spinner';

const ButtonWithProgress = (props) => {
  const { disabled, apiProgress, onClick } = props;
  return (
    <button
      className='btn btn-primary'
      onClick={onClick}
      disabled={disabled || apiProgress}
    >
      {apiProgress && <Spinner />}
      {props.children}
    </button>
  );
};

export default ButtonWithProgress;
