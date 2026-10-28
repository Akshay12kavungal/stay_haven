import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Box, Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { cityOf } from '../../utils/format';
import Reveal from '../common/Reveal';
import SectionHeader from '../common/SectionHeader';

export default function Destinations({ properties }) {
  const places = useMemo(() => {
    const map = new Map();
    properties.forEach((p) => {
      const city = cityOf(p.address);
      const entry = map.get(city) || { city, region: p.address.split(',').slice(1).join(',').trim(), image: p.image, count: 0 };
      entry.count += 1;
      map.set(city, entry);
    });
    return [...map.values()].slice(0, 5);
  }, [properties]);

  if (!places.length) return null;

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#0B0F19' }}>
      <Container maxWidth="lg">
        <Reveal>
          <SectionHeader
            eyebrow="Iconic Escapes"
            title="Where Would You Like to Wake Up?"
            subtitle="From cliff-top sea villas in Kerala to mist-covered tea estate bungalows in Munnar."
          />
        </Reveal>
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gridAutoRows: { xs: 220, sm: 200, md: 230 },
          }}
        >
          {places.map((place, i) => (
            <Reveal
              key={place.city}
              delay={i * 80}
              sx={{
                gridColumn: i === 0 ? { sm: 'span 2', md: 'span 2' } : undefined,
                gridRow: i === 0 ? { md: 'span 2' } : undefined,
              }}
            >
              <Box
                component={RouterLink}
                to={`/stays?q=${encodeURIComponent(place.city)}`}
                sx={{
                  position: 'relative',
                  display: 'block',
                  height: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  color: '#fff',
                  textDecoration: 'none',
                  bgcolor: '#111622',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                  transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'rgba(245, 158, 11, 0.4)',
                    boxShadow: '0 25px 50px -10px rgba(0, 0, 0, 0.95), 0 0 25px -5px rgba(245, 158, 11, 0.25)',
                    '& img': { transform: 'scale(1.08)' },
                    '& .go': { bgcolor: '#F59E0B', color: '#080B11', transform: 'rotate(45deg)' },
                  },
                }}
              >
                <Box
                  component="img"
                  src={place.image}
                  alt={place.city}
                  loading="lazy"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s cubic-bezier(.2,.7,.2,1)' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(8,11,17,0.15) 20%, rgba(8,11,17,0.9) 100%)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    left: 22,
                    right: 22,
                    bottom: 20,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant={i === 0 ? 'h3' : 'h5'}
                      component="h3"
                      sx={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 700,
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                      }}
                    >
                      {place.city}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, mt: 0.3 }}>
                      {place.count} {place.count === 1 ? 'stay' : 'stays'} available
                    </Typography>
                  </Box>
                  <Box
                    className="go"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(8px)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                      transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowOutwardIcon fontSize="small" />
                  </Box>
                </Box>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
