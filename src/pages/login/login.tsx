import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginError = useSelector(
  (state) => state.user.loginError
);

  const handleSubmit = (e: SyntheticEvent): void => {
  e.preventDefault();

  dispatch(
    loginUser({
      email,
      password
    })
  );
};

  return (
    <LoginUI
      errorText={loginError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
