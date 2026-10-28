import BathtubIcon from '@mui/icons-material/BathtubOutlined';
import BedIcon from '@mui/icons-material/BedOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Box, Card, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { formatINR } from '../../utils/format';
import useSaved from '../../utils/useSaved';

const Spec = ({ icon: Icon, children }) => (
  <Stack
    direction="row"
    spacing={0.5}
    alignItems="center"
    sx={{
      bgcolor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.07)',
      px: 1.2,
      py: 0.4,
      borderRadius: '8px',
      fontSize: '0.8rem',
      fontWeight: 500,
    }}
  >
    <Icon sx={{ fontSize: 16, color: '#F59E0B' }} />
    <Typography variant="caption" sx={{ fontWeight: 600, color: '#94A3B8' }}>
      {children}
    </Typography>
  </Stack>
);

export function RatingBadge({ rating, count, light = false }) {
  if (!count) {
    return (
      <Chip
        label="New"
        size="small"
        sx={{
          bgcolor: 'rgba(245, 158, 11, 0.15)',
          color: '#FBBF24',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          fontWeight: 700,
          fontSize: '0.75rem',
          height: 22,
        }}
      />
    );
  }
  return (
    <Stack direction="row" spacing={0.3} alignItems="center">
      <StarRoundedIcon sx={{ fontSize: 19, color: '#F59E0B' }} />
      <Typography variant="body2" fontWeight={700} sx={{ color: '#FFFFFF' }}>
        {rating.toFixed(1)}
      </Typography>
      <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
        ({count})
      </Typography>
    </Stack>
  );
}

export default function PropertyCard({ property, sx }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(property.id);

  return (
    <Card
      sx={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '18px',
        bgcolor: '#111622',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.9), 0 0 25px -5px rgba(245, 158, 11, 0.2)',
          borderColor: 'rgba(245, 158, 11, 0.4)',
          '& .property-title': { color: '#FBBF24' },
          '& .media img': { transform: 'scale(1.06)' },
        },
        ...sx,
      }}
    >
      <Box
        component={RouterLink}
        to={`/single/${property.id}`}
        sx={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'inherit', textDecoration: 'none' }}
      >
        <Box
          className="media"
          sx={{
            position: 'relative',
            aspectRatio: '16 / 11',
            overflow: 'hidden',
            bgcolor: '#161B29',
          }}
        >
          <Box
            component="img"
            src={property.image}
            alt={property.name}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(8,11,17,0.3) 0%, transparent 40%, transparent 55%, rgba(8,11,17,0.85) 100%)',
            }}
          />
          <Chip
            label={property.property_type}
            size="small"
            sx={{
              position: 'absolute',
              top: 14,
              left: 14,
              bgcolor: 'rgba(8, 11, 17, 0.82)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontWeight: 700,
              color: '#F8FAFC',
              fontSize: '0.75rem',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 14,
              bottom: 12,
              display: 'flex',
              alignItems: 'baseline',
              gap: 0.5,
              color: '#fff',
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 800,
                fontSize: '1.3rem',
                color: '#F59E0B',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              {formatINR(property.price)}
            </Typography>
            <Typography component="span" sx={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 500 }}>
              / night
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2.25, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Typography
              className="property-title"
              variant="h6"
              component="h3"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                lineHeight: 1.3,
                color: '#FFFFFF',
                transition: 'color 0.25s ease',
              }}
            >
              {property.name}
            </Typography>
            <Box sx={{ pt: 0.2, flexShrink: 0 }}>
              <RatingBadge rating={property.rating} count={property.review_count} />
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.6} alignItems="center" sx={{ color: '#94A3B8', mt: 0.75 }}>
            <PlaceIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
              {property.address}
            </Typography>
          </Stack>

          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Spec icon={PeopleIcon}>{property.guests} guests</Spec>
              <Spec icon={BedIcon}>{property.bedrooms} bed</Spec>
              <Spec icon={BathtubIcon}>{property.bathrooms} bath</Spec>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Tooltip title={saved ? 'Remove from saved' : 'Save this stay'}>
        <IconButton
          onClick={() => toggle(property.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${property.name} from saved` : `Save ${property.name}`}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: saved ? '#EF4444' : '#FFFFFF',
            bgcolor: 'rgba(8, 11, 17, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(6px)',
            width: 36,
            height: 36,
            '&:hover': {
              bgcolor: 'rgba(8, 11, 17, 0.9)',
              borderColor: 'rgba(245, 158, 11, 0.4)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {saved ? <FavoriteIcon sx={{ fontSize: 20 }} /> : <FavoriteBorderIcon sx={{ fontSize: 20 }} />}
        </IconButton>
      </Tooltip>
    </Card>
  );
}
