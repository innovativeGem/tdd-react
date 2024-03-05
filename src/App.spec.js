import { render, screen } from '@testing-library/react';
import App from '../src/App';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
const server = setupServer(
  rest.post('/api/1.0/users/token/:token', (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

describe('Routing', () => {
  const setup = (path) => {
    window.history.pushState(null, '', path);
    render(<App />);
  };
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
});

console.error = () => {};
