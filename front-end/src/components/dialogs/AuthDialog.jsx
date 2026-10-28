import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Alert, Box, Button, IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { apiErrorMessage, toISODate } from '../../utils/format';
import DialogShell from './DialogShell';

const EMPTY = { username: '', email: '', phone_number: '', date_of_birth: '', password: '', confirm: '' };

const ageOn = (dob) => {
  const today = new Date();
  const birth = new Date(`${dob}T00:00:00`);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
};

const Aside = () => (
  <Box sx={{ position: 'absolute', inset: 0, color: '#fff', display: 'flex', flexDirection: 'column',
             justifyContent: 'flex-end', p: 4,
             background: 'radial-gradient(120% 80% at 0% 0%, rgba(245, 158, 11, 0.25) 0%, #111622 60%, #080B11 100%)' }}>
    <Box sx={{ position: 'absolute', top: 32, left: 32, width: 56, height: 3, borderRadius: 2, bgcolor: '#F59E0B' }} />
    <Typography variant="overline" sx={{ color: '#F59E0B', fontWeight: 800 }}>StayHaven</Typography>
    <Typography variant="h4" sx={{ mt: 1, fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>Hand-picked stays, worry-free holidays.</Typography>
  </Box>
);

export default function AuthDialog({ open, onClose, mode: initialMode = 'login', onSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setForm(EMPTY);
      setError('');
    }
  }, [open, initialMode]);

  const isLogin = mode === 'login';
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isLogin) {
      if (form.password !== form.confirm) return setError('Passwords do not match.');
      if (form.date_of_birth && ageOn(form.date_of_birth) < 18) return setError('You must be at least 18 years old to register.');
    }
    setSubmitting(true);
    try {
      const user = isLogin
        ? await login(form.username.trim(), form.password)
        : await register({
            username: form.username.trim(),
            email: form.email.trim(),
            phone_number: form.phone_number.trim(),
            date_of_birth: form.date_of_birth || null,
            password: form.password,
          });
      onClose();
      onSuccess?.(user);
    } catch (err) {
      setError(isLogin && err.response?.status === 401
        ? 'Incorrect username or password.'
        : apiErrorMessage(err, isLogin ? 'Login failed.' : 'Registration failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  const passwordAdornment = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" aria-label={showPassword ? 'Hide password' : 'Show password'}>
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      aside={<Aside />}
      title={isLogin ? 'Welcome back' : 'Create your account'}
      subtitle={isLogin ? 'Log in to book stays and manage your trips.' : 'It takes less than a minute.'}
    >
      <form onSubmit={handleSubmit} noValidate={false}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Username" name="username" value={form.username} onChange={set} required autoFocus
                     autoComplete="username" />
          {!isLogin && (
            <>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={set} required autoComplete="email" />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Phone number" name="phone_number" type="tel" value={form.phone_number} onChange={set}
                           required autoComplete="tel" inputProps={{ pattern: '[+0-9 ]{7,15}', maxLength: 15 }} />
                <TextField label="Date of birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={set}
                           InputLabelProps={{ shrink: true }} inputProps={{ max: toISODate(new Date()) }} />
              </Stack>
            </>
          )}
          <TextField label="Password" name="password" type={showPassword ? 'text' : 'password'} value={form.password}
                     onChange={set} required autoComplete={isLogin ? 'current-password' : 'new-password'}
                     InputProps={passwordAdornment} helperText={isLogin ? undefined : 'At least 8 characters, not too common.'}
                     inputProps={{ minLength: isLogin ? undefined : 8 }} />
          {!isLogin && (
            <TextField label="Confirm password" name="confirm" type={showPassword ? 'text' : 'password'} value={form.confirm}
                       onChange={set} required autoComplete="new-password" />
          )}
          <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
            {submitting ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
          </Button>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link component="button" type="button" fontWeight={600} color="secondary.dark"
                  onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); }}>
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </Typography>
        </Stack>
      </form>
    </DialogShell>
  );
}
