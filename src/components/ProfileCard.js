import { useState } from 'react';
import defaultProfile from '../assets/profile.png';
import { useSelector } from 'react-redux';
import Input from './Input';
import { updateUser } from '../api/apiCalls';
import ButtonWithProgress from './ButtonWithProgress';

const ProfileCard = ({ user }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [apiProgress, setApiProgress] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);

  const { id, header } = useSelector((store) => ({
    id: store.id,
    header: store.header,
  }));

  const onClickSave = async () => {
    setApiProgress(true);
    try {
      await updateUser(id, { username: newUsername }, header);
    } catch (error) {}
    setApiProgress(false);
  };

  let content;

  if (isEditMode) {
    content = (
      <>
        <Input
          id='username'
          label='Change your username'
          initialValue={user.username}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <ButtonWithProgress
          className='btn btn-primary'
          onClick={onClickSave}
          apiProgress={apiProgress}
        >
          Save
        </ButtonWithProgress>
        <button className='btn btn-outline-secondary'>Cancel</button>
      </>
    );
  } else {
    content = (
      <>
        <h3>{user?.username}</h3>
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
