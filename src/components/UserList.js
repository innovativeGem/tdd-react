import React, { useEffect, useState } from 'react';
import { getUsers } from '../api/apiCalls';
import UserListItem from './UserListItem';
import { withTranslation } from 'react-i18next';
import Spinner from './Spinner';

const UserList = ({ t }) => {
  const [content, setContent] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pendingApiCall, setPendingApiCall] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setPendingApiCall(true);
      try {
        const res = await getUsers(0);
        setContent(res.data.content);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error(error);
      }
      setPendingApiCall(false);
    };
    fetchData();
  }, []);

  const loadData = async (pageIndex) => {
    setPage(pageIndex);
    setPendingApiCall(true);
    try {
      const res = await getUsers(pageIndex);
      setContent(res.data.content);
    } catch (error) {
      console.error(error);
    }
    setPendingApiCall(false);
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
      <div className='card-footer text-center'>
        {page !== 0 && !pendingApiCall && (
          <button
            className='btn btn-outline-secondary btn-sm float-start'
            onClick={() => loadData(page - 1)}
          >
            {t('previousPage')}
          </button>
        )}
        {totalPages > page + 1 && !pendingApiCall && (
          <button
            className='btn btn-outline-secondary btn-sm float-end'
            onClick={() => loadData(page + 1)}
          >
            {t('nextPage')}
          </button>
        )}
        {pendingApiCall && <Spinner />}
      </div>
    </div>
  );
};

export default withTranslation()(UserList);
