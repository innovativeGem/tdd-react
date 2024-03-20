import { withRouter } from 'react-router-dom';
import defaultProfile from '../assets/profile.png';

const UserListItem = (props) => {
  const { user, history } = props;
  return (
    <li
      className='list-group-item list-group-item-action'
      key={user.id}
      onClick={() => history.push(`/user/${user.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={defaultProfile}
        alt='profile'
        width='30'
        className='rounded-circle shadow-sm'
      />
      {user.username}
    </li>
  );
};

/**
 * To use route parameters for a child component (which is not directly rendered by <Route>)
 * use withRouter(<YourComponent>) HOC.
 * You will receive 'history' as a prop, which can then be used to navigate.
 */

export default withRouter(UserListItem);
