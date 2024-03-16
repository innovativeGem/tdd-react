import { render, screen } from '@testing-library/react';
import UserList from './UserList';

import { setupServer } from 'msw/node';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import en from '../locale/en.json';
import tr from '../locale/tr.json';
import LanguageSelector from './LanguageSelector';

const users = [
  { id: 1, username: 'user1', email: 'user1@mail.com', image: null },
  { id: 2, username: 'user2', email: 'user2@mail.com', image: null },
  { id: 3, username: 'user3', email: 'user3@mail.com', image: null },
  { id: 4, username: 'user4', email: 'user4@mail.com', image: null },
  { id: 5, username: 'user5', email: 'user5@mail.com', image: null },
  { id: 6, username: 'user6', email: 'user6@mail.com', image: null },
  { id: 7, username: 'user7', email: 'user7@mail.com', image: null },
];

const getPage = (page, size) => {
  const start = page * size;
  const end = start + size;
  const totalPages = Math.ceil(users.length / size);

  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages,
  };
};

// Setup MSW server
const server = setupServer(
  rest.get('/api/1.0/users', (req, res, ctx) => {
    let page = Number.parseInt(req.url.searchParams.get('page'));
    let size = Number.parseInt(req.url.searchParams.get('size'));
    if (Number.isNaN(page)) {
      page = 0;
    }
    if (Number.isNaN(size)) {
      size = 5;
    }
    return res(ctx.status(200), ctx.json(getPage(page, size)));
  })
);

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('User List', () => {
  const setup = () => {
    render(
      <Router>
        <UserList />
        <LanguageSelector />
      </Router>
    );
  };
  describe('Interactions', () => {
    it('displays three users in a list', async () => {
      setup();
      const users = await screen.findAllByText(/user/);
      expect(users.length).toBe(3);
    });
    it('displays next page link', async () => {
      setup();
      await screen.findByText('user1');
      expect(screen.getByText('next >')).toBeInTheDocument();
    });
    it('displays next page users', async () => {
      setup();
      await screen.findByText('user1');
      const nextPageLink = screen.getByText('next >');
      userEvent.click(nextPageLink);
      const firstUserOnPage2 = await screen.findByText('user4');
      expect(firstUserOnPage2).toBeInTheDocument();
    });
    it('hides next page link on last page', async () => {
      setup();
      await screen.findByText('user1');
      const nextPageLink = screen.getByText('next >');
      userEvent.click(nextPageLink);
      await screen.findByText('user4');
      userEvent.click(nextPageLink);
      await screen.findByText('user7');
      expect(screen.queryByText('next >')).not.toBeInTheDocument();
    });
    it('displays previous page link on second page', async () => {
      setup();
      await screen.findByText('user1');
      const nextPageLink = screen.getByText('next >');
      userEvent.click(nextPageLink);
      await screen.findByText('user4');
      expect(screen.getByText('< previous')).toBeInTheDocument();
    });
    it('displays previous page users when user click previous button', async () => {
      setup();
      await screen.findByText('user1');
      const nextPageLink = screen.getByText('next >');
      userEvent.click(nextPageLink);
      await screen.findByText('user4');
      const prevPageLink = screen.getByText('< previous');
      userEvent.click(prevPageLink);
      const user1 = await screen.findByText('user1');
      expect(user1).toBeInTheDocument();
    });
    it('hides previous page link on first page', async () => {
      setup();
      await screen.findByText('user1');
      const prevPageLink = screen.queryByText('< previous');
      expect(prevPageLink).not.toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    beforeEach(() => {
      server.use(
        rest.get('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getPage(1, 3)));
        })
      );
    });
    it('initially displays title, next and previous links in english', async () => {
      setup();
      await screen.findByText('user4');
      expect(screen.getByText(en.users)).toBeInTheDocument();
      expect(screen.getByText(en.nextPage)).toBeInTheDocument();
      expect(screen.getByText(en.previousPage)).toBeInTheDocument();
    });
    it('should display text in turkish when language is selected', async () => {
      setup();
      await screen.findByText('user4');
      userEvent.click(screen.getByTitle('Türkçe'));
      expect(screen.getByText(tr.users)).toBeInTheDocument();
      expect(screen.getByText(tr.nextPage)).toBeInTheDocument();
      expect(screen.getByText(tr.previousPage)).toBeInTheDocument();
    });
  });
});
