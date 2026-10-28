import Destinations from '../components/home/Destinations';
import FeaturedProperties from '../components/home/FeaturedProperties';
import GalleryStrip from '../components/home/GalleryStrip';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import ListPropertyBanner from '../components/home/ListPropertyBanner';
import Testimonials from '../components/home/Testimonials';
import WhyUs from '../components/home/WhyUs';
import PageLayout from '../components/layout/PageLayout';
import useApi from '../utils/useApi';

export default function Home() {
  const { data: properties, loading } = useApi('/properties/', { initial: [] });
  return (
    <PageLayout heroUnderNav>
      <Hero properties={properties} />
      <FeaturedProperties properties={properties} loading={loading} />
      <Destinations properties={properties} />
      <HowItWorks />
      <Testimonials properties={properties} />
      <WhyUs />
      <ListPropertyBanner />
      <GalleryStrip />
    </PageLayout>
  );
}
