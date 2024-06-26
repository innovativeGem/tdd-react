import SignUpPage from './SignUpPage';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../test/setup';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import en from '../locale/en.json';
import tr from '../locale/tr.json';

let requestBody;
let button, usernameInput, emailInput, passwordInput, passwordRepeatInput;
let counter = 0;
let acceptLanguageHeader;
// Setup MSW server
const server = setupServer(
  // Mock API call to intercept POST request
  rest.post('/api/1.0/users', (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    acceptLanguageHeader = req.headers.get('Accept-Language');
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Sign Up Page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<SignUpPage />);
      const header = screen.getByRole('heading', { name: 'Sign Up' });
      expect(header).toBeInTheDocument();
    });

    it('has username input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('has email input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('E-mail');
      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    it('has password type for password input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Password');
      expect(input.type).toBe('password');
    });

    it('has password repeat input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Password Repeat');
      expect(input).toBeInTheDocument();
    });

    it('has password type for password repeat input', () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText('Password Repeat');
      expect(input.type).toBe('password');
    });

    it('has Sign Up button', () => {
      render(<SignUpPage />);
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });

    it('disables button initially', () => {
      render(<SignUpPage />);
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    const setup = () => {
      render(<SignUpPage />);
      usernameInput = screen.getByLabelText('Username');
      emailInput = screen.getByLabelText('E-mail');
      passwordInput = screen.getByLabelText('Password');
      passwordRepeatInput = screen.getByLabelText('Password Repeat');
      userEvent.type(usernameInput, 'user1');
      userEvent.type(emailInput, 'user1@mail.com');
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');
      button = screen.queryByRole('button', { name: 'Sign Up' });
    };

    it('should enable Sign Up button if password and password repeat values match', () => {
      setup();
      expect(button).toBeEnabled();
    });

    it('sends username, email and password to backend on button click', async () => {
      setup();
      userEvent.click(button);

      await screen.findByText(
        'Please check your e-mail to activate your account'
      );

      expect(requestBody).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      });
    });

    it('disables button for ongoing api call', async () => {
      setup();
      userEvent.click(button);
      userEvent.click(button);

      await screen.findByText(
        'Please check your e-mail to activate your account'
      );

      expect(counter).toBe(1);
    });

    it('display spinner after clicking submit', async () => {
      setup();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      await screen.findByText(
        'Please check your e-mail to activate your account'
      );
    });

    it('shows message on successfull api response', async () => {
      setup();
      const message = 'Please check your e-mail to activate your account';
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(button);
      const successMsg = await screen.findByText(message);
      expect(successMsg).toBeInTheDocument();
    });

    it('hides sign up form after successful sign up request', async () => {
      setup();
      const form = screen.getByTestId('form-sign-up');
      userEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });

    const generateValidationError = (field, message) => {
      return rest.post('/api/1.0/users', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: { [field]: [message] },
          })
        );
      });
    };

    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'email'}    | ${'E-mail cannot be null'}
      ${'password'} | ${'Password cannot be null'}
    `('displays $message for $field', async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });

    it('hides spinner and enables button after response received', async () => {
      server.use(
        generateValidationError('username', 'Username cannot be null')
      );
      setup();
      userEvent.click(button);
      await screen.findByText('Username cannot be null');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it('displays password mismatch message when passwords are not same', () => {
      setup();
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'AnotherP4ssword');
      const validationError = screen.queryByText('Password mismatch');
      expect(validationError).toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${'username'} | ${'Username cannot be null'} | ${'Username'}
      ${'email'}    | ${'E-mail cannot be null'}   | ${'E-mail'}
      ${'password'} | ${'Password cannot be null'} | ${'Password'}
    `(
      'clears validation errors when $field is upadated',
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));
        setup();
        userEvent.click(button);
        const validationErrors = await screen.findByText(message);
        userEvent.type(screen.getByLabelText(label), 'updated');
        expect(validationErrors).not.toBeInTheDocument();
      }
    );
  });
  describe('Internationalization', () => {
    let turkishToggle, englishToggle, passwordInput, passwordRepeatInput;

    const setup = () => {
      render(<SignUpPage />);
      turkishToggle = screen.getByTitle('Türkçe');
      englishToggle = screen.getByTitle('English');
      passwordInput = screen.getByLabelText(en.password);
      passwordRepeatInput = screen.getByLabelText(en.passwordRepeat);
    };

    it('initially renders all text in English', () => {
      setup();
      expect(
        screen.getByRole('heading', { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });
    it('renders text in Turkish when language is changed to Turkish', () => {
      setup();
      userEvent.click(turkishToggle);

      expect(
        screen.getByRole('heading', { name: tr.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: tr.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(tr.username)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.email)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.password)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.passwordRepeat)).toBeInTheDocument();
    });
    it('renders text in English when language is changed to English', () => {
      setup();

      userEvent.click(turkishToggle);
      userEvent.click(englishToggle);

      expect(
        screen.getByRole('heading', { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it('displays password mismatch validation message in Turkish', () => {
      setup();
      userEvent.click(turkishToggle);

      userEvent.type(passwordInput, 'P4ss');
      const validationMessageInTurkish = screen.queryByText(
        tr.passwordMismatchValidation
      );
      expect(validationMessageInTurkish).toBeInTheDocument();
    });

    it('sends accept language header as en for outgoing request', async () => {
      setup();

      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');
      const button = screen.getByRole('button', { name: en.signUp });
      userEvent.click(button);
      const form = screen.queryByTestId('form-sign-up');
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe('en');
    });

    it('sends accept language header as tr when outgoing request config is changed to Turkish', async () => {
      setup();

      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(passwordRepeatInput, 'P4ssword');
      const button = screen.getByRole('button', { name: en.signUp });
      userEvent.click(turkishToggle);
      userEvent.click(button);
      const form = screen.queryByTestId('form-sign-up');
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe('tr');
    });
  });
});
