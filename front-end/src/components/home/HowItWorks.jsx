import { Box, Container, Grid, Typography } from '@mui/material';

import Reveal from '../common/Reveal';
import SectionHeader from '../common/SectionHeader';

const STEPS = [
  {
    num: '01',
    title: 'Choose Your Sanctuary',
    text: 'Explore verified luxury villas and homestays. Compare curated amenities, verified photographs, and real availability.',
  },
  {
    num: '02',
    title: 'Hold With Small Advance',
    text: 'Lock your dates instantly with a low advance payment. We immediately reserve the property exclusively for your party.',
  },
  {
    num: '03',
    title: 'Arrive and Unwind',
    text: 'Pay the balance comfortably at check-in. Our resident team, housekeeping, and concierge take care of every detail.',
  },
];

export default function HowItWorks() {
  return (
    <Box
      sx={{
        py: { xs: 9, md: 14 },
        bgcolor: '#05070B',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Radiant golden backdrop glows */}
      <Box
        sx={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          right: -180,
          top: -200,
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, transparent 65%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          left: -150,
          bottom: -150,
          background: 'radial-gradient(circle, rgba(17, 22, 34, 0.9) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Reveal>
          <SectionHeader
            eyebrow="Effortless Booking"
            title="Book Your Getaway in 3 Easy Steps"
            subtitle="Transparent pricing, no hidden booking fees, and dedicated human support from booking to checkout."
            sx={{
              '& h2': { color: '#FFFFFF' },
              '& p': { color: 'rgba(255, 255, 255, 0.75)' },
            }}
          />
        </Reveal>

        <Grid container spacing={{ xs: 4, md: 6 }}>
          {STEPS.map((step, i) => (
            <Grid item xs={12} md={4} key={step.title}>
              <Reveal delay={i * 120}>
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: '20px',
                    bgcolor: 'rgba(17, 22, 34, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(12px)',
                    height: '100%',
                    transition: 'border-color 0.35s, transform 0.35s, box-shadow 0.35s',
                    '&:hover': {
                      borderColor: 'rgba(245, 158, 11, 0.45)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.9), 0 0 25px -5px rgba(245, 158, 11, 0.2)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: { xs: '3rem', md: '3.8rem' },
                      fontWeight: 700,
                      lineHeight: 1,
                      color: 'transparent',
                      WebkitTextStroke: '1.5px rgba(245, 158, 11, 0.85)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {step.num}
                  </Typography>
                  <Box sx={{ width: 42, height: 3, bgcolor: '#F59E0B', borderRadius: 2, my: 2 }} />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ mt: 1.25, color: '#94A3B8', lineHeight: 1.7, fontSize: '0.98rem' }}>
                    {step.text}
                  </Typography>
                </Box>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
