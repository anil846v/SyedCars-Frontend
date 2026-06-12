import Hero from '../components/home/Hero';
import FeaturedCars from '../components/home/FeaturedCars';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CTASection from '../components/home/CTASection';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';

export default function Home() {
  return (
    <div className="page-enter">
      <Hero />
      <FeaturedCars />
      <WhyChooseUs />
      <CTASection />
      <Testimonials />
      <FAQ />
    </div>
  );
}