import { useEffect, useState } from 'react';
import Input from '../components/Input';
import Spinner from '../components/Spinner';
import { login } from '../api/apiCalls';
import Alert from '../components/Alert';

const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  let disabled = !(email && password);

  useEffect(() => {
    setErrorMessage();
  }, [email, password]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPendingApiCall(true);
    async function submitData() {
      try {
        const response = await login({ email, password });
        console.log(response);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
      setPendingApiCall(false);
    }
    submitData();
  };
  return (
    <div
      className='col-lg-6 offset-lg-3 col-md-8 offset-md-2'
      data-testid='login-page'
    >
      <form className='card'>
        <div className='card-header'>
          <h1 className='text-center'>Login</h1>
        </div>
        <div className='card-body'>
          <Input
            id='email'
            label='E-mail'
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id='password'
            label='Password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <Alert type='danger'>{errorMessage}</Alert>}
          <div className='text-center'>
            <button
              className='btn btn-primary'
              onClick={onSubmit}
              disabled={disabled || pendingApiCall}
            >
              {pendingApiCall && <Spinner />}
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
