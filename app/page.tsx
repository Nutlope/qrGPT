import CTA from '@/components/CTA';
import GradientWrapper from '@/components/GradientWrapper';
import Hero from '@/components/Hero';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <GradientWrapper>
        <Testimonials />
      </GradientWrapper>
      <CTA />
    </>
  );
}
