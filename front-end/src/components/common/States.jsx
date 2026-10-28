import { Box, Button, CircularProgress, Grid, Skeleton, Typography } from '@mui/material';

export function Loading({ minHeight = 320 }) {
  return (
    <Box sx={{ minHeight, display: 'grid', placeItems: 'center' }}>
      <CircularProgress color="secondary" />
    </Box>
  );
}

export function CardGridSkeleton({ count = 3 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Skeleton variant="rounded" sx={{ aspectRatio: '4 / 3', height: 'auto' }} />
          <Skeleton width="70%" sx={{ mt: 1.5, fontSize: '1.4rem' }} />
          <Skeleton width="40%" />
        </Grid>
      ))}
    </Grid>
  );
}

export function EmptyState({ icon: Icon, title, message, actionLabel, onAction, actionProps }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, px: 2 }}>
      {Icon && (
        <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B',
                   border: '1px solid rgba(245, 158, 11, 0.3)',
                   display: 'grid', placeItems: 'center', mx: 'auto', mb: 2.5 }}>
          <Icon sx={{ fontSize: 34 }} />
        </Box>
      )}
      <Typography variant="h5" component="p">{title}</Typography>
      {message && <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 440, mx: 'auto' }}>{message}</Typography>}
      {actionLabel && (
        <Button variant="contained" sx={{ mt: 3 }} onClick={onAction} {...actionProps}>{actionLabel}</Button>
      )}
    </Box>
  );
}
