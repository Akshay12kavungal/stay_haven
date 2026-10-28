import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import { Box, Chip, Container, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Lightbox from '../components/common/Lightbox';
import { EmptyState, Loading } from '../components/common/States';
import PageLayout from '../components/layout/PageLayout';
import useApi from '../utils/useApi';

export default function Gallery() {
  const location = useLocation();
  const { data: images, loading } = useApi('/gallery/', { initial: [] });
  const { data: properties } = useApi('/properties/', { initial: [] });
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [index, setIndex] = useState(null);

  const names = useMemo(() => Object.fromEntries(properties.map((p) => [p.id, p.name])), [properties]);
  const shown = useMemo(
    () => images
      .filter((img) => propertyFilter === 'all' || img.property === propertyFilter)
      .map((img) => ({ ...img, caption: names[img.property] })),
    [images, propertyFilter, names],
  );

  // Opened from a homepage tile: jump straight to that photo.
  useEffect(() => {
    const id = location.state?.imageId;
    if (id && images.length) {
      const i = images.findIndex((img) => img.id === id);
      if (i >= 0) setIndex(i);
    }
  }, [location.state, images]);

  const withPhotos = properties.filter((p) => images.some((img) => img.property === p.id));

  return (
    <PageLayout title="Gallery">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="overline" color="secondary.main">Gallery</Typography>
        <Typography variant="h2" component="h1">Moments from our stays</Typography>

        {withPhotos.length > 1 && (
          <Stack direction="row" spacing={1} sx={{ mt: 3, overflowX: 'auto', pb: 1 }}>
            <Chip label="All" onClick={() => setPropertyFilter('all')} color={propertyFilter === 'all' ? 'secondary' : 'default'} />
            {withPhotos.map((p) => (
              <Chip key={p.id} label={p.name} onClick={() => setPropertyFilter(p.id)} color={propertyFilter === p.id ? 'secondary' : 'default'} />
            ))}
          </Stack>
        )}

        {loading ? <Loading /> : shown.length === 0 ? (
          <EmptyState icon={PhotoLibraryOutlinedIcon} title="No photos yet" message="Photos of our properties will appear here soon." />
        ) : (
          <Box sx={{ mt: 4, columnCount: { xs: 1, sm: 2, md: 3 }, columnGap: 2 }}>
            {shown.map((img, i) => (
              <Box key={img.id} component="button" onClick={() => setIndex(i)} aria-label={`Open ${img.title}`}
                   sx={{ display: 'block', width: '100%', p: 0, border: 0, mb: 2, borderRadius: 4, overflow: 'hidden', cursor: 'zoom-in',
                         position: 'relative', breakInside: 'avoid', bgcolor: '#161B29',
                         '&:hover img': { transform: 'scale(1.04)' }, '&:hover .caption': { opacity: 1 } }}>
                <Box component="img" src={img.image} alt={img.title} loading="lazy" sx={{ width: '100%', transition: 'transform .5s' }} />
                <Box className="caption" sx={{ position: 'absolute', inset: 'auto 0 0 0', p: 2, textAlign: 'left', color: '#fff', opacity: { xs: 1, md: 0 },
                                               transition: 'opacity .3s', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                  <Typography fontWeight={600}>{img.title}</Typography>
                  {img.caption && <Typography variant="body2" sx={{ opacity: 0.8 }}>{img.caption}</Typography>}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
      <Lightbox images={shown} index={index} onClose={() => setIndex(null)} onChange={setIndex} />
    </PageLayout>
  );
}
