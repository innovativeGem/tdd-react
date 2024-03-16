const Spinner = (props) => {
  let classes = 'spinner-border';
  if (props.size !== 'big') {
    classes += ' spinner-border-sm';
  }
  return <span className={classes} role='status'></span>;
};

export default Spinner;
