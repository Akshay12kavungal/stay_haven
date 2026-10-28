import { Alert, Button, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import api from '../../api/client';
import { useUI } from '../../context/UIContext';
import { apiErrorMessage } from '../../utils/format';
import DialogShell from './DialogShell';

const EMPTY = { name: '', email: '', message: '' };

export default function ContactDialog({ open, onClose }) {
  const { notify } = useUI();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (open) { setForm(EMPTY); setError(''); } }, [open]);
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/reviews/contactus/', form);
      onClose();
      notify("Thanks for reaching out — we'll get back to you soon.");
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not send your message.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogShell open={open} onClose={onClose} title="Contact us" subtitle="Questions about a stay or a booking? Send us a note.">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Your name" name="name" value={form.name} onChange={set} required autoComplete="name" />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={set} required autoComplete="email" />
          <TextField label="Message" name="message" value={form.message} onChange={set} required multiline minRows={4} />
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </Button>
        </Stack>
      </form>
    </DialogShell>
  );
}
