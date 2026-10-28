import { Box, Stack, Typography } from '@mui/material';

export default function SectionHeader({ eyebrow, title, subtitle, action, align = 'left', sx }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: { xs: 3.5, md: 5.5 }, textAlign: align, ...sx }}
    >
      <Box sx={{ maxWidth: 680, mx: align === 'center' ? 'auto' : 0 }}>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{
              color: '#F59E0B',
              fontWeight: 800,
              letterSpacing: '0.14em',
              display: 'inline-block',
              mb: 0.5,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.85rem', sm: '2.3rem', md: '2.8rem' },
            lineHeight: 1.15,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              mt: 1.5,
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: '#94A3B8',
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
  );
}
