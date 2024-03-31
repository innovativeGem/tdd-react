const reducer = (state, action) => {
  if (action.type === 'login-success') {
    const newState = { ...state, ...action.payload, isLoggedIn: true };
    return newState;
  } else if (action.type === 'user-update-success') {
    const newState = {
      ...state,
      username: action.payload.username,
    };
    return newState;
  } else if (action.type === 'logout-success') {
    return {
      isLoggedIn: false,
    };
  }
  return state;
};

export default reducer;
