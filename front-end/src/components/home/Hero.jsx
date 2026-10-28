import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import SearchIcon from '@mui/icons-material/Search';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Box, Button, Container, InputAdornment, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { cityOf } from '../../utils/format';
import useApi from '../../utils/useApi';

const SLIDE_MS = 9000;

const fieldSx = {
  flex: 1,
  '& .MuiFilledInput-root': {
    bgcolor: 'transparent',
    color: '#F8FAFC',
    borderRadius: { xs: 3, md: 999 },
    '&:hover, &.Mui-focused': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
  },
};

function Stat({ value, label }) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(17, 22, 34, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        px: { xs: 2, md: 3 },
        py: { xs: 1.25, md: 1.5 },
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          lineHeight: 1,
          color: '#FFFFFF',
        }}
      >
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5, display: 'block', fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function Hero({ properties }) {
  const navigate = useNavigate();
  const { data: videos } = useApi('/carousel/carouselvideo/', { initial: [] });
  const [slide, setSlide] = useState(0);
  const [where, setWhere] = useState('');
  const [guests, setGuests] = useState('');

  const destinations = useMemo(() => [...new Set(properties.map((p) => cityOf(p.address)))].sort(), [properties]);
  const rated = properties.filter((p) => p.review_count);
  const avgRating = rated.length
    ? rated.reduce((s, p) => s + p.rating * p.review_count, 0) / rated.reduce((s, p) => s + p.review_count, 0)
    : null;

  const images = useMemo(() => properties.slice(0, 4).map((p) => p.image), [properties]);
  const slides = videos.length ? videos.length : images.length;

  useEffect(() => {
    if (slides < 2) return undefined;
    const t = setInterval(() => setSlide((s) => (s + 1) % slides), SLIDE_MS);
    return () => clearInterval(t);
  }, [slides]);

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (where) params.set('q', where);
    if (guests) params.set('guests', guests);
    navigate(`/stays${params.toString() ? `?${params}` : ''}`);
  };

  const layer = (active) => ({
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: active ? 1 : 0,
    transition: 'opacity 1.6s ease',
  });

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 740, md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        overflow: 'hidden',
        bgcolor: '#080B11',
      }}
    >
      {videos.length > 0
        ? videos.map((v, i) => (
            <Box key={v.id} component="video" src={v.video} autoPlay muted loop playsInline aria-hidden sx={layer(i === slide)} />
          ))
        : images.map((src, i) => (
            <Box
              key={src}
              component="img"
              src={src}
              alt=""
              aria-hidden
              sx={{
                ...layer(i === slide),
                animation: i === slide ? 'kenburns 12s ease-out forwards' : 'none',
                '@keyframes kenburns': { from: { transform: 'scale(1.1)' }, to: { transform: 'scale(1)' } },
              }}
            />
          ))}

      {/* Layered luxury dark noir gradient with warm golden ambient light */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(8, 11, 17, 0.75) 0%, rgba(8, 11, 17, 0.45) 40%, rgba(8, 11, 17, 0.98) 100%), radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.16) 0%, transparent 65%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', pt: { xs: 14, md: 12 }, pb: { xs: 10, md: 8 } }}>
        <Box
          sx={{
            animation: 'heroIn 1s cubic-bezier(.2,.7,.2,1) both',
            '@keyframes heroIn': { from: { opacity: 0, transform: 'translateY(28px)' }, to: { opacity: 1, transform: 'none' } },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              display: 'inline-flex',
              px: 2,
              py: 0.85,
              borderRadius: 999,
              bgcolor: 'rgba(17, 22, 34, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)',
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#F59E0B', boxShadow: '0 0 12px #F59E0B' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FEF3C7', letterSpacing: '0.02em' }}>
              Hand-Picked Luxury Villas & Homestays
            </Typography>
          </Stack>

          <Typography
            variant="h1"
            sx={{
              mt: 3,
              maxWidth: 880,
              fontSize: { xs: '2.8rem', sm: '3.8rem', md: '5rem' },
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
            }}
          >
            Find your perfect{' '}
            <Box component="span" sx={{ fontStyle: 'italic', color: '#F59E0B' }}>
              sanctuary.
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 580,
              fontSize: { xs: '1.05rem', md: '1.2rem' },
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.7,
            }}
          >
            Curated private villas, lake houses and plantation retreats with private pools, resident chefs and 24/7 concierge support.
          </Typography>
        </Box>

        {/* Floating Dark Glassmorphic Search Pill */}
        <Paper
          component="form"
          onSubmit={search}
          elevation={0}
          sx={{
            mt: { xs: 4, md: 5.5 },
            p: { xs: 1.5, md: 1 },
            borderRadius: { xs: '20px', md: 999 },
            maxWidth: 820,
            bgcolor: 'rgba(17, 22, 34, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.9), 0 0 35px -10px rgba(245, 158, 11, 0.18)',
            animation: 'heroIn 1s .15s cubic-bezier(.2,.7,.2,1) both',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 1, md: 0 }}
            alignItems="stretch"
            divider={
              <Box
                sx={{
                  width: { md: '1px' },
                  height: { xs: '1px', md: 'auto' },
                  my: { md: 1.5 },
                  mx: { xs: 2, md: 0 },
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }}
              />
            }
          >
            <TextField
              select
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              label="Destination"
              variant="filled"
              SelectProps={{ displayEmpty: true }}
              InputLabelProps={{ shrink: true, sx: { color: '#94A3B8', fontWeight: 600 } }}
              sx={fieldSx}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon sx={{ color: '#F59E0B' }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">Any destination</MenuItem>
              {destinations.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              label="Guests"
              variant="filled"
              placeholder="Any guests"
              inputProps={{ min: 1, max: 30 }}
              InputLabelProps={{ shrink: true, sx: { color: '#94A3B8', fontWeight: 600 } }}
              sx={{ ...fieldSx, maxWidth: { md: 200 } }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon sx={{ color: '#F59E0B' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ p: { xs: 0.5, md: 0.5 }, display: 'flex' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SearchIcon sx={{ color: '#080B11' }} />}
                fullWidth
                sx={{
                  px: 4.5,
                  py: { xs: 1.5, md: 1.5 },
                  borderRadius: { xs: 3, md: 999 },
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#080B11',
                  boxShadow: '0 4px 18px rgba(245, 158, 11, 0.4)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.55)',
                  },
                }}
              >
                Search Stays
              </Button>
            </Box>
          </Stack>
        </Paper>

        {/* Live Metrics */}
        {properties.length > 0 && (
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 3, md: 4 }}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: { xs: 4, md: 6 }, animation: 'heroIn 1s .3s cubic-bezier(.2,.7,.2,1) both' }}
          >
            <Stat value={`${properties.length}+`} label="Verified villas & homestays" />
            <Stat value={destinations.length} label="Prime destinations" />
            {avgRating && (
              <Box
                sx={{
                  bgcolor: 'rgba(17, 22, 34, 0.75)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  px: { xs: 2, md: 3 },
                  py: { xs: 1.25, md: 1.5 },
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 700,
                      lineHeight: 1,
                      color: '#FFFFFF',
                    }}
                  >
                    {avgRating.toFixed(1)}
                  </Typography>
                  <StarRoundedIcon sx={{ color: '#F59E0B', fontSize: { xs: 24, md: 28 } }} />
                </Stack>
                <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5, display: 'block', fontWeight: 500 }}>
                  Guest review average
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Container>

      <Box
        component="a"
        href="#explore"
        aria-label="Scroll to explore"
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.7)',
          display: { xs: 'none', md: 'block' },
          animation: 'bob 2.2s ease-in-out infinite',
          '&:hover': { color: '#F59E0B' },
          '@keyframes bob': { '0%,100%': { transform: 'translate(-50%,0)' }, '50%': { transform: 'translate(-50%,8px)' } },
        }}
      >
        <KeyboardArrowDownIcon fontSize="large" />
      </Box>
    </Box>
  );
}
