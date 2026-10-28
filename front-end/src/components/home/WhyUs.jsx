import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { Box, Container, Grid, Typography } from '@mui/material';

import Reveal from '../common/Reveal';
import SectionHeader from '../common/SectionHeader';

const FEATURES = [
  {
    icon: SecurityOutlinedIcon,
    title: '100% In-Person Verified',
    text: 'Every villa passes our rigorous 80-point inspection covering cleanliness, hygiene, amenities and safety.',
  },
  {
    icon: RestaurantMenuOutlinedIcon,
    title: 'Private Resident Chefs',
    text: 'Savour fresh, tailored homestyle meals, barbecues and regional delicacies crafted right at your stay.',
  },
  {
    icon: CleaningServicesOutlinedIcon,
    title: 'Spotless Hospitality',
    text: 'Impeccable hotel-grade linen, daily fresh towel service and spotless rooms throughout your stay.',
  },
  {
    icon: KeyOutlinedIcon,
    title: 'Dedicated Concierge',
    text: 'Local recommendations, seamless key handovers and rapid on-ground assistance just a phone call away.',
  },
];

export default function WhyUs() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#080B11' }}>
      <Container maxWidth="lg">
        <Reveal>
          <SectionHeader
            eyebrow="Why StayHaven"
            title="The Ideal Blend of Home and Luxury Resort"
            subtitle="Everything you love about boutique hotels combined with the privacy, freedom and warmth of a private home."
            align="center"
          />
        </Reveal>
        <Grid container spacing={3.5}>
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Reveal delay={i * 90} sx={{ height: '100%' }}>
                <Box
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    bgcolor: '#111622',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'rgba(245, 158, 11, 0.4)',
                      boxShadow: '0 25px 45px -10px rgba(0, 0, 0, 0.9), 0 0 25px -5px rgba(245, 158, 11, 0.2)',
                      '& .icon-wrap': {
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: '#080B11',
                        transform: 'scale(1.08)',
                      },
                    },
                  }}
                >
                  <Box
                    className="icon-wrap"
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      bgcolor: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      color: '#F59E0B',
                      display: 'grid',
                      placeItems: 'center',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Icon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      mt: 2.5,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      fontSize: '1.15rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography sx={{ color: '#94A3B8', mt: 1, lineHeight: 1.65, fontSize: '0.95rem' }}>
                    {text}
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
