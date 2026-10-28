import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import {
  AppBar, Avatar, Badge, Box, Button, Container, Divider, Drawer, IconButton, List, ListItemButton, ListItemText,
  Menu, MenuItem, Stack, Toolbar, Tooltip, Typography, useScrollTrigger,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';

import { LOGO_URL, PHONE_DISPLAY, PHONE_TEL, SITE_NAME } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import useSaved from '../../utils/useSaved';
import BrandLogo from '../common/BrandLogo';
import NotificationsMenu from './NotificationsMenu';

const NAV = [
  { label: 'Explore stays', to: '/stays' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/aboutus' },
  { label: 'FAQs', to: '/faq' },
];

// `transparent` lets the bar sit over the home hero until the user scrolls.
export default function Navbar({ transparent = false }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { openAuth, openListProperty, notify } = useUI();
  const navigate = useNavigate();
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 40 });
  const [drawer, setDrawer] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState(null);
  const { ids: savedIds } = useSaved();

  const solid = !transparent || scrolled;
  const fg = '#F8FAFC';

  const handleLogout = () => {
    setAccountAnchor(null);
    setDrawer(false);
    logout();
    notify('You have been logged out.', 'info');
    navigate('/');
  };

  const go = (to) => { setAccountAnchor(null); setDrawer(false); navigate(to); };

  return (
    <AppBar position="fixed" elevation={0} sx={{
      bgcolor: solid ? 'rgba(8, 11, 17, 0.88)' : 'transparent',
      backdropFilter: solid ? 'saturate(180%) blur(16px)' : 'none',
      borderBottom: '1px solid', borderColor: solid ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
      color: fg, transition: 'background-color .3s, border-color .3s',
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 76 }, gap: 2 }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', mr: 2, textDecoration: 'none' }} aria-label={`${SITE_NAME} home`}>
            <BrandLogo />
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            {NAV.map((item) => (
              <Button key={item.to} component={NavLink} to={item.to} sx={{
                color: fg, opacity: 0.85, position: 'relative', '&:hover': { opacity: 1, bgcolor: 'transparent', color: '#FBBF24' },
                '&::after': { content: '""', position: 'absolute', left: 20, right: 20, bottom: 6, height: 2, borderRadius: 1,
                              bgcolor: 'secondary.main', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform .3s' },
                '&:hover::after, &.active::after': { transform: 'scaleX(1)' },
                '&.active': { opacity: 1, color: '#FBBF24' },
              }}>
                {item.label}
              </Button>
            ))}
          </Stack>
          <Box sx={{ flexGrow: 1, display: { md: 'none' } }} />

          <Stack direction="row" alignItems="center" spacing={1}>
            <Button href={`tel:${PHONE_TEL}`} startIcon={<PhoneIcon />} sx={{ color: fg, display: { xs: 'none', lg: 'inline-flex' } }}>
              {PHONE_DISPLAY}
            </Button>
            <Button variant="outlined" onClick={openListProperty} sx={{
              display: { xs: 'none', md: 'inline-flex' }, color: fg,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': { borderColor: '#F59E0B', color: '#FBBF24', bgcolor: 'rgba(245, 158, 11, 0.08)' },
            }}>
              List your property
            </Button>
            <Tooltip title="Saved stays">
              <IconButton component={RouterLink} to="/saved" sx={{ color: fg }} aria-label={`Saved stays, ${savedIds.length}`}>
                <Badge badgeContent={savedIds.length} color="secondary" max={9}><FavoriteBorderIcon /></Badge>
              </IconButton>
            </Tooltip>
            {isAuthenticated && <NotificationsMenu color={fg} />}
            {isAuthenticated ? (
              <>
                <IconButton onClick={(e) => setAccountAnchor(e.currentTarget)} aria-label="Account menu" sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', color: '#080B11', fontSize: 15, fontWeight: 700 }}>
                    {(user.first_name || user.username)[0].toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={accountAnchor} open={Boolean(accountAnchor)} onClose={() => setAccountAnchor(null)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      slotProps={{ paper: { sx: { minWidth: 220, mt: 1, bgcolor: '#111622', border: '1px solid rgba(255, 255, 255, 0.1)' } } }}>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography fontWeight={600} color="#FFFFFF">{user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => go('/bookings')}>My bookings</MenuItem>
                  <MenuItem onClick={() => go('/profile')}>Profile</MenuItem>
                  {user.is_staff && <MenuItem component="a" href="/admin/">Admin panel</MenuItem>}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Log out</MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="contained" color="secondary" startIcon={<PersonOutlineIcon />}
                      onClick={() => openAuth('login')} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                Log in
              </Button>
            )}
            <IconButton onClick={() => setDrawer(true)} sx={{ color: fg, display: { md: 'none' } }} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={drawer}
        onClose={() => setDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '82%', sm: 340 },
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            bgcolor: '#0E121C',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            p: 1,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BrandLogo />
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ px: 2, py: 1.5 }}>
          {isAuthenticated ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: 'secondary.main', color: '#080B11', width: 42, height: 42, fontWeight: 700 }}>
                {(user.first_name || user.username)[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight={700} sx={{ color: '#FFFFFF' }}>{user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}</Typography>
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              </Box>
            </Stack>
          ) : (
            <Button fullWidth variant="contained" color="secondary" onClick={() => { setDrawer(false); openAuth('login'); }}>
              Log in or Sign up
            </Button>
          )}
        </Box>
        <Divider sx={{ my: 1 }} />
        <List sx={{ px: 1 }}>
          {NAV.map((item) => (
            <ListItemButton
              key={item.to}
              onClick={() => go(item.to)}
              sx={{ borderRadius: 2, mb: 0.5, color: '#F8FAFC', '&:hover': { bgcolor: 'rgba(245,158,11,0.12)', color: '#FBBF24' } }}
            >
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          ))}
          <ListItemButton
            onClick={() => go('/saved')}
            sx={{ borderRadius: 2, mb: 0.5, color: '#F8FAFC', '&:hover': { bgcolor: 'rgba(245,158,11,0.12)', color: '#FBBF24' } }}
          >
            <ListItemText primary={`Saved stays${savedIds.length ? ` (${savedIds.length})` : ''}`} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
          {isAuthenticated && (
            <>
              <ListItemButton
                onClick={() => go('/bookings')}
                sx={{ borderRadius: 2, mb: 0.5, color: '#F8FAFC', '&:hover': { bgcolor: 'rgba(245,158,11,0.12)', color: '#FBBF24' } }}
              >
                <ListItemText primary="My bookings" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
              <ListItemButton
                onClick={() => go('/profile')}
                sx={{ borderRadius: 2, mb: 0.5, color: '#F8FAFC', '&:hover': { bgcolor: 'rgba(245,158,11,0.12)', color: '#FBBF24' } }}
              >
                <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </>
          )}
          <ListItemButton
            onClick={() => { setDrawer(false); openListProperty(); }}
            sx={{ borderRadius: 2, mb: 0.5, color: '#F59E0B', '&:hover': { bgcolor: 'rgba(245,158,11,0.12)', color: '#FBBF24' } }}
          >
            <ListItemText primary="List your property" primaryTypographyProps={{ fontWeight: 700 }} />
          </ListItemButton>
          <ListItemButton component="a" href={`tel:${PHONE_TEL}`} sx={{ borderRadius: 2, color: '#F8FAFC' }}>
            <ListItemText primary={PHONE_DISPLAY} secondary="Call our concierge" secondaryTypographyProps={{ color: 'text.secondary' }} />
          </ListItemButton>
        </List>
        {isAuthenticated && (
          <>
            <Divider sx={{ my: 1 }} />
            <List sx={{ px: 1 }}>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
                <ListItemText primary="Log out" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </List>
          </>
        )}
      </Drawer>
    </AppBar>
  );
}
