import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuth from './Hooks/useAuth.jsx';
import {
  TextField,
  Button,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Typography,
} from '@mui/material';




export default function Login() {
    
    const {logout, login, setIsAuthenticated} = useAuth();
    const navigate = useNavigate();
    const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const formDataHandler = async (data) => {
    console.log("Form Data:", data);
    try{
        await login(data.username, data.password)
        navigate('/');
    }
    catch(err){
        console.log("Login Failed")
    }
  }

  return (
    <main className="min-h-screen flex flex-row items-center justify-end bg-[url('/src/assets/images/LoginPage.jpg')] bg-cover bg-center">
      <form id="loginForm" onSubmit={handleSubmit(formDataHandler)} className="grid grid-cols-2 gap-4 pr-36">
            <div className="flex flex-col gap-y-0">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Username
              </Typography>
              <Controller
                name="username"
                control={control}
                rules={{ required: 'Username is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    placeholder="Enter your username"
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.375rem', height: '4.5vh' } }}
                  />
                )}
              />
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" sx={{ mb: 0.5, color: '#616161' }}>
                Password
              </Typography>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type='password'
                    placeholder="Enter your password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.375rem', height: '4.5vh' } }}
                  />
                )}
              />
            </div>

            <div className="flex flex-row items-center p-2 rounded-b-xl">
                <Button
                    type="submit"
                    form="loginForm"
                    variant="contained"
                    sx={{
                        width: '60%',
                        height: '4vh',
                        textTransform: 'none',
                        backgroundColor: '#04B7B1',
                        color: '#FFFFFF',
                        '&:hover': { backgroundColor: '#03A6A0' },
                    }}
                    >
                        Login
                </Button>
            </div>
           
          </form>
    </main>
  )
}
