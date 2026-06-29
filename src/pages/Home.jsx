import Hero from '../components/home/Hero';
import FeaturedCars from '../components/home/FeaturedCars';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CTASection from '../components/home/CTASection';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import SEO from '../components/SEO'


export default function Home() {
  return (
    <div className="page-enter">
       <SEO
        title="Syed Cars | Best Pre-Owned Cars in Madanapalle"
        description="Syed Cars — Buy and sell premium pre-owned cars with confidence. Every vehicle is inspected, verified, and quality assured. Find your perfect car today."
        keywords="buy used cars Madanapalle, premium pre-owned cars, certified used cars, best used car dealer, quality assured vehicles, Syed Cars"
        url="https://syedcars.com/"
      />
      <Hero />
      <FeaturedCars />
      <WhyChooseUs />
      <CTASection />
      <Testimonials />
      <FAQ />
    </div>
  );
}