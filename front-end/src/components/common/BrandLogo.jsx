import { Box, Typography } from '@mui/material';

export default function BrandLogo({ light = true, size = 'md', sx = {} }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const iconSize = isSm ? 28 : isLg ? 42 : 36;
  const fontSize = isSm ? '1.15rem' : isLg ? '1.65rem' : { xs: '1.25rem', md: '1.45rem' };

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', userSelect: 'none', ...sx }}>
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #161B29 0%, #0A0D15 100%)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F59E0B',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6), 0 0 12px rgba(245, 158, 11, 0.25)',
          flexShrink: 0,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            transform: 'scale(1.06)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.8), 0 0 18px rgba(245, 158, 11, 0.4)',
          },
        }}
      >
        <svg
          width={iconSize - 14}
          height={iconSize - 14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Box>
      <Typography
        component="span"
        sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 700,
          fontSize,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          lineHeight: 1,
        }}
      >
        Stay<Box component="span" sx={{ color: '#F59E0B', ml: 0.2 }}>Haven</Box>
      </Typography>
    </Box>
  );
}
