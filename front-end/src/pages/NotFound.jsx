import ExploreOffOutlinedIcon from '@mui/icons-material/ExploreOffOutlined';
import { Link as RouterLink } from 'react-router-dom';

import { EmptyState } from '../components/common/States';
import PageLayout from '../components/layout/PageLayout';

export default function NotFound() {
  return (
    <PageLayout title="Page not found">
      <EmptyState icon={ExploreOffOutlinedIcon} title="This page took a holiday"
                  message="The page you're looking for doesn't exist or has moved."
                  actionLabel="Back to home" actionProps={{ component: RouterLink, to: '/' }} />
    </PageLayout>
  );
}
