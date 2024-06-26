import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import defaultProfile from '../assets/profile.png';
import { useSelector, useDispatch } from 'react-redux';
import Input from './Input';
import { updateUser, deleteUser } from '../api/apiCalls';
import ButtonWithProgress from './ButtonWithProgress';
import Modal from './Modal';
import { logoutSuccess, userUpdateSuccess } from '../state/authActions';

const ProfileCard = ({ user }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [deleteApiProgress, setDeleteApiProgress] = useState(false);
  const [updateApiProgress, setUpdateApiProgress] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const { id, username } = useSelector((store) => ({
    id: store.id,
    username: store.username,
  }));

  const onClickSave = async () => {
    setUpdateApiProgress(true);
    try {
      await updateUser(id, { username: newUsername });
      setEditMode(false);
      dispatch(
        userUpdateSuccess({
          username: newUsername,
        })
      );
    } catch (error) {}
    setUpdateApiProgress(false);
  };

  const onClickCancel = () => {
    setEditMode(false);
    setNewUsername(username);
  };

  const onClickDelete = async () => {
    setDeleteApiProgress(true);
    try {
      await deleteUser(id);
      history.push('/');
      dispatch(logoutSuccess());
    } catch (error) {}
    setDeleteApiProgress(false);
  };

  let content;

  if (isEditMode) {
    content = (
      <>
        <Input
          id='username'
          label='Change your username'
          initialValue={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <ButtonWithProgress
          onClick={onClickSave}
          apiProgress={updateApiProgress}
        >
          Save
        </ButtonWithProgress>
        <button className='btn btn-outline-secondary' onClick={onClickCancel}>
          Cancel
        </button>
      </>
    );
  } else {
    content = (
      <>
        <h3>{newUsername}</h3>
        {user?.id === id && (
          <>
            <div>
              <button
                className='btn btn-outline-success'
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            </div>
            <div className='pt-2'>
              <button
                className='btn btn-danger'
                onClick={() => setShowModal(true)}
              >
                Delete My Account
              </button>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div className='card text-center'>
        <div className='card-header'>
          <img
            src={defaultProfile}
            alt='profile'
            width='200'
            height='200'
            className='rounded-circle shadow'
          />
        </div>
        <div className='card-body'>{content}</div>
      </div>
      {showModal && (
        <Modal
          content='Are you sure you want to delete your account?'
          onClickCancel={() => setShowModal(false)}
          onClickConfirm={onClickDelete}
          apiProgress={deleteApiProgress}
        />
      )}
    </>
  );
};

export default ProfileCard;
