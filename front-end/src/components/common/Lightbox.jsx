import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';

// Full-screen image viewer with keyboard (←/→/Esc) navigation.
export default function Lightbox({ images, index, onClose, onChange }) {
  const open = index !== null && index >= 0 && images.length > 0;
  const prev = useCallback(() => onChange((index - 1 + images.length) % images.length), [index, images.length, onChange]);
  const next = useCallback(() => onChange((index + 1) % images.length), [index, images.length, onChange]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, prev, next]);

  if (!open) return null;
  const img = images[index];
  const navBtn = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', color: '#fff', bgcolor: 'rgba(255,255,255,0.12)',
                   '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } };

  return (
    <Dialog open fullScreen onClose={onClose} PaperProps={{ sx: { bgcolor: 'rgba(10,10,10,0.97)', borderRadius: 0 } }}>
      <IconButton onClick={onClose} aria-label="Close" sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', zIndex: 2 }}>
        <CloseIcon />
      </IconButton>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 1, md: 8 }, position: 'relative' }}>
        <Box component="img" src={img.image} alt={img.title || ''}
             sx={{ maxWidth: '100%', maxHeight: 'calc(100vh - 140px)', objectFit: 'contain', borderRadius: 2 }} />
        {images.length > 1 && (
          <>
            <IconButton onClick={prev} aria-label="Previous photo" sx={{ ...navBtn, left: { xs: 8, md: 24 } }}><ChevronLeftIcon fontSize="large" /></IconButton>
            <IconButton onClick={next} aria-label="Next photo" sx={{ ...navBtn, right: { xs: 8, md: 24 } }}><ChevronRightIcon fontSize="large" /></IconButton>
          </>
        )}
      </Box>
      <Box sx={{ textAlign: 'center', color: '#fff', pb: 3, px: 2 }}>
        <Typography fontWeight={600}>{img.title}</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          {img.caption || img.description}{(img.caption || img.description) ? ' · ' : ''}{index + 1} / {images.length}
        </Typography>
      </Box>
    </Dialog>
  );
}
