import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, Box, Button, CircularProgress, Divider, IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import api from '../../api/client';

const timeAgo = (iso) => {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function NotificationsMenu({ color = 'inherit' }) {
  const [anchor, setAnchor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notification/');
      setItems(data);
    } catch {
      /* the badge just stays empty */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const unread = items.filter((n) => !n.is_read).length;

  const open = (e) => { setAnchor(e.currentTarget); load(); };
  const markAll = async () => {
    await api.post('/notification/read_all/');
    setItems((list) => list.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={open} sx={{ color }} aria-label={`Notifications, ${unread} unread`}>
          <Badge badgeContent={unread} color="secondary" max={9}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)}
               anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
               slotProps={{ paper: { sx: { width: 360, maxWidth: 'calc(100vw - 32px)', mt: 1 } } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, py: 1.5 }}>
          <Typography fontWeight={600}>Notifications</Typography>
          {unread > 0 && <Button size="small" onClick={markAll} color="secondary">Mark all read</Button>}
        </Stack>
        <Divider />
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading && !items.length ? (
            <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={24} /></Box>
          ) : items.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>You're all caught up.</Typography>
          ) : items.map((n) => (
            <Box key={n.id} sx={{ px: 2.5, py: 1.75, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 1.5,
                                  bgcolor: n.is_read ? 'transparent' : 'rgba(168,145,96,0.07)' }}>
              <Box sx={{ mt: 0.9, width: 8, height: 8, borderRadius: '50%', flexShrink: 0, bgcolor: n.is_read ? 'transparent' : 'secondary.main' }} />
              <Box>
                <Typography variant="body2">{n.message}</Typography>
                <Typography variant="caption" color="text.secondary">{timeAgo(n.created_at)}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
}
