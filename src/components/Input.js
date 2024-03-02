const Input = (props) => {
  const { id, label, onChange, help, type } = props;
  let inputClasses = 'form-control';
  if (help) {
    inputClasses += ' is-invalid';
  }
  return (
    <div className='mb-3'>
      <label htmlFor={id} className='form-label'>
        {label}
      </label>
      <input
        id={id}
        className={inputClasses}
        onChange={onChange}
        type={type || 'text'}
      />
      {help && <span className='text-red-500 invalid-feedback'>{help}</span>}
    </div>
  );
};

export default Input;
