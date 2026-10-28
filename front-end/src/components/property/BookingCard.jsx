import { Alert, Box, Button, Card, Divider, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../api/client';
import { GST_RATE } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { addDays, apiErrorMessage, formatINR, nightsBetween, toISODate } from '../../utils/format';
import useApi from '../../utils/useApi';

// A stay [checkIn, checkOut) clashes with a range; blocked ranges include their end date.
const clashes = (checkIn, checkOut, r) => checkIn < (r.inclusive ? addDays(r.end, 1) : r.end) && checkOut > r.start;

export default function BookingCard({ property }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openAuth } = useUI();
  const today = toISODate(new Date());
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(addDays(today, 1));
  const [guests, setGuests] = useState(Math.min(2, property.guests));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resumeAfterLogin, setResumeAfterLogin] = useState(false);
  const { data: unavailable } = useApi(`/properties/${property.id}/availability/`, { initial: [] });

  useEffect(() => {
    if (checkOut <= checkIn) setCheckOut(addDays(checkIn, 1));
  }, [checkIn, checkOut]);

  const nights = nightsBetween(checkIn, checkOut);
  const clash = useMemo(() => unavailable.find((r) => clashes(checkIn, checkOut, r)), [unavailable, checkIn, checkOut]);
  const rental = Number(property.price) * nights;
  const gst = rental * GST_RATE;
  const total = rental + gst;
  const advance = Math.min(Number(property.advance_amount) * nights, total);

  const reserve = useCallback(async () => {
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings/', { property: property.id, check_in: checkIn, check_out: checkOut, guests });
      navigate(`/checkout/${data.id}`);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create the booking.'));
    } finally {
      setSubmitting(false);
    }
  }, [property.id, checkIn, checkOut, guests, navigate]);

  // If the guest had to log in first, carry on with the reservation once they're in.
  useEffect(() => {
    if (resumeAfterLogin && isAuthenticated) {
      setResumeAfterLogin(false);
      reserve();
    }
  }, [resumeAfterLogin, isAuthenticated, reserve]);

  const book = () => {
    if (isAuthenticated) return reserve();
    setResumeAfterLogin(true);
    return openAuth('login');
  };

  const Row = ({ label, value, bold }) => (
    <Stack direction="row" justifyContent="space-between">
      <Typography color={bold ? 'text.primary' : 'text.secondary'} fontWeight={bold ? 700 : 400}>{label}</Typography>
      <Typography fontWeight={bold ? 700 : 500}>{value}</Typography>
    </Stack>
  );

  return (
    <Card sx={{
      p: { xs: 2.5, sm: 3.5 },
      position: { md: 'sticky' },
      top: { md: 100 },
      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px -8px rgba(245, 158, 11, 0.15)',
      borderRadius: 4,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      bgcolor: '#111622',
    }}>
      <Typography>
        <Box component="span" sx={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.02em' }}>{formatINR(property.price)}</Box>
        <Box component="span" color="text.secondary" sx={{ fontSize: '0.95rem' }}> / night</Box>
      </Typography>

      <Stack spacing={2} sx={{ mt: 2.5 }}>
        <Stack direction="row" spacing={1.5}>
          <TextField label="Check-in" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                     InputLabelProps={{ shrink: true }} inputProps={{ min: today }} />
          <TextField label="Check-out" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                     InputLabelProps={{ shrink: true }} inputProps={{ min: addDays(checkIn, 1) }} />
        </Stack>
        <TextField label="Guests" type="number" value={guests}
                   onChange={(e) => setGuests(Math.max(1, Math.min(property.guests, Number(e.target.value) || 1)))}
                   inputProps={{ min: 1, max: property.guests }} helperText={`Up to ${property.guests} guests`} />
        {clash && <Alert severity="warning" sx={{ borderRadius: 2 }}>These dates aren't available. Please choose different dates.</Alert>}
        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={book}
          disabled={submitting || Boolean(clash) || nights < 1}
          sx={{
            py: 1.5,
            fontSize: '1.05rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          {submitting ? 'Reserving…' : isAuthenticated ? 'Reserve Now' : 'Log in to Reserve'}
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">You'll pay only the advance to confirm.</Typography>
      </Stack>

      {nights > 0 && (
        <Stack spacing={1.25} sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Row label={`${formatINR(property.price)} × ${nights} night${nights > 1 ? 's' : ''}`} value={formatINR(rental)} />
          <Row label={`GST (${Math.round(GST_RATE * 100)}%)`} value={formatINR(gst)} />
          <Divider sx={{ my: 0.5 }} />
          <Row label="Total" value={formatINR(total)} bold />
          <Row label="Advance due now" value={formatINR(advance)} bold />
        </Stack>
      )}
    </Card>
  );
}
