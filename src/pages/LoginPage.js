import Input from '../components/Input';

const LoginPage = () => {
  const onChange = (event) => {
    const { id, value } = event.target;
    console.log(id, value);
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
          <Input id='email' label='E-mail' onChange={onChange} />
          <Input
            id='password'
            label='Password'
            type='password'
            onChange={onChange}
          />
          <div className='text-center'>
            <button className='btn btn-primary' onClick={(e) => console.log(e)}>
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
