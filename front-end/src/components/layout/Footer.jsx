import { Box, Container, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, SITE_NAME, SOCIAL_LINKS } from '../../config';
import { useUI } from '../../context/UIContext';
import BrandLogo from '../common/BrandLogo';

const linkSx = {
  color: 'rgba(255,255,255,0.72)',
  textDecoration: 'none',
  fontSize: '0.95rem',
  cursor: 'pointer',
  background: 'none',
  border: 0,
  p: 0,
  font: 'inherit',
  textAlign: 'left',
  transition: 'color 0.2s ease',
  '&:hover': { color: '#F59E0B' },
};

function Column({ title, children }) {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ color: '#F59E0B', fontWeight: 800, letterSpacing: '0.12em', display: 'block', mb: 1.5 }}
      >
        {title}
      </Typography>
      <Stack spacing={1.25}>{children}</Stack>
    </Box>
  );
}

export default function Footer() {
  const { openContact, openPolicy, openListProperty } = useUI();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#05070B',
        color: '#fff',
        pt: { xs: 8, md: 10 },
        pb: 5,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid item xs={12} md={4}>
            <BrandLogo light size="lg" />
            <Typography sx={{ mt: 2.5, color: 'rgba(255,255,255,0.7)', maxWidth: 320, lineHeight: 1.7, fontSize: '0.95rem' }}>
              Hand-picked, verified villas and homestays across India — with private pools, daily housekeeping, resident chefs, and complete tranquility.
            </Typography>
          </Grid>
          <Grid item xs={6} md={2.5}>
            <Column title="Explore">
              <Link component={RouterLink} to="/stays" sx={linkSx}>
                All Stays
              </Link>
              <Link component={RouterLink} to="/gallery" sx={linkSx}>
                Photo Gallery
              </Link>
              <Link component={RouterLink} to="/aboutus" sx={linkSx}>
                About StayHaven
              </Link>
              <Link component="button" onClick={openListProperty} sx={linkSx}>
                List Your Property
              </Link>
            </Column>
          </Grid>
          <Grid item xs={6} md={2.5}>
            <Column title="Guest Support">
              <Link component={RouterLink} to="/faq" sx={linkSx}>
                Frequently Asked Questions
              </Link>
              <Link component="button" onClick={openPolicy} sx={linkSx}>
                Cancellation & Refund Policy
              </Link>
              <Link component="button" onClick={openContact} sx={linkSx}>
                Contact Concierge
              </Link>
            </Column>
          </Grid>
          <Grid item xs={12} md={3}>
            <Column title="Direct Inquiries">
              <Link href={`tel:${PHONE_TEL}`} sx={{ ...linkSx, fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                {PHONE_DISPLAY}
              </Link>
              <Link href={`mailto:${CONTACT_EMAIL}`} sx={linkSx}>
                {CONTACT_EMAIL}
              </Link>
              <Stack direction="row" spacing={2.5} sx={{ pt: 1.5 }}>
                {SOCIAL_LINKS.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ ...linkSx, fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    {s.label}
                  </Link>
                ))}
              </Stack>
            </Column>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 5 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: { xs: 'center', sm: 'left' } }}>
            © {new Date().getFullYear()}{' '}
            <Box component="span" sx={{ color: '#F59E0B', fontWeight: 700 }}>
              {SITE_NAME}
            </Box>
            . All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: { xs: 'center', sm: 'right' } }}>
            Luxury Villas & Boutique Homestays Across India
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
