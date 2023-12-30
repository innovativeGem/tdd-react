import { useState } from 'react';

const SignUpPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

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
    fetch('http://localhost:8080/api/1.0/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    // http://localhost:8080/api/1.0/users
    // axios.post('/api/1.0/users', body);
  };
  return (
    <div>
      <h1>Sign Up</h1>
      <form>
        <label htmlFor='username'>Username</label>
        <input id='username' onChange={onChangeUsername} />
        <label htmlFor='email'>E-mail</label>
        <input id='email' onChange={onChangeEmail} />
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' onChange={onChangePassword} />
        <label htmlFor='passwordRepeat'>Password Repeat</label>
        <input
          id='passwordRepeat'
          type='password'
          onChange={onChangePasswordRepeat}
        />
        <button disabled={disabled} onClick={submit}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
