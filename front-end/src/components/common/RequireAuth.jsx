import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Container } from '@mui/material';

import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { EmptyState, Loading } from './States';

// Renders children for logged-in users; otherwise a prompt that opens the login dialog.
export default function RequireAuth({ children, message = 'Log in to continue.' }) {
  const { isAuthenticated, loading } = useAuth();
  const { openAuth } = useUI();
  if (loading) return <Loading minHeight="50vh" />;
  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <EmptyState icon={LockOutlinedIcon} title="Please log in" message={message} actionLabel="Log in"
                    onAction={() => openAuth('login')} />
      </Container>
    );
  }
  return children;
}
