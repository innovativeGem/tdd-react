import { createStore } from 'redux';
import authReducer from './authReducer';
import storage from './storage';

const createAppStore = () => {
  let initialState = storage.getItem('auth') || {
    isLoggedIn: false,
    id: '',
  };

  const store = createStore(
    authReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  // Whenever store is updated, subscribe block is called and it will update the local storage aswell
  store.subscribe(() => {
    storage.setItem('auth', store.getState());
  });

  return store;
};

export default createAppStore;
