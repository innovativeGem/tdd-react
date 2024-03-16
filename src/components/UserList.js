import React, { useEffect, useState } from 'react';
import { getUsers } from '../api/apiCalls';
import UserListItem from './UserListItem';
import { withTranslation } from 'react-i18next';

const UserList = ({ t }) => {
  const [content, setContent] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsers(0);
        setContent(res.data.content);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const loadData = async (pageIndex) => {
    setPage(pageIndex);
    try {
      const res = await getUsers(pageIndex);
      setContent(res.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='card'>
      <div className='card-header text-center'>
        <h2>{t('users')}</h2>
      </div>
      <ul className='list-group list-group-flush'>
        {content?.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </ul>
      <div className='card-footer'>
        {page !== 0 && (
          <button
            className='btn btn-outline-secondary btn-sm'
            onClick={() => loadData(page - 1)}
          >
            {t('previousPage')}
          </button>
        )}
        {totalPages > page + 1 && (
          <button
            className='btn btn-outline-secondary btn-sm'
            onClick={() => loadData(page + 1)}
          >
            {t('nextPage')}
          </button>
        )}
      </div>
    </div>
  );
};

export default withTranslation()(UserList);
