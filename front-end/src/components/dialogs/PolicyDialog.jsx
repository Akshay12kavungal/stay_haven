import { Box, Button, Typography } from '@mui/material';

import DialogShell from './DialogShell';

const POLICY_POINTS = [
  <>Cancel <strong>at least 7 days before</strong> check-in for a refund of your advance.</>,
  <><strong>No refunds</strong> are issued for cancellations made within 7 days of check-in.</>,
  <>Refunds, where applicable, are processed within <strong>10 business days</strong>.</>,
  <>The balance amount is paid at the property on arrival.</>,
];

export function PolicyList() {
  return (
    <Box component="ul" sx={{ pl: 2.5, m: 0, color: 'text.secondary', '& li': { mb: 1.25, lineHeight: 1.6 } }}>
      {POLICY_POINTS.map((p, i) => <li key={i}>{p}</li>)}
    </Box>
  );
}

export default function PolicyDialog({ open, onClose }) {
  return (
    <DialogShell open={open} onClose={onClose} title="Booking & cancellation policy">
      <PolicyList />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Questions? Reach us through the Contact link in the footer.
      </Typography>
      <Button variant="contained" onClick={onClose} sx={{ mt: 3 }}>Got it</Button>
    </DialogShell>
  );
}
