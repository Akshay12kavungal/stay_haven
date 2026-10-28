import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import { Alert, Box, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import api from '../api/client';
import RequireAuth from '../components/common/RequireAuth';
import StatusChip from '../components/common/StatusChip';
import { EmptyState, Loading } from '../components/common/States';
import { PolicyList } from '../components/dialogs/PolicyDialog';
import PageLayout from '../components/layout/PageLayout';
import { useUI } from '../context/UIContext';
import { apiErrorMessage, formatDate, formatINR, toISODate } from '../utils/format';
import useApi from '../utils/useApi';

function BookingCard({ booking, onCancel }) {
  const p = booking.property_detail;
  const canCancel = !['canceled', 'visited'].includes(booking.status) && booking.check_in >= toISODate(new Date());
  return (
    <Card sx={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
      <Box component={RouterLink} to={`/single/${p.id}`} sx={{ flex: { sm: '0 0 200px' }, display: 'block' }}>
        <Box component="img" src={p.image} alt={p.name} sx={{ width: '100%', height: { xs: 180, sm: '100%' }, objectFit: 'cover' }} />
      </Box>
      <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box>
            <Typography variant="h6" component="h3">{p.name}</Typography>
            <Typography variant="body2" color="text.secondary">Booking #{booking.id} · {p.address}</Typography>
          </Box>
          <StatusChip status={booking.status} />
        </Stack>
        <Stack direction="row" spacing={3} sx={{ mt: 2, color: 'text.secondary' }} flexWrap="wrap" useFlexGap>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2">{formatDate(booking.check_in)} – {formatDate(booking.check_out)}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <PeopleIcon fontSize="small" />
            <Typography variant="body2">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={3} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          <Box><Typography variant="caption" color="text.secondary">Total</Typography><Typography fontWeight={600}>{formatINR(booking.total_amount)}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">Advance</Typography><Typography fontWeight={600}>{formatINR(booking.advance_amount)}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">Balance</Typography><Typography fontWeight={600}>{formatINR(booking.balance_amount)}</Typography></Box>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {booking.status === 'pending' && (
            <Button component={RouterLink} to={`/checkout/${booking.id}`} variant="contained" color="secondary" size="small" sx={{ fontWeight: 600 }}>Complete payment</Button>
          )}
          {canCancel && <Button color="error" size="small" onClick={() => onCancel(booking)}>Cancel booking</Button>}
        </Stack>
      </Box>
    </Card>
  );
}

function BookingsContent() {
  const { notify } = useUI();
  const { data: bookings, setData, loading, error } = useApi('/bookings/', { initial: [] });
  const [tab, setTab] = useState('upcoming');
  const [cancelling, setCancelling] = useState(null);
  const [busy, setBusy] = useState(false);

  const today = toISODate(new Date());
  const groups = useMemo(() => ({
    upcoming: bookings.filter((b) => b.status !== 'canceled' && b.check_out >= today),
    past: bookings.filter((b) => b.status !== 'canceled' && b.check_out < today),
    cancelled: bookings.filter((b) => b.status === 'canceled'),
  }), [bookings, today]);

  const confirmCancel = async () => {
    setBusy(true);
    try {
      const { data } = await api.post(`/bookings/${cancelling.id}/cancel/`);
      setData((list) => list.map((b) => (b.id === data.id ? data : b)));
      notify('Your booking has been cancelled.', 'info');
      setCancelling(null);
    } catch (err) {
      notify(apiErrorMessage(err, 'Could not cancel the booking.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;
  const list = groups[tab];

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{apiErrorMessage(error, 'Could not load your bookings.')}</Alert>}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            textColor="inherit" TabIndicatorProps={{ sx: { bgcolor: 'secondary.main' } }}>
        <Tab value="upcoming" label={`Upcoming (${groups.upcoming.length})`} />
        <Tab value="past" label={`Past (${groups.past.length})`} />
        <Tab value="cancelled" label={`Cancelled (${groups.cancelled.length})`} />
      </Tabs>
      {list.length === 0 ? (
        <EmptyState icon={LuggageOutlinedIcon} title={tab === 'upcoming' ? 'No upcoming trips' : `No ${tab} bookings`}
                    message={tab === 'upcoming' ? 'Time to plan your next getaway.' : undefined}
                    actionLabel={tab === 'upcoming' ? 'Explore stays' : undefined} actionProps={{ component: RouterLink, to: '/stays' }} />
      ) : (
        <Grid container spacing={3}>
          {list.map((b) => <Grid item xs={12} lg={6} key={b.id}><BookingCard booking={b} onCancel={setCancelling} /></Grid>)}
        </Grid>
      )}

      <Dialog open={Boolean(cancelling)} onClose={() => !busy && setCancelling(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif' }}>Cancel this booking?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {cancelling && `${cancelling.property_detail.name}, ${formatDate(cancelling.check_in)} – ${formatDate(cancelling.check_out)}.`}
          </Typography>
          <PolicyList />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCancelling(null)} disabled={busy}>Keep booking</Button>
          <Button onClick={confirmCancel} color="error" variant="contained" disabled={busy}>{busy ? 'Cancelling…' : 'Yes, cancel'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function Bookings() {
  return (
    <PageLayout title="My bookings">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h2" component="h1">My bookings</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>View and manage your upcoming and past stays.</Typography>
        <RequireAuth message="Log in to see your bookings."><BookingsContent /></RequireAuth>
      </Container>
    </PageLayout>
  );
}
