import { useState } from 'react';
import defaultProfile from '../assets/profile.png';
import { useSelector, useDispatch } from 'react-redux';
import Input from './Input';
import { updateUser } from '../api/apiCalls';
import ButtonWithProgress from './ButtonWithProgress';

const ProfileCard = ({ user }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [apiProgress, setApiProgress] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username);

  const dispatch = useDispatch();

  const { id, username, header } = useSelector((store) => ({
    id: store.id,
    username: store.username,
    header: store.header,
  }));

  const onClickSave = async () => {
    setApiProgress(true);
    try {
      await updateUser(id, { username: newUsername }, header);
      setEditMode(false);
      dispatch({
        type: 'user-update-success',
        payload: {
          username: newUsername,
        },
      });
    } catch (error) {}
    setApiProgress(false);
  };

  const onClickCancel = () => {
    setEditMode(false);
    setNewUsername(username);
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
          className='btn btn-primary'
          onClick={onClickSave}
          apiProgress={apiProgress}
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
        <h3>{username}</h3>
        {user?.id === id && (
          <button
            className='btn btn-outline-success'
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        )}
      </>
    );
  }

  return (
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
  );
};

export default ProfileCard;
