import { render, screen, waitForElementToBeRemoved } from '../test/setup';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import en from '../locale/en.json';
import tr from '../locale/tr.json';
import storage from '../state/storage';

let requestBody,
  counter = 0,
  acceptLanguageHeader;

const server = setupServer(
  rest.post('/api/1.0/auth', (req, res, ctx) => {
    acceptLanguageHeader = req.headers.get('Accept-Language');
    requestBody = req.body;
    counter += 1;
    return res(
      ctx.status(401),
      ctx.json({
        message: 'Incorrect credentials',
      })
    );
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

const loginSuccess = rest.post('/api/1.0/auth', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      id: '5',
      username: 'user5',
      image: null,
      token: 'abcdefg',
    })
  );
});

describe('Login page', () => {
  describe('Layout', () => {
    it('has header', () => {
      render(<LoginPage />);
      const header = screen.getByRole('heading', { name: 'Login' });
      expect(header).toBeInTheDocument();
    });

    it('has email input', () => {
      render(<LoginPage />);
      const input = screen.getByLabelText('E-mail');
      expect(input).toBeInTheDocument();
    });

    it('has password input', () => {
      render(<LoginPage />);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    it('has password type for password input', () => {
      render(<LoginPage />);
      const input = screen.getByLabelText('Password');
      expect(input.type).toBe('password');
    });

    it('has Login button', () => {
      render(<LoginPage />);
      const button = screen.getByRole('button', { name: 'Login' });
      expect(button).toBeInTheDocument();
    });

    it('disables button initially', () => {
      render(<LoginPage />);
      const button = screen.getByRole('button', { name: 'Login' });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    let emailInput, passwordInput, button;

    const setup = (email = 'user100@mail.com') => {
      render(<LoginPage />);
      emailInput = screen.getByLabelText('E-mail');
      passwordInput = screen.getByLabelText('Password');
      userEvent.type(emailInput, email);
      userEvent.type(passwordInput, 'P4ssword');
      button = screen.getByRole('button', { name: 'Login' });
    };

    it('should enable Login button if email and password values are entered', () => {
      setup();
      expect(button).toBeEnabled();
    });
    it('displays spinner for ongoing api calls', async () => {
      setup();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.queryByRole('status');
      await waitForElementToBeRemoved(spinner);
    });
    it('sends request body to backend after login button is clicked', async () => {
      setup();
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      await waitForElementToBeRemoved(spinner);
      expect(requestBody).toEqual({
        email: 'user100@mail.com',
        password: 'P4ssword',
      });
    });
    it('disables login button after api call', async () => {
      setup();
      userEvent.click(button);
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      await waitForElementToBeRemoved(spinner);
      expect(counter).toBe(1);
    });
    it('displays authentication fail message for failed request', async () => {
      setup();
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      await waitForElementToBeRemoved(spinner);
      const errorMessage = await screen.findByText('Incorrect credentials');
      expect(errorMessage).toBeInTheDocument();
    });
    it('entering new email value should clear error message', async () => {
      setup();
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      await waitForElementToBeRemoved(spinner);
      const errorMessage = await screen.findByText('Incorrect credentials');
      userEvent.type(emailInput, 'new@mail.com');
      expect(errorMessage).not.toBeInTheDocument();
    });
    it('entering new password value should clear error message', async () => {
      setup();
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      await waitForElementToBeRemoved(spinner);
      const errorMessage = await screen.findByText('Incorrect credentials');
      userEvent.type(passwordInput, 'new4ssword');
      expect(errorMessage).not.toBeInTheDocument();
    });
    it('stores id, username and image in storage', async () => {
      server.use(loginSuccess);
      setup('user5@mail.com');
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      await waitForElementToBeRemoved(spinner);
      const storedState = storage.getItem('auth');
      const objectFields = Object.keys(storedState);
      expect(objectFields.includes('id')).toBeTruthy();
      expect(objectFields.includes('username')).toBeTruthy();
      expect(objectFields.includes('image')).toBeTruthy();
    });
    it('stores authorization header value in the storage', async () => {
      server.use(loginSuccess);
      setup('user5@mail.com');
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      await waitForElementToBeRemoved(spinner);
      const storedState = storage.getItem('auth');
      expect(storedState.header).toBe('Bearer abcdefg');
    });
  });

  describe('Internationalization', () => {
    let turkishToggle, englishToggle;

    const setup = () => {
      render(<LoginPage />);
      turkishToggle = screen.getByTitle('Türkçe');
      englishToggle = screen.getByTitle('English');
    };

    it('initially renders all text in English', () => {
      setup();
      expect(
        screen.getByRole('heading', { name: en.login })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: en.login })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
    });
    it('renders turkish text when button is clicked', async () => {
      setup();
      userEvent.click(turkishToggle);
      expect(
        screen.getByRole('heading', { name: tr.login })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: tr.login })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(tr.email)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.password)).toBeInTheDocument();
    });
    it('sends accept language header "en" for outgoing request', async () => {
      setup();
      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Password');
      userEvent.type(emailInput, 'user100@mail.com');
      userEvent.type(passwordInput, 'P4ssword');
      const button = screen.getByRole('button', { name: 'Login' });
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      await waitForElementToBeRemoved(spinner);
      expect(acceptLanguageHeader).toBe('en');
    });
    it('sends accept language header "tr" for outgoing request, when turkish language is selected', async () => {
      setup();
      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Password');
      userEvent.type(emailInput, 'user100@mail.com');
      userEvent.type(passwordInput, 'P4ssword');
      const button = screen.getByRole('button', { name: 'Login' });
      userEvent.click(turkishToggle);
      userEvent.click(button);
      const spinner = screen.getByRole('status');
      await waitForElementToBeRemoved(spinner);
      expect(acceptLanguageHeader).toBe('tr');
    });
  });
});
