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
  it('hides edit mode after successful updateUser api call', async () => {
    setupInEditMode();
    userEvent.click(saveButton);
    const edit = await screen.findByRole('button', { name: 'Edit' });
    expect(edit).toBeInTheDocument();
  });
  it('displays updated username after successful updateUser api call', async () => {
    setupInEditMode();
    const input = screen.getByLabelText('Change your username');
    userEvent.clear(input);
    userEvent.type(input, 'user5-updated');
    userEvent.click(saveButton);
    const updatedUser = await screen.findByRole('heading', {
      name: 'user5-updated',
    });
    expect(updatedUser).toBeInTheDocument();
  });
  it('displays last updated user name in the input field after successful updateUser api call', async () => {
    setupInEditMode();
    let input = screen.getByLabelText('Change your username');
    userEvent.clear(input);
    userEvent.type(input, 'new-username');
    userEvent.click(saveButton);
    const edit = await screen.findByRole('button', { name: 'Edit' });
    userEvent.click(edit);
    input = screen.getByLabelText('Change your username');
    expect(input).toHaveValue('new-username');
  });
  it('hides edit mode on clicking cancel', async () => {
    setupInEditMode();
    const cancel = await screen.findByRole('button', { name: 'Cancel' });
    userEvent.click(cancel);
    const edit = await screen.findByRole('button', { name: 'Edit' });
    expect(edit).toBeInTheDocument();
  });
  it('displays last updated username when clicking cancel', async () => {
    setupInEditMode();
    const input = screen.getByLabelText('Change your username');
    userEvent.clear(input);
    userEvent.type(input, 'new-username');
    const cancel = await screen.findByRole('button', { name: 'Cancel' });
    userEvent.click(cancel);
    const username = await screen.findByRole('heading', {
      name: 'user5',
    });
    expect(username).toBeInTheDocument();
  });
  it('displays last updated name after clicking cancel in second edit', async () => {
    setupInEditMode();
    const input = screen.getByLabelText('Change your username');
    userEvent.clear(input);
    userEvent.type(input, 'new-username');
    userEvent.click(saveButton);
    const edit = await screen.findByRole('button', { name: 'Edit' });
    userEvent.click(edit);
    const cancel = await screen.findByRole('button', { name: 'Cancel' });
    userEvent.click(cancel);
    const header = await screen.findByRole('heading', {
      name: 'new-username',
    });
    expect(header).toBeInTheDocument();
  });
  it('displays delete button for logged in user', async () => {
    setup();
    const button = screen.getByRole('button', { name: 'Delete My Account' });
    expect(button).toBeInTheDocument();
  });
  it('does not displays delet button for other users', async () => {
    setup({ id: 2, username: 'user2' });
    const button = screen.queryByRole('button', { name: 'Delete My Account' });
    expect(button).not.toBeInTheDocument();
  });
  it('displays modal when clicing delete button', async () => {
    setup();
    let modal = screen.queryByTestId('modal');
    expect(modal).not.toBeInTheDocument();
    const deleteButton = screen.getByRole('button', {
      name: 'Delete My Account',
    });
    userEvent.click(deleteButton);
    modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();
  });
  it('displays confirmation message and cancel and yes buttons in modal', async () => {
    setup();
    const deleteButton = screen.queryByRole('button', {
      name: 'Delete My Account',
    });
    userEvent.click(deleteButton);
    expect(
      screen.getByText('Are you sure you want to delete your account?')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Yes' })).toBeInTheDocument();
  });
});
