import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Typography } from '@mui/material';

import { Loading } from '../components/common/States';
import PageLayout from '../components/layout/PageLayout';
import { useUI } from '../context/UIContext';
import useApi from '../utils/useApi';

export default function FAQ() {
  const { openContact } = useUI();
  const { data: faqs, loading } = useApi('/reviews/faqs/', { initial: [] });
  return (
    <PageLayout title="FAQs">
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Typography variant="overline" color="secondary.dark">Help centre</Typography>
        <Typography variant="h2" component="h1">Frequently asked questions</Typography>
        <Box sx={{ mt: 4 }}>
          {loading ? <Loading /> : faqs.length === 0 ? (
            <Typography color="text.secondary">No FAQs have been added yet.</Typography>
          ) : faqs.map((f, i) => (
            <Accordion key={f.id} defaultExpanded={i === 0} disableGutters elevation={0}
                       sx={{ border: '1px solid rgba(255, 255, 255, 0.08)', bgcolor: '#111622', borderRadius: '14px !important', mb: 1.5, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#F59E0B' }} />} sx={{ px: 3, py: 0.5 }}>
                <Typography fontWeight={600} color="#FFFFFF">{f.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>{f.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box sx={{ mt: 6, p: { xs: 3, md: 5 }, borderRadius: '20px', bgcolor: '#111622', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)', textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#FFFFFF' }}>Still Have Questions?</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Our concierge team usually replies within minutes.</Typography>
          <Button variant="contained" color="secondary" size="large" sx={{ mt: 2.5, px: 4, fontWeight: 700 }} onClick={openContact}>Contact Us</Button>
        </Box>
      </Container>
    </PageLayout>
  );
}
