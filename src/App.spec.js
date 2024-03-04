import { render, screen } from '@testing-library/react';
import App from '../src/App';
import userEvent from '@testing-library/user-event';

describe('Routing', () => {
  const setup = (path) => {
    window.history.pushState(null, '', path);
    render(<App />);
  };
  it.each`
    path         | pageTestId
    ${'/'}       | ${'home-page'}
    ${'/signup'} | ${'signup-page'}
    ${'/login'}  | ${'login-page'}
    ${'/user/1'} | ${'user-page'}
    ${'/user/2'} | ${'user-page'}
  `('displays $pageTestId when path is $path', ({ path, pageTestId }) => {
    setup(path);
    const homePage = screen.getByTestId(pageTestId);
    expect(homePage).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${'/'}       | ${'signup-page'}
    ${'/'}       | ${'login-page'}
    ${'/'}       | ${'user-page'}
    ${'/signup'} | ${'home-page'}
    ${'/signup'} | ${'login-page'}
    ${'/signup'} | ${'user-page'}
    ${'/login'}  | ${'home-page'}
    ${'/login'}  | ${'signup-page'}
    ${'/login'}  | ${'user-page'}
    ${'/user/1'} | ${'home-page'}
    ${'/user/1'} | ${'signup-page'}
    ${'/user/1'} | ${'login-page'}
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
