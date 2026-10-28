import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Button, Container, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import PropertyCard from '../components/common/PropertyCard';
import { CardGridSkeleton, EmptyState } from '../components/common/States';
import PageLayout from '../components/layout/PageLayout';
import useApi from '../utils/useApi';

const SORTS = {
  recommended: { label: 'Recommended', fn: () => 0 },
  price_asc: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  price_desc: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  guests: { label: 'Most guests', fn: (a, b) => b.guests - a.guests },
};

export default function Stays() {
  const { data: properties, loading } = useApi('/properties/', { initial: [] });
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const guests = params.get('guests') || '';
  const type = params.get('type') || '';
  const sort = params.get('sort') || 'recommended';

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  const types = useMemo(() => [...new Set(properties.map((p) => p.property_type))].sort(), [properties]);
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return properties
      .filter((p) => !needle || `${p.name} ${p.address} ${p.property_type}`.toLowerCase().includes(needle))
      .filter((p) => !guests || p.guests >= Number(guests))
      .filter((p) => !type || p.property_type === type)
      .map((p) => ({ ...p, price: Number(p.price) }))
      .sort(SORTS[sort]?.fn || SORTS.recommended.fn);
  }, [properties, q, guests, type, sort]);

  const filtered = q || guests || type;

  return (
    <PageLayout title="Explore stays">
      <Box sx={{ bgcolor: '#0B0F19', py: { xs: 5, md: 7 }, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: '#F59E0B', fontWeight: 800 }}>Explore</Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              fontSize: { xs: '2.2rem', md: '3rem' },
            }}
          >
            Find Your Next Sanctuary
          </Typography>
          <Box
            sx={{
              mt: 3.5,
              p: { xs: 2, md: 2.5 },
              bgcolor: '#111622',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                placeholder="Search by villa name, city or location"
                value={q}
                onChange={(e) => update('q', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#F59E0B' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Guests"
                type="number"
                value={guests}
                onChange={(e) => update('guests', e.target.value)}
                inputProps={{ min: 1 }}
                sx={{ maxWidth: { md: 150 } }}
              />
              <TextField select label="Property Type" value={type} onChange={(e) => update('type', e.target.value)} sx={{ maxWidth: { md: 220 } }}>
                <MenuItem value="">All types</MenuItem>
                {types.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
              <TextField
                select
                label="Sort By"
                value={sort}
                onChange={(e) => update('sort', e.target.value === 'recommended' ? '' : e.target.value)}
                sx={{ maxWidth: { md: 220 } }}
              >
                {Object.entries(SORTS).map(([k, s]) => <MenuItem key={k} value={k}>{s.label}</MenuItem>)}
              </TextField>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        {!loading && (
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography color="text.secondary">{results.length} stay{results.length === 1 ? '' : 's'}{filtered ? ' match your search' : ''}</Typography>
            {filtered && <Button onClick={() => setParams({}, { replace: true })}>Clear filters</Button>}
          </Stack>
        )}
        {loading ? <CardGridSkeleton count={6} /> : results.length === 0 ? (
          <EmptyState icon={SearchOffIcon} title="No stays match" message="Try a different place, fewer guests or another property type."
                      actionLabel="Clear filters" onAction={() => setParams({}, { replace: true })} />
        ) : (
          <Grid container spacing={3}>
            {results.map((p) => <Grid item xs={12} sm={6} md={4} key={p.id}><PropertyCard property={p} /></Grid>)}
          </Grid>
        )}
      </Container>
    </PageLayout>
  );
}
