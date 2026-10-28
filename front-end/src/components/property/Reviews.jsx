import { Alert, Avatar, Box, Button, Card, Grid, Rating, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { apiErrorMessage } from '../../utils/format';
import useApi from '../../utils/useApi';

export default function Reviews({ propertyId }) {
  const { isAuthenticated } = useAuth();
  const { openAuth, notify } = useUI();
  const { data: reviews, setData } = useApi(`/reviews/reviews/?property=${propertyId}`, { initial: [] });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [writing, setWriting] = useState(false);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/reviews/reviews/', { property: propertyId, rating, comment });
      setData((list) => [data, ...list]);
      setComment('');
      setWriting(false);
      notify('Thanks for your review!');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not post your review.'));
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" component="h2">Guest reviews</Typography>
          {reviews.length > 0 && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <Rating value={avg} precision={0.5} readOnly size="small" />
              <Typography color="text.secondary">{avg.toFixed(1)} · {reviews.length} review{reviews.length > 1 ? 's' : ''}</Typography>
            </Stack>
          )}
        </Box>
        {!writing && (
          <Button variant="outlined" onClick={() => (isAuthenticated ? setWriting(true) : openAuth('login', () => setWriting(true)))}>
            Write a review
          </Button>
        )}
      </Stack>

      {writing && (
        <Card component="form" onSubmit={submit} sx={{ p: 2.5, mt: 2 }}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <Rating value={rating} onChange={(_, v) => setRating(v || 1)} size="large" />
            <TextField label="Tell others about your stay" value={comment} onChange={(e) => setComment(e.target.value)}
                       multiline minRows={3} required />
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained">Post review</Button>
              <Button onClick={() => setWriting(false)}>Cancel</Button>
            </Stack>
          </Stack>
        </Card>
      )}

      {reviews.length === 0 && !writing ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>No reviews yet. Stayed here? Be the first to share.</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {reviews.slice(0, 6).map((r) => (
            <Grid item xs={12} md={6} key={r.id}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: 'secondary.main' }}>{r.username[0].toUpperCase()}</Avatar>
                <Box>
                  <Typography fontWeight={600}>{r.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(r.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
              </Stack>
              <Rating value={r.rating} readOnly size="small" sx={{ mt: 1 }} />
              <Typography sx={{ mt: 0.5, lineHeight: 1.7 }}>{r.comment}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
