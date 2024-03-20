import { render, screen } from '@testing-library/react';
import App from '../src/App';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const page1 = {
  content: [
    {
      id: 1,
      username: 'user-in-list',
      email: 'user-in-list@mail.com',
      image: null,
    },
  ],
  page: 0,
  size: 0,
  totalPages: 0,
};

const server = setupServer(
  rest.post('/api/1.0/users/token/:token', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get('/api/1.0/users', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(page1));
  }),
  rest.get('/api/1.0/users/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        username: 'user1',
        email: 'user1@mail.com',
        image: null,
      })
    );
  }),
  rest.post('/api/1.0/auth', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ username: 'user5' }));
  })
);

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const setup = (path) => {
  window.history.pushState(null, '', path);
  render(<App />);
};

describe('Routing', () => {
  it.each`
    path               | pageTestId
    ${'/'}             | ${'home-page'}
    ${'/signup'}       | ${'signup-page'}
    ${'/login'}        | ${'login-page'}
    ${'/user/1'}       | ${'user-page'}
    ${'/user/2'}       | ${'user-page'}
    ${'/activate/123'} | ${'activation-page'}
    ${'/activate/456'} | ${'activation-page'}
  `('displays $pageTestId when path is $path', ({ path, pageTestId }) => {
    setup(path);
    const homePage = screen.getByTestId(pageTestId);
    expect(homePage).toBeInTheDocument();
  });

  it.each`
    path               | pageTestId
    ${'/'}             | ${'signup-page'}
    ${'/'}             | ${'login-page'}
    ${'/'}             | ${'user-page'}
    ${'/'}             | ${'activation-page'}
    ${'/signup'}       | ${'home-page'}
    ${'/signup'}       | ${'login-page'}
    ${'/signup'}       | ${'user-page'}
    ${'/signup'}       | ${'activation-page'}
    ${'/login'}        | ${'home-page'}
    ${'/login'}        | ${'signup-page'}
    ${'/login'}        | ${'user-page'}
    ${'/login'}        | ${'activation-page'}
    ${'/user/1'}       | ${'home-page'}
    ${'/user/1'}       | ${'signup-page'}
    ${'/user/1'}       | ${'login-page'}
    ${'/user/1'}       | ${'activation-page'}
    ${'/activate/123'} | ${'home-page'}
    ${'/activate/123'} | ${'signup-page'}
    ${'/activate/123'} | ${'login-page'}
    ${'/activate/123'} | ${'user-page'}
  `(
    'does not display $pageTestId page when path is $path',
    ({ path, pageTestId }) => {
      setup(path);
      const signUp = screen.queryByTestId(pageTestId);
      expect(signUp).not.toBeInTheDocument();
    }
  );

  it.each`
    targetPage
    ${'/'}
    ${'/signup'}
    ${'/login'}
  `('has link to $targetPage in Navbar', ({ targetPage }) => {
    setup(targetPage);
    // const link = screen.getByRole('link', { name: 'Hoaxify' });
    const link = screen.getByTitle('Home');
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | clickingTo   | visiblePage
    ${'/'}       | ${'Sign Up'} | ${'signup-page'}
    ${'/signup'} | ${'Login'}   | ${'login-page'}
    ${'/login'}  | ${'Home'}    | ${'home-page'}
  `(
    'navigates to $visiblePage page when $clickingTo is clicked',
    ({ initialPath, clickingTo, visiblePage }) => {
      setup(initialPath);
      //   const link = screen.getByRole('link', { name: clickingTo });
      const link = screen.getByTitle(clickingTo);
      userEvent.click(link);
      const page = screen.getByTestId(visiblePage);
      expect(page).toBeInTheDocument();
    }
  );

  it('displays home page when clicked on logo', () => {
    setup('/');
    const logo = screen.getByAltText('Hoaxify');
    userEvent.click(logo);

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('navigates to user page when user button is clicked', async () => {
    setup('/');
    const user = await screen.findByText('user-in-list');
    userEvent.click(user);
    const userPage = await screen.findByTestId('user-page');
    expect(userPage).toBeInTheDocument();
  });
});

describe('Login', () => {
  it('navigates to homepage after successful login', async () => {
    setup('/login');
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Password');
    userEvent.type(emailInput, 'user5@mail.com');
    userEvent.type(passwordInput, 'P4ssword');
    const button = screen.getByRole('button', { name: 'Login' });
    userEvent.click(button);
    const homePage = await screen.findByTestId('home-page');
    expect(homePage).toBeInTheDocument();
  });
});

console.error = () => {};
