import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import { Avatar, Box, Container, IconButton, Rating, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import useApi from '../../utils/useApi';
import Reveal from '../common/Reveal';

const ROTATE_MS = 7000;

// Rotating quotes from real guest reviews; hidden when there are none.
export default function Testimonials({ properties }) {
  const { data } = useApi('/reviews/reviews/', { initial: [] });
  const reviews = useMemo(() => data.filter((r) => r.rating >= 4 && r.comment.length > 40).slice(0, 8), [data]);
  const names = useMemo(() => Object.fromEntries(properties.map((p) => [p.id, p.name])), [properties]);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reviews.length < 2 || paused) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [reviews.length, paused]);

  if (!reviews.length) return null;
  const r = reviews[i % reviews.length];
  const go = (d) => setI((x) => (x + d + reviews.length) % reviews.length);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#0B0F19' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Reveal>
          <Typography variant="overline" color="secondary.main">Guest stories</Typography>
          <FormatQuoteRoundedIcon sx={{ display: 'block', mx: 'auto', fontSize: 64, color: 'secondary.main', mt: 1 }} />
          <Box key={r.id} sx={{ animation: 'quoteIn .6s ease', '@keyframes quoteIn': { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'none' } } }}>
            <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: { xs: '1.45rem', md: '2rem' }, lineHeight: 1.45, minHeight: { md: '6em' }, color: '#FFFFFF' }}>
              “{r.comment}”
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', color: '#080B11', fontWeight: 700, width: 48, height: 48 }}>{r.username[0].toUpperCase()}</Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography fontWeight={600} color="#FFFFFF">{r.username}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={r.rating} readOnly size="small" />
                  {names[r.property] && (
                    <Typography component={RouterLink} to={`/single/${r.property}`} variant="body2" color="text.secondary"
                                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}>
                      {names[r.property]}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>
          {reviews.length > 1 && (
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
              <IconButton onClick={() => go(-1)} aria-label="Previous review" sx={{ border: '1px solid', borderColor: 'divider' }}><ChevronLeftIcon /></IconButton>
              <Stack direction="row" spacing={1}>
                {reviews.map((rev, idx) => (
                  <Box key={rev.id} component="button" onClick={() => setI(idx)} aria-label={`Show review ${idx + 1}`}
                       sx={{ width: idx === i ? 24 : 8, height: 8, borderRadius: 4, border: 0, p: 0, cursor: 'pointer', transition: 'all .3s',
                             bgcolor: idx === i ? 'secondary.main' : 'divider' }} />
                ))}
              </Stack>
              <IconButton onClick={() => go(1)} aria-label="Next review" sx={{ border: '1px solid', borderColor: 'divider' }}><ChevronRightIcon /></IconButton>
            </Stack>
          )}
        </Reveal>
      </Container>
    </Box>
  );
}
