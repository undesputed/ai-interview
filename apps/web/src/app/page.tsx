import { LandingNav } from '@/features/landing/LandingNav';
import { Hero } from '@/features/landing/Hero';
import { Manifesto } from '@/features/landing/Manifesto';
import { Features } from '@/features/landing/Features';
import { Safeguards } from '@/features/landing/Safeguards';
import { Scenario } from '@/features/landing/Scenario';
import { CallToAction } from '@/features/landing/CallToAction';
import { LandingFooter } from '@/features/landing/LandingFooter';

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <Manifesto />
        <Features />
        <Safeguards />
        <Scenario />
        <CallToAction />
      </main>
      <LandingFooter />
    </>
  );
}
