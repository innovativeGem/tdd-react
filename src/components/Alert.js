const Alert = (props) => {
  let classes = `alert alert-${props.type}`;
  if (props.center) {
    classes += ' text-center';
  }
  return <div className={classes}>{props.children}</div>;
};

Alert.defaultProps = {
  type: 'success',
};

export default Alert;
