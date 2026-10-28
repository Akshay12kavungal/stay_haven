import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import useApi from '../../utils/useApi';
import Reveal from '../common/Reveal';
import SectionHeader from '../common/SectionHeader';

export default function GalleryStrip() {
  const { data: images } = useApi('/gallery/', { initial: [] });
  if (images.length === 0) return null;
  const shown = images.slice(0, 5);
  return (
    <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: '#080B11' }}>
      <Container maxWidth="lg">
        <Reveal><SectionHeader eyebrow="Gallery" title="A Glimpse of Your Next Stay"
                       action={<Button component={RouterLink} to="/gallery" variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ flexShrink: 0, fontWeight: 700 }}>View Gallery</Button>} /></Reveal>
        <Reveal delay={100}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr' },
                   gridTemplateRows: { xs: 'repeat(3, 160px)', md: 'repeat(2, 220px)' } }}>
          {shown.map((img, i) => (
            <Box key={img.id} component={RouterLink} to="/gallery" state={{ imageId: img.id }}
                 sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', display: 'block',
                       border: '1px solid rgba(255, 255, 255, 0.08)',
                       gridRow: i === 0 ? { xs: 'span 1', md: 'span 2' } : undefined,
                       gridColumn: i === 0 ? { xs: 'span 2', md: 'auto' } : undefined,
                       '&:hover img': { transform: 'scale(1.06)' } }}>
              <Box component="img" src={img.image} alt={img.title} loading="lazy"
                   sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s' }} />
              {img.tag && (
                <Box sx={{ position: 'absolute', left: 12, bottom: 12, px: 1.25, py: 0.5, borderRadius: 999, fontSize: 13,
                           bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)' }}>{img.tag}</Box>
              )}
            </Box>
          ))}
        </Box>
        </Reveal>
      </Container>
    </Box>
  );
}
