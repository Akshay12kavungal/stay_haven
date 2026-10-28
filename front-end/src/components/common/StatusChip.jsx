import { Chip } from '@mui/material';

const STYLES = {
  pending: { label: 'Awaiting payment', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'success' },
  paid: { label: 'Paid', color: 'success' },
  bookings: { label: 'Booked', color: 'success' },
  visited: { label: 'Completed', color: 'default' },
  canceled: { label: 'Cancelled', color: 'error' },
};

export default function StatusChip({ status, size = 'small' }) {
  const s = STYLES[status] || { label: status, color: 'default' };
  return <Chip label={s.label} color={s.color} size={size} variant={status === 'visited' ? 'outlined' : 'filled'} />;
}
