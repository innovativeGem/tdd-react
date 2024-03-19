import { useEffect, useState } from 'react';
import { getUserById } from '../api/apiCalls';
import ProfileCard from '../components/ProfileCard';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const UserPage = (props) => {
  const [user, setUser] = useState(null);
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [failResponse, setFailResponse] = useState();

  useEffect(() => {
    setPendingApiCall(true);
    async function fetchData() {
      try {
        const response = await getUserById(props.match.params.id);
        setUser(response.data);
      } catch (err) {
        setFailResponse(err.response.data.message);
      }
      setPendingApiCall(false);
    }
    fetchData();
  }, [props.match.params.id]);

  let content = (
    <Alert type='secondary' center>
      <Spinner size='big' />
    </Alert>
  );

  if (!pendingApiCall) {
    if (failResponse) {
      content = (
        <Alert type='danger' center>
          {failResponse}
        </Alert>
      );
    } else {
      content = <ProfileCard user={user} />;
    }
  }

  return <div data-testid='user-page'>{content}</div>;
};

export default UserPage;
