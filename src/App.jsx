import { Navbar } from './components/Navbar.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { ProblemSection } from './components/ProblemSection.jsx';
import { HowItWorksSection } from './components/HowItWorksSection.jsx';
import { FeaturesSection } from './components/FeaturesSection.jsx';
import { ScreenshotsSection } from './components/ScreenshotsSection.jsx';
import { ModelsSection } from './components/ModelsSection.jsx';
import { ComparisonSection } from './components/ComparisonSection.jsx';
import { FounderStory } from './components/FounderStory.jsx';
import { PricingSection } from './components/PricingSection.jsx';
import { FAQSection } from './components/FAQSection.jsx';
import { FeedbackSection } from './components/FeedbackSection.jsx';
import { Footer } from './components/Footer.jsx';
import { FloatingCTA } from './components/FloatingCTA.jsx';

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-ink focus:shadow-xl"
      >
        Skip to main content
      </a>
      <Navbar />
      <HeroSection />
      <main id="main-content" className="relative z-10">
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <ScreenshotsSection />
        <ModelsSection />
        <ComparisonSection />
        <FounderStory />
        <PricingSection />
        <FAQSection />
        <FeedbackSection />
      </main>
      <Footer />

      <FloatingCTA />
    </div>
  );
}

export default App;
