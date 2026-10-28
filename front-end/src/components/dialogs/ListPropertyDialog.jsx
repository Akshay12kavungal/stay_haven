import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined';
import { Alert, Box, Button, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import api from '../../api/client';
import { useUI } from '../../context/UIContext';
import { apiErrorMessage } from '../../utils/format';
import DialogShell from './DialogShell';

const EMPTY = {
  name: '', email: '', phone: '', property_name: '', property_type: '', location: '',
  bedrooms: '', bathrooms: '', description: '', website: '', photos: null,
};
const TYPES = ['Villa', 'Cottage', 'Homestay', 'Farmhouse', 'Apartment', 'Resort', 'Other'];

export default function ListPropertyDialog({ open, onClose }) {
  const { notify } = useUI();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (open) { setForm(EMPTY); setError(''); } }, [open]);
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > 5 * 1024 * 1024) return setError('The photo must be smaller than 5 MB.');
    setError('');
    setForm((f) => ({ ...f, photos: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') body.append(k, v); });
    try {
      await api.post('/collaborations/', body);
      onClose();
      notify('Thanks! Our team will review your property and get in touch.');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not submit your property.'));
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, props = {}) => (
    <TextField label={label} name={name} value={form[name]} onChange={set} {...props} />
  );

  return (
    <DialogShell open={open} onClose={onClose} maxWidth="md" title="List your property"
                 subtitle="Tell us about your place. We partner with hand-picked villas and homestays across India.">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          <Box>
            <Typography variant="overline" color="text.secondary">About you</Typography>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={4}>{field('name', 'Your name', { required: true, autoComplete: 'name' })}</Grid>
              <Grid item xs={12} sm={4}>{field('email', 'Email', { type: 'email', required: true, autoComplete: 'email' })}</Grid>
              <Grid item xs={12} sm={4}>{field('phone', 'Phone', { type: 'tel', required: true, autoComplete: 'tel', inputProps: { maxLength: 15 } })}</Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">About the property</Typography>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>{field('property_name', 'Property name', { required: true })}</Grid>
              <Grid item xs={12} sm={6}>
                {field('property_type', 'Property type', { select: true, required: true, children: TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>) })}
              </Grid>
              <Grid item xs={12} sm={6}>{field('location', 'Location', { required: true, placeholder: 'Town, State' })}</Grid>
              <Grid item xs={6} sm={3}>{field('bedrooms', 'Bedrooms', { type: 'number', required: true, inputProps: { min: 0 } })}</Grid>
              <Grid item xs={6} sm={3}>{field('bathrooms', 'Bathrooms', { type: 'number', required: true, inputProps: { min: 0 } })}</Grid>
              <Grid item xs={12}>{field('website', 'Website or listing link (optional)', { type: 'url', placeholder: 'https://' })}</Grid>
              <Grid item xs={12}>{field('description', 'Description', { required: true, multiline: true, minRows: 3 })}</Grid>
              <Grid item xs={12}>
                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ borderStyle: 'dashed' }}>
                  {form.photos ? form.photos.name : 'Upload a photo (optional)'}
                  <input type="file" accept="image/*" hidden onChange={handleFile} />
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit property'}
          </Button>
        </Stack>
      </form>
    </DialogShell>
  );
}
