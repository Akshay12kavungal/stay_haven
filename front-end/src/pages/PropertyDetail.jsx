import BathtubIcon from '@mui/icons-material/BathtubOutlined';
import BedIcon from '@mui/icons-material/BedOutlined';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoomOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import { Box, Breadcrumbs, Button, Card, CardContent, Chip, Container, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { EmptyState, Loading } from '../components/common/States';
import { PolicyList } from '../components/dialogs/PolicyDialog';
import PageLayout from '../components/layout/PageLayout';
import Amenities from '../components/property/Amenities';
import BookingCard from '../components/property/BookingCard';
import PhotoGrid from '../components/property/PhotoGrid';
import Reviews from '../components/property/Reviews';
import { useUI } from '../context/UIContext';
import { formatINR } from '../utils/format';
import useApi from '../utils/useApi';

const Fact = ({ icon: Icon, value, label }) => (
  <Stack
    direction="row"
    spacing={1.25}
    alignItems="center"
    sx={{
      px: 2,
      py: 1.25,
      borderRadius: 3,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      bgcolor: '#111622',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    }}
  >
    <Icon sx={{ color: '#F59E0B' }} />
    <Typography><strong>{value}</strong> {label}</Typography>
  </Stack>
);

export default function PropertyDetail() {
  const { id } = useParams();
  const { openContact } = useUI();
  const { data: property, loading, error } = useApi(`/properties/${id}/`);
  const { data: gallery } = useApi(`/gallery/?property=${id}`, { initial: [] });

  if (loading) return <PageLayout><Loading minHeight="70vh" /></PageLayout>;
  if (error || !property) {
    return (
      <PageLayout title="Stay not found">
        <EmptyState icon={SentimentDissatisfiedIcon} title="We couldn't find that stay"
                    message="It may have been removed or the link is incorrect."
                    actionLabel="Browse all stays" actionProps={{ component: RouterLink, to: '/stays' }} />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={property.name} raiseFab>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="hover">Home</Link>
          <Link component={RouterLink} to="/stays" color="inherit" underline="hover">Stays</Link>
          <Typography color="text.primary">{property.name}</Typography>
        </Breadcrumbs>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} spacing={1} sx={{ mb: 3 }}>
          <Box>
            <Chip label={property.property_type} size="small" sx={{ mb: 1 }} />
            <Typography variant="h2" component="h1">{property.name}</Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary', mt: 1 }}>
              <PlaceIcon fontSize="small" /><Typography>{property.address}</Typography>
            </Stack>
          </Box>
        </Stack>

        <PhotoGrid property={property} gallery={gallery} />

        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mt: { xs: -1, md: -2 } }}>
          <Grid item xs={12} md={7.5}>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              <Fact icon={PeopleIcon} value={property.guests} label="guests" />
              <Fact icon={MeetingRoomIcon} value={property.rooms} label="rooms" />
              <Fact icon={BedIcon} value={property.bedrooms} label="bedrooms" />
              <Fact icon={BathtubIcon} value={property.bathrooms} label="bathrooms" />
            </Stack>

            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" component="h2">About this stay</Typography>
            <Typography sx={{ mt: 1.5, lineHeight: 1.8, color: 'text.secondary', whiteSpace: 'pre-line' }}>{property.description}</Typography>

            <Divider sx={{ my: 4 }} />
            <Amenities amenities={property.amenities} />

            {gallery.length > 0 && (
              <>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h5" component="h2">Spaces</Typography>
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', mt: 2, pb: 1, scrollSnapType: 'x mandatory' }}>
                  {gallery.map((g) => (
                    <Card key={g.id} sx={{ flex: '0 0 240px', scrollSnapAlign: 'start' }}>
                      <Box component="img" src={g.image} alt={g.title} loading="lazy" sx={{ width: '100%', height: 160, objectFit: 'cover' }} />
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography fontWeight={600}>{g.title}</Typography>
                        {g.description && <Typography variant="body2" color="text.secondary">{g.description}</Typography>}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </>
            )}

            <Divider sx={{ my: 4 }} />
            <Reviews propertyId={property.id} />

            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Booking & cancellation policy</Typography>
            <PolicyList />
            <Button variant="outlined" sx={{ mt: 2 }} onClick={openContact}>Have a question? Contact us</Button>
          </Grid>
          <Grid item xs={12} md={4.5} id="book" sx={{ scrollMarginTop: 80 }}>
            <BookingCard property={property} />
          </Grid>
        </Grid>
      </Container>

      {/* Phones: keep price and a jump-to-booking button in reach. */}
      <Box sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1100,
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.75,
        bgcolor: 'rgba(8, 11, 17, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 -15px 35px rgba(0, 0, 0, 0.9)',
      }}>
        <Typography sx={{ fontSize: '1.1rem', color: '#FFFFFF' }}><strong style={{ color: '#F59E0B' }}>{formatINR(property.price)}</strong> <Box component="span" color="text.secondary" sx={{ fontSize: '0.9rem' }}>/ night</Box></Typography>
        <Button variant="contained" color="secondary" href="#book" sx={{ px: 3, fontWeight: 700 }}>Check dates</Button>
      </Box>
      <Box sx={{ height: { xs: 72, md: 0 } }} />
    </PageLayout>
  );
}
