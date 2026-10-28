import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Container, Grid, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import PropertyCard from '../components/common/PropertyCard';
import Reveal from '../components/common/Reveal';
import { CardGridSkeleton, EmptyState } from '../components/common/States';
import PageLayout from '../components/layout/PageLayout';
import useApi from '../utils/useApi';
import useSaved from '../utils/useSaved';

export default function Saved() {
  const { ids } = useSaved();
  const { data: properties, loading } = useApi('/properties/', { initial: [] });
  const saved = properties.filter((p) => ids.includes(p.id));

  return (
    <PageLayout title="Saved stays">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="overline" color="secondary.main">Wishlist</Typography>
        <Typography variant="h2" component="h1">Saved stays</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>Tap the heart on any stay to keep it here for later.</Typography>
        {loading ? <CardGridSkeleton /> : saved.length === 0 ? (
          <EmptyState icon={FavoriteBorderIcon} title="Nothing saved yet" message="Browse our stays and save the ones you love."
                      actionLabel="Explore stays" actionProps={{ component: RouterLink, to: '/stays' }} />
        ) : (
          <Grid container spacing={3} rowSpacing={5}>
            {saved.map((p, i) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}><Reveal delay={(i % 3) * 80} sx={{ height: '100%' }}><PropertyCard property={p} /></Reveal></Grid>
            ))}
          </Grid>
        )}
      </Container>
    </PageLayout>
  );
}
