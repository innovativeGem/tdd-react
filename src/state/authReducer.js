const reducer = (state, action) => {
  if (action.type === 'login-success') {
    const newState = { ...state, ...action.payload, isLoggedIn: true };
    return newState;
  }
  return state;
};

export default reducer;
