import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LockIcon from '@mui/icons-material/LockOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import { Alert, Box, Button, Card, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import api from '../api/client';
import RequireAuth from '../components/common/RequireAuth';
import StatusChip from '../components/common/StatusChip';
import { EmptyState, Loading } from '../components/common/States';
import { PolicyList } from '../components/dialogs/PolicyDialog';
import PageLayout from '../components/layout/PageLayout';
import { apiErrorMessage, formatDate, formatINR } from '../utils/format';
import useApi from '../utils/useApi';

const Row = ({ label, value, bold, accent }) => (
  <Stack direction="row" justifyContent="space-between" sx={{ py: 0.65 }}>
    <Typography color={bold ? 'text.primary' : 'text.secondary'} fontWeight={bold ? 700 : 400}>{label}</Typography>
    <Typography fontWeight={bold ? 700 : 500} color={accent ? 'secondary.main' : 'text.primary'}>{value}</Typography>
  </Stack>
);

function CheckoutContent() {
  const { bookingId } = useParams();
  const { data: booking, setData: setBooking, loading, error } = useApi(`/bookings/${bookingId}/`);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  if (loading) return <Loading minHeight="60vh" />;
  if (error || !booking) {
    return (
      <EmptyState icon={ErrorOutlineIcon} title="Booking not found" message="This booking doesn't exist or belongs to another account."
                  actionLabel="Go to my bookings" actionProps={{ component: RouterLink, to: '/bookings' }} />
    );
  }

  const p = booking.property_detail;
  const price = booking.price_breakdown;

  const pay = async () => {
    setPaying(true);
    setPayError('');
    try {
      const { data } = await api.post(`/bookings/${booking.id}/pay/`);
      setBooking(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setPayError(apiErrorMessage(err, 'Payment failed. Please try again.'));
    } finally {
      setPaying(false);
    }
  };

  if (booking.status === 'confirmed' || booking.status === 'paid') {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main' }} />
        <Typography variant="h3" component="h1" sx={{ mt: 2 }}>You're all set!</Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
          Booking #{booking.id} at <strong>{p.name}</strong> is confirmed for {formatDate(booking.check_in)} – {formatDate(booking.check_out)}.
          Pay the balance of {formatINR(booking.balance_amount)} at the property.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mt: 4 }}>
          <Button component={RouterLink} to="/bookings" variant="contained" size="large">View my bookings</Button>
          <Button component={RouterLink} to="/stays" size="large">Keep exploring</Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h2" component="h1">Confirm and pay</Typography>
      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ overflow: 'hidden' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }}>
              <Box component="img" src={p.image} alt={p.name} sx={{ width: { xs: '100%', sm: 220 }, height: { xs: 200, sm: 'auto' }, objectFit: 'cover' }} />
              <Box sx={{ p: 3, flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Box>
                    <Typography variant="h5" component="h2">{p.name}</Typography>
                    <Typography color="text.secondary">{p.address}</Typography>
                  </Box>
                  <StatusChip status={booking.status} />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Dates</Typography>
                      <Typography fontWeight={500}>{formatDate(booking.check_in)} – {formatDate(booking.check_out)}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PeopleIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Guests</Typography>
                      <Typography fontWeight={500}>{booking.guests}</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Card>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Cancellation policy</Typography>
            <PolicyList />
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, position: { md: 'sticky' }, top: { md: 100 } }}>
            <Typography variant="h6">Price details</Typography>
            <Box sx={{ mt: 1.5 }}>
              <Row label={`${formatINR(price.rental / price.nights)} × ${price.nights} night${price.nights > 1 ? 's' : ''}`} value={formatINR(price.rental)} />
              <Row label={`GST (${Math.round(Number(price.gst_rate) * 100)}%)`} value={formatINR(price.gst)} />
              <Divider sx={{ my: 1.5 }} />
              <Row label="Total" value={formatINR(price.total)} bold />
              <Row label="Pay at property" value={formatINR(price.balance)} />
              <Divider sx={{ my: 1.5 }} />
              <Row label="Advance due now" value={formatINR(price.advance)} bold accent />
            </Box>
            {booking.status === 'canceled' ? (
              <Alert severity="info" sx={{ mt: 2 }}>This booking was cancelled.</Alert>
            ) : (
              <>
                {payError && <Alert severity="error" sx={{ mt: 2 }}>{payError}</Alert>}
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  sx={{ mt: 2.5, py: 1.5, fontSize: '1.05rem', fontWeight: 700 }}
                  onClick={pay}
                  disabled={paying}
                  startIcon={<LockIcon />}
                >
                  {paying ? 'Processing…' : `Pay ${formatINR(price.advance)}`}
                </Button>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1.5 }}>
                  Your dates are held for 30 minutes while you complete payment.
                </Typography>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default function Checkout() {
  return (
    <PageLayout title="Checkout">
      <RequireAuth message="Log in to view and pay for this booking."><CheckoutContent /></RequireAuth>
    </PageLayout>
  );
}
