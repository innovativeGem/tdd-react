import { render, screen } from '@testing-library/react';
import AccountActivationPage from './AccountActivationPage';

import { setupServer } from 'msw/node';
import { rest } from 'msw';

let counter = 0;
// Setup MSW server
const server = setupServer(
  // Mock API call to intercept POST request
  rest.post('/api/1.0/users/token/:id', (req, res, ctx) => {
    counter += 1;
    if (req.params.id === '5678') {
      return res(ctx.status(400));
    }
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Account Activation Page', () => {
  const setup = (token) => {
    const match = { params: { id: token } };
    render(<AccountActivationPage match={match} />);
  };
  it('displays activation success message if token is valid', async () => {
    setup('1234');
    const message = await screen.findByText('Account is activated');
    expect(message).toBeInTheDocument();
  });

  it('sends activation request to backend', async () => {
    setup('1234');
    await screen.findByText('Account is activated');
    expect(counter).toBe(1);
  });

  it('displays activation failure message if token is invalid', async () => {
    setup('5678');
    const message = await screen.findByText('Activation failure');
    expect(message).toBeInTheDocument();
  });

  it('sends requests to backend when token is changed', async () => {
    const match = { params: { token: '1234' } };
    const { rerender } = render(<AccountActivationPage match={match} />);
    await screen.findByText('Account is activated');
    match.params.id = '5678';
    rerender(<AccountActivationPage match={match} />);
    await screen.findByText('Activation failure');
    expect(counter).toBe(2);
  });

  it('displays spinner when activation api call is in progress', async () => {
    const match = { params: { token: '1234' } };
    const { rerender } = render(<AccountActivationPage match={match} />);
    await screen.findByText('Account is activated');
    match.params.id = '5678';
    rerender(<AccountActivationPage match={match} />);
    const spinner = screen.getByRole('status');
    await screen.findByText('Activation failure');
    expect(spinner).not.toBeInTheDocument();
  });

  it('displays spinner after second api call changed token', async () => {
    setup('5678');
    const spinner = screen.queryByRole('status');
    expect(spinner).toBeInTheDocument();
  });
});
