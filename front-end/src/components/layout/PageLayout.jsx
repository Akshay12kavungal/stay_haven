import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Fab, Tooltip } from '@mui/material';
import { useEffect } from 'react';

import { SITE_NAME, WHATSAPP_NUMBER } from '../../config';
import Footer from './Footer';
import Navbar from './Navbar';

// Wraps every page: navbar, main content, footer, WhatsApp button and the document title.
export default function PageLayout({ children, title, heroUnderNav = false, raiseFab = false }) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Hand-picked villas & homestays`;
  }, [title]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar transparent={heroUnderNav} />
      <Box component="main" sx={{ flexGrow: 1, pt: heroUnderNav ? 0 : { xs: '64px', md: '76px' } }}>{children}</Box>
      <Footer />
      <Tooltip title="Chat with us on WhatsApp" placement="left">
        <Fab href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
             sx={{ position: 'fixed', right: { xs: 16, md: 28 }, bottom: { xs: raiseFab ? 88 : 16, md: 28 }, bgcolor: '#25D366', color: '#fff',
                   '&:hover': { bgcolor: '#1ebe5b', transform: 'scale(1.06)' }, transition: 'transform .2s' }}>
          <WhatsAppIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}
