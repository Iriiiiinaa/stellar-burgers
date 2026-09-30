import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerError = useSelector(
    (state) => state.user.registerError
  );

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    dispatch(
      registerUser({
        name: userName,
        email,
        password
      })
    );
  };

  return (
    <RegisterUI
      errorText={registerError || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};