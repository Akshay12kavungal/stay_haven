import { Box, Container, Grid, Typography } from '@mui/material';

import PropertyCard from '../components/common/PropertyCard';
import SectionHeader from '../components/common/SectionHeader';
import { CardGridSkeleton } from '../components/common/States';
import WhyUs from '../components/home/WhyUs';
import PageLayout from '../components/layout/PageLayout';
import useApi from '../utils/useApi';

export default function About() {
  const { data: properties, loading } = useApi('/properties/', { initial: [] });
  return (
    <PageLayout title="About us">
      <Box sx={{
        bgcolor: '#080B11',
        color: '#fff',
        py: { xs: 9, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.16) 0%, #080B11 75%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: '#F59E0B', fontWeight: 800 }}>About Us</Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mt: 1,
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: { xs: '2.4rem', md: '3.4rem' },
            }}
          >
            Your Peaceful Sanctuary is Our Priority
          </Typography>
          <Typography sx={{ mt: 3, color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            StayHaven is an Indian startup founded in 2025, where you can book hand-picked, verified properties
            across India for short and long stays.
          </Typography>
          <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            Our stays come with private pools, daily housekeeping, WiFi and a lot more. Perfect for groups and small
            families alike, it's your ideal blend of home and holiday. Pick your favourite retreat with StayHaven.
          </Typography>
        </Container>
      </Box>
      <WhyUs />
      <Box sx={{ pb: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <SectionHeader eyebrow="Our properties" title="Explore our stays" />
          {loading ? <CardGridSkeleton /> : (
            <Grid container spacing={3}>
              {properties.map((p) => <Grid item xs={12} sm={6} md={4} key={p.id}><PropertyCard property={p} /></Grid>)}
            </Grid>
          )}
        </Container>
      </Box>
    </PageLayout>
  );
}
