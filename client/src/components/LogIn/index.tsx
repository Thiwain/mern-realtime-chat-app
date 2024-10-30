import * as React from 'react';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Stack from '@mui/joy/Stack';
import { loginRequest } from '../../api/services/auth';
import { useForm } from '../../hooks/useForm';
import { loginAuthValidation } from '../../validations/loginAuthValidation';
import FormTextField from '../FormTextField';
import FormBtn from '../FormBtn';
import AuthBox from '../AuthBox';
import { AuthData } from '../../data/AuthData';


export default function LogIn() {

  // Process Functions --------------------------------------------------------->

  const {
    formValues: { email, password, rememberMe },
    handleChange,
    handleCheckboxChange,
    errorMessage,
    setErrorMessage,
  } = useForm({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { error } = loginAuthValidation.validate({ email, password });
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setErrorMessage('');

    try {
      const res = await loginRequest({ email, password, rememberMe });
      if (res?.status === 200) {
        window.location.reload();
      }
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }


  };

  // Process Functions --------------------------------------------------------->

  return (
    <AuthBox
      dataObject={AuthData.loginData}
    >
      <form
        onSubmit={handleSubmit}
      >
        {errorMessage ? <Box sx={{ color: 'error.main' }}>{'⚠️ ' + errorMessage}</Box> : ''}
        <FormTextField
          data={AuthData.emailField}
          value={email}
          onChange={handleChange}
        />
        <FormTextField
          data={AuthData.passwordField}
          value={password}
          onChange={handleChange}
        />
        <Stack sx={{ gap: 4, mt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Checkbox size="sm" label="Remember me"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleCheckboxChange}
            />
          </Box>
          <FormBtn title={'Log In'} />
        </Stack>
      </form>
    </AuthBox>
  );
}
