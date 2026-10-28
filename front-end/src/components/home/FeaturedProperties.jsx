import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import { Box, Button, Container, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import PropertyCard from '../common/PropertyCard';
import Reveal from '../common/Reveal';
import SectionHeader from '../common/SectionHeader';
import { CardGridSkeleton, EmptyState } from '../common/States';

export default function FeaturedProperties({ properties, loading }) {
  return (
    <Box id="explore" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#080B11', scrollMarginTop: 70 }}>
      <Container maxWidth="lg">
        <Reveal>
          <SectionHeader
            eyebrow="Curated Collection"
            title="Stays Our Guests Love"
            subtitle="Every single property is visited, inspected and verified in person by our hospitality team."
            action={
              properties.length > 6 && (
                <Button
                  component={RouterLink}
                  to="/stays"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ flexShrink: 0, fontWeight: 700 }}
                >
                  View All Stays
                </Button>
              )
            }
          />
        </Reveal>

        {loading ? (
          <CardGridSkeleton />
        ) : properties.length === 0 ? (
          <EmptyState
            icon={HomeWorkOutlinedIcon}
            title="New retreats coming soon"
            message="We are currently onboarding hand-picked villas and homestays. Check back shortly."
          />
        ) : (
          <Grid container spacing={{ xs: 2.5, md: 3.5 }} rowSpacing={{ xs: 4, md: 5 }}>
            {properties.slice(0, 6).map((p, i) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <Reveal delay={(i % 3) * 100} sx={{ height: '100%' }}>
                  <PropertyCard property={p} />
                </Reveal>
              </Grid>
            ))}
          </Grid>
        )}

        {properties.length > 0 && properties.length <= 6 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={RouterLink}
              to="/stays"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 1.5, fontWeight: 700 }}
            >
              Explore All Stays
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
