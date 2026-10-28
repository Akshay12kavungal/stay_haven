import { Box, Button, Container, Stack, Typography } from '@mui/material';

import { useUI } from '../../context/UIContext';
import Reveal from '../common/Reveal';

export default function ListPropertyBanner() {
  const { openListProperty } = useUI();
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Reveal>
        <Box
          sx={{
            borderRadius: { xs: '20px', md: '28px' },
            px: { xs: 3.5, md: 8 },
            py: { xs: 5, md: 7 },
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #06080E 0%, #111622 55%, #0A0D15 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 35px -8px rgba(245, 158, 11, 0.25)',
          }}
        >
          {/* Subtle warm glow orb */}
          <Box
            sx={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
              filter: 'blur(35px)',
              pointerEvents: 'none',
            }}
          />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            alignItems={{ md: 'center' }}
            justifyContent="space-between"
            sx={{ position: 'relative' }}
          >
            <Box sx={{ maxWidth: 640 }}>
              <Typography
                variant="overline"
                sx={{
                  color: '#F59E0B',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                }}
              >
                For Villa & Homestay Owners
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  mt: 0.5,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.9rem', md: '2.5rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                List Your Property on StayHaven
              </Typography>
              <Typography sx={{ mt: 1.5, color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                Offer exceptional getaways to high-quality travelers across the globe. We manage guest vetting, calendar distribution, advance payments and 24/7 guest support.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={openListProperty}
              sx={{
                flexShrink: 0,
                px: 4,
                py: 1.75,
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 999,
              }}
            >
              Partner With Us
            </Button>
          </Stack>
        </Box>
      </Reveal>
    </Container>
  );
}
