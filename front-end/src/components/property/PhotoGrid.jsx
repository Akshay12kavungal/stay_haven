import GridViewIcon from '@mui/icons-material/GridViewOutlined';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

import Lightbox from '../common/Lightbox';

export default function PhotoGrid({ property, gallery }) {
  const [index, setIndex] = useState(null);
  const images = [{ id: 'cover', image: property.image, title: property.name }, ...gallery];
  const tiles = images.slice(0, 5);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{
        display: 'grid',
        gap: 1.5,
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: '0 12px 35px -10px rgba(15, 23, 42, 0.12)',
        gridTemplateColumns: { xs: '1fr', md: tiles.length > 1 ? '2fr 1fr 1fr' : '1fr' },
        gridTemplateRows: { xs: '300px', sm: '420px', md: 'repeat(2, 230px)' },
      }}>
        {tiles.map((img, i) => (
          <Box
            key={img.id}
            component="button"
            onClick={() => setIndex(i)}
            aria-label={`Open photo ${i + 1}`}
            sx={{
              p: 0,
              border: 0,
              cursor: 'zoom-in',
              overflow: 'hidden',
              bgcolor: '#161B29',
              display: i === 0 ? 'block' : { xs: 'none', md: 'block' },
              gridRow: i === 0 ? { md: 'span 2' } : undefined,
              position: 'relative',
              '&:hover img': { transform: 'scale(1.05)', filter: 'brightness(0.94)' },
            }}
          >
            <Box
              component="img"
              src={img.image}
              alt={img.title || property.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease, filter 0.3s ease' }}
            />
          </Box>
        ))}
      </Box>
      {images.length > 1 && (
        <Button
          onClick={() => setIndex(0)}
          startIcon={<GridViewIcon sx={{ color: '#F59E0B' }} />}
          variant="contained"
          sx={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            bgcolor: 'rgba(8, 11, 17, 0.88)',
            backdropFilter: 'blur(12px)',
            color: '#F8FAFC',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7)',
            fontWeight: 600,
            px: 2.5,
            py: 1,
            '&:hover': {
              bgcolor: '#111622',
              borderColor: 'rgba(245, 158, 11, 0.4)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.9)',
            },
          }}
        >
          Show all {images.length} photos
        </Button>
      )}
      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onChange={setIndex} />
    </Box>
  );
}
