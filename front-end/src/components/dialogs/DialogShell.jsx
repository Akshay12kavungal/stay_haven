import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogContent, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';

// Consistent dialog chrome: title, optional subtitle, close button, full screen on phones.
export default function DialogShell({ open, onClose, title, subtitle, maxWidth = 'sm', children, aside }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={aside ? 'md' : maxWidth} fullScreen={fullScreen}
            aria-labelledby="dialog-title" scroll="body">
      <Box sx={{ display: 'flex', minHeight: aside ? 520 : undefined }}>
        {aside && (
          <Box sx={{ flex: '0 0 42%', display: { xs: 'none', md: 'block' }, position: 'relative', bgcolor: 'primary.main' }}>
            {aside}
          </Box>
        )}
        <Box sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <IconButton onClick={onClose} aria-label="Close" sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 6, sm: 5 } }}>
            <Typography id="dialog-title" variant="h4" component="h2" sx={{ pr: 4 }}>{title}</Typography>
            {subtitle && <Typography color="text.secondary" sx={{ mt: 1 }}>{subtitle}</Typography>}
            <Box sx={{ mt: 3 }}>{children}</Box>
          </DialogContent>
        </Box>
      </Box>
    </Dialog>
  );
}
