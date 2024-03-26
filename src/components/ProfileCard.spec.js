import { render, screen, waitForElementToBeRemoved } from '../test/setup';
import storage from '../state/storage';
import ProfileCard from './ProfileCard';
import userEvent from '@testing-library/user-event';

import { setupServer } from 'msw/node';
import { rest } from 'msw';

let counter, id, requestBody, header;

const server = setupServer(
  rest.put('/api/1.0/users/:id', (req, res, ctx) => {
    counter += 1;
    id = req.params.id;
    requestBody = req.body;
    header = req.headers.get('Authorization');
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Profile Card', () => {
  const setup = (user = { id: 5, username: 'user5' }) => {
    storage.setItem('auth', {
      id: 5,
      username: 'user5',
      header: 'authorization header value',
    });
    render(<ProfileCard user={user} />);
  };

  let saveButton;
  const setupInEditMode = () => {
    setup();
    userEvent.click(screen.queryByRole('button', { name: 'Edit' }));
    saveButton = screen.getByRole('button', { name: 'Save' });
  };
  it('displays edit button for logged in user', async () => {
    setup();
    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toBeInTheDocument();
  });
  it('does not displays edit button for other users', async () => {
    setup({ id: 2, username: 'user2' });
    const button = screen.queryByRole('button', { name: 'Edit' });
    expect(button).not.toBeInTheDocument();
  });
  it('displays an input field after clicking edit', async () => {
    setup();
    expect(
      screen.queryByLabelText('Change your username')
    ).not.toBeInTheDocument();
    userEvent.click(screen.queryByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText('Change your username')).toBeInTheDocument();
  });
  it('displays Save and Cancel buttons in edit mode', async () => {
    setup();
    userEvent.click(screen.queryByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
  it('hides heading and edit button in edit mode', () => {
    setup();
    userEvent.click(screen.queryByRole('button', { name: 'Edit' }));
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'user5' })
    ).not.toBeInTheDocument();
  });
  it('has username as initial value in input', () => {
    setupInEditMode();
    const input = screen.getByLabelText('Change your username');
    expect(input.value).toBe('user5');
  });
  it('displays spinner during api calls', async () => {
    setupInEditMode();
    userEvent.click(saveButton);
    const spinner = screen.getByRole('status');
    await waitForElementToBeRemoved(spinner);
  });
  it('disables button during api calls', async () => {
    setupInEditMode();
    userEvent.click(saveButton);
    userEvent.click(saveButton);
    const spinner = screen.getByRole('status');
    await waitForElementToBeRemoved(spinner);
    expect(counter).toBe(1);
  });
  it('sends request to the server with correct looged in user id', async () => {
    setupInEditMode();
    userEvent.click(saveButton);
    const spinner = screen.getByRole('status');
    await waitForElementToBeRemoved(spinner);
    expect(id).toBe('5');
  });
  it('sends request body to the server with updated username', async () => {
    setupInEditMode();
    const input = screen.getByLabelText('Change your username');
    userEvent.clear(input);
    userEvent.type(input, 'user5-updated');
    userEvent.click(saveButton);
    const spinner = screen.getByRole('status');
    await waitForElementToBeRemoved(spinner);
    expect(requestBody).toEqual({ username: 'user5-updated' });
  });
  it('sends authorization request header in the api call', async () => {
    setupInEditMode();
    userEvent.click(saveButton);
    const spinner = screen.getByRole('status');
    await waitForElementToBeRemoved(spinner);
    expect(header).toBe('authorization header value');
  });
  it('sends request with valid username even when user does not update it', async () => {
    setupInEditMode();
    userEvent.click(saveButton);
    const spinner = screen.getByRole('status');
    await waitForElementToBeRemoved(spinner);
    expect(requestBody).toEqual({ username: 'user5' });
  });
});
