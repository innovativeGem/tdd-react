import { Component } from 'react';
import axios from 'axios';
import Input from '../components/Input';
import { withTranslation } from 'react-i18next';
import { signUp } from '../api/apiCalls';

class SignUpPage extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    apiProgress: false,
    signUpSuccess: false,
    errors: {},
  };

  onChange = (event) => {
    const { id, value } = event.target;
    const errorCopy = { ...this.state.errors };
    delete errorCopy[id];
    this.setState({
      [id]: value,
      errors: errorCopy,
    });
  };

  submit = async (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true });
    try {
      await signUp(body);
      this.setState({ signUpSuccess: true });
    } catch (error) {
      if (error.response.status === 400) {
        this.setState({ errors: error.response.data.validationErrors });
      }
      this.setState({ apiProgress: false });
    }
  };

  render() {
    const { t } = this.props;
    let disabled = true;
    const { password, passwordRepeat, apiProgress, signUpSuccess, errors } =
      this.state;
    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }

    const passwordMismatch =
      password !== passwordRepeat ? t('passwordMismatchValidation') : '';

    return (
      <div
        className='col-lg-6 offset-lg-3 col-md-8 offset-md-2'
        data-testid='signup-page'
      >
        {!signUpSuccess && (
          <form className='card mt-5' data-testid='form-sign-up'>
            <div className='card-header'>
              <h1 className='text-center'>{t('signUp')}</h1>
            </div>
            <div className='card-body'>
              <Input
                id='username'
                label={t('username')}
                onChange={this.onChange}
                help={errors?.username}
              />
              <Input
                id='email'
                label={t('email')}
                onChange={this.onChange}
                help={errors?.email}
              />
              <Input
                id='password'
                label={t('password')}
                type='password'
                onChange={this.onChange}
                help={errors?.password}
              />
              <Input
                id='passwordRepeat'
                label={t('passwordRepeat')}
                type='password'
                onChange={this.onChange}
                help={passwordMismatch}
              />
              <div className='text-center'>
                <button
                  className='btn btn-primary'
                  disabled={disabled || apiProgress}
                  onClick={(e) => this.submit(e)}
                >
                  {apiProgress && (
                    <span
                      className='spinner-border spinner-border-sm'
                      role='status'
                    ></span>
                  )}
                  {t('signUp')}
                </button>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <div className='alert alert-success mt-3'>
            Please check your e-mail to activate your account
          </div>
        )}
      </div>
    );
  }
}

const SignUpPageWithTranslation = withTranslation()(SignUpPage);

export default SignUpPageWithTranslation;
