import { useEffect, useState } from 'react';
import Input from '../components/Input';
import { login } from '../api/apiCalls';
import Alert from '../components/Alert';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { loginSuccess } from '../state/authActions';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const dispatch = useDispatch();
  const history = useHistory();

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
        history.push('/');
        dispatch(
          loginSuccess({
            ...response.data,
            header: `Bearer ${response.data.token}`,
          })
        );
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
          <h1 className='text-center'>{t('login')}</h1>
        </div>
        <div className='card-body'>
          <Input
            id='email'
            label={t('email')}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id='password'
            label={t('password')}
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <Alert type='danger'>{errorMessage}</Alert>}
          <div className='text-center'>
            <ButtonWithProgress
              disabled={disabled}
              apiProgress={pendingApiCall}
              onClick={onSubmit}
            >
              {t('login')}
            </ButtonWithProgress>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
