import { Alert, Avatar, Box, Button, Card, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import api from '../api/client';
import RequireAuth from '../components/common/RequireAuth';
import { Loading } from '../components/common/States';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { apiErrorMessage } from '../utils/format';
import useApi from '../utils/useApi';

const FIELDS = ['first_name', 'last_name', 'email', 'phone_number', 'date_of_birth', 'address'];

function ProfileForm() {
  const { reloadUser } = useAuth();
  const { notify } = useUI();
  const { data: profile, loading } = useApi('/users/profile/me/');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pw, setPw] = useState({ current_password: '', new_password: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (profile) setForm(Object.fromEntries(FIELDS.map((f) => [f, profile[f] ?? ''])));
  }, [profile]);

  if (loading || !form) return <Loading />;
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.patch('/users/profile/me/', { ...form, date_of_birth: form.date_of_birth || null });
      await reloadUser();
      notify('Profile saved.');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not save your profile.'));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pw.new_password !== pw.confirm) return setPwError('New passwords do not match.');
    try {
      await api.post('/users/profile/change_password/', { current_password: pw.current_password, new_password: pw.new_password });
      setPw({ current_password: '', new_password: '', confirm: '' });
      notify('Password updated.');
    } catch (err) {
      setPwError(apiErrorMessage(err, 'Could not update your password.'));
    }
    return undefined;
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Avatar sx={{ width: 88, height: 88, mx: 'auto', bgcolor: 'secondary.main', color: '#080B11', fontWeight: 700, fontSize: 34, fontFamily: '"Playfair Display", serif' }}>
            {(form.first_name || profile.user.username)[0].toUpperCase()}
          </Avatar>
          <Typography variant="h5" sx={{ mt: 2, color: '#FFFFFF' }}>{`${form.first_name} ${form.last_name}`.trim() || profile.user.username}</Typography>
          <Typography color="text.secondary">@{profile.user.username}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card component="form" onSubmit={save} sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography variant="h6">Personal details</Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}><TextField label="First name" name="first_name" value={form.first_name} onChange={set} autoComplete="given-name" /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Last name" name="last_name" value={form.last_name} onChange={set} autoComplete="family-name" /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Email" name="email" type="email" value={form.email} onChange={set} required autoComplete="email" /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Phone" name="phone_number" type="tel" value={form.phone_number} onChange={set} autoComplete="tel" /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Date of birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={set} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12}><TextField label="Address" name="address" value={form.address} onChange={set} multiline minRows={2} autoComplete="street-address" /></Grid>
          </Grid>
          <Button type="submit" variant="contained" color="secondary" sx={{ mt: 3, fontWeight: 700 }} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </Card>

        <Card component="form" onSubmit={changePassword} sx={{ p: { xs: 2.5, md: 4 }, mt: 3 }}>
          <Typography variant="h6">Change password</Typography>
          {pwError && <Alert severity="error" sx={{ mt: 2 }}>{pwError}</Alert>}
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Current password" type="password" value={pw.current_password} required autoComplete="current-password"
                       onChange={(e) => setPw((p) => ({ ...p, current_password: e.target.value }))} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="New password" type="password" value={pw.new_password} required autoComplete="new-password" inputProps={{ minLength: 8 }}
                         onChange={(e) => setPw((p) => ({ ...p, new_password: e.target.value }))} />
              <TextField label="Confirm new password" type="password" value={pw.confirm} required autoComplete="new-password"
                         onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
            </Stack>
          </Stack>
          <Box><Button type="submit" variant="outlined" sx={{ mt: 3 }}>Update password</Button></Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default function Profile() {
  return (
    <PageLayout title="Profile">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4 }}>Your profile</Typography>
        <RequireAuth message="Log in to manage your profile."><ProfileForm /></RequireAuth>
      </Container>
    </PageLayout>
  );
}
