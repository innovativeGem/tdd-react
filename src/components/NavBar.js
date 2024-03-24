import { useTranslation } from 'react-i18next';
import logo from '../assets/hoaxify.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../state/AuthContextWrapper';
import { useContext } from 'react';

const NavBar = (props) => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

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
            <Link
              className='nav-link'
              to={`/user/${auth.id}`}
              title='My Profile'
            >
              My Profile
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
