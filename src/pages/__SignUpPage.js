import { useState } from 'react';
import axios from 'axios';

const SignUpPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [apiProgress, setApiProgress] = useState(false);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    setDisabled(password === passwordRepeat);
  };
  const onChangePasswordRepeat = (e) => {
    setPasswordRepeat(e.target.value);
    setDisabled(password === passwordRepeat);
  };

  const submit = (e) => {
    e.preventDefault();
    const body = { username, email, password };
    // http://localhost:8080/api/1.0/users

    // fetch('http://localhost:8080/api/1.0/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': 'http://localhost:8080/',
    //   },
    //   body: JSON.stringify(body),
    // });

    setApiProgress(true);
    axios.post('/api/1.0/users', body);
  };
  return (
    <div className='col-lg-6 offset-lg-3 col-md-8 offset-md-4'>
      <form className='card mt-2'>
        <div className='card-header'>
          <h1 className='text-center'>Sign Up</h1>
        </div>
        <div className='card-body'>
          <div className='mb-3'>
            <label className='form-label' htmlFor='username'>
              Username
            </label>
            <input
              className='form-control'
              id='username'
              onChange={onChangeUsername}
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='email'>
              E-mail
            </label>
            <input
              className='form-control'
              id='email'
              onChange={onChangeEmail}
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='password'>
              Password
            </label>
            <input
              className='form-control'
              id='password'
              type='password'
              onChange={onChangePassword}
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='passwordRepeat'>
              Password Repeat
            </label>
            <input
              className='form-control'
              id='passwordRepeat'
              type='password'
              onChange={onChangePasswordRepeat}
            />
          </div>
          <div className='text-center'>
            <button
              className='btn btn-primary'
              disabled={disabled || apiProgress}
              onClick={submit}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
