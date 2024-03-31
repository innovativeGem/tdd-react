import { useTranslation } from 'react-i18next';
import logo from '../assets/hoaxify.png';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../api/apiCalls';

const NavBar = (props) => {
  const { t } = useTranslation();
  const auth = useSelector((store) => store);
  const dispatch = useDispatch();

  const onClickLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {}
    dispatch({
      type: 'logout-success',
    });
  };

  return (
    <nav className='navbar navbar-expand navbar-light bg-light shadow-sm'>
      <div className='container'>
        <Link className='navbar-brand' to='/' title='Home'>
          <img src={logo} alt='Hoaxify' width='60' />
          Hoaxify
        </Link>
        <ul className='navbar-nav'>
          {!auth.isLoggedIn && (
            <>
              <Link className='nav-link' to='/signup' title='Sign Up'>
                {t('signUp')}
              </Link>
              <Link className='nav-link' to='/login' title='Login'>
                {t('login')}
              </Link>
            </>
          )}
          {auth.isLoggedIn && (
            <>
              <Link
                className='nav-link'
                to={`/user/${auth.id}`}
                title='My Profile'
              >
                My Profile
              </Link>
              <a href='/' className='nav-link' onClick={onClickLogout}>
                Logout
              </a>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
