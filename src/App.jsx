import { Navbar } from './components/Navbar.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { ProblemSection } from './components/ProblemSection.jsx';
import { FeaturesSection } from './components/FeaturesSection.jsx';
import { ScreenshotsSection } from './components/ScreenshotsSection.jsx';
import { FounderStory } from './components/FounderStory.jsx';
import { CompareSection } from './components/CompareSection.jsx';
import { PricingSection } from './components/PricingSection.jsx';
import { HelpSection } from './components/HelpSection.jsx';
import { FAQSection } from './components/FAQSection.jsx';
import { FeedbackSection } from './components/FeedbackSection.jsx';
import { Footer } from './components/Footer.jsx';
import { FloatingCTA } from './components/FloatingCTA.jsx';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-milo-blue"
      >
        Skip to main content
      </a>
      <Navbar />
      <HeroSection />
      <main id="main-content" className="relative z-10">
        <ProblemSection />
        <FeaturesSection />
        <ScreenshotsSection />
        <FounderStory />
        <CompareSection />
        <PricingSection />
        <HelpSection />
        <FAQSection />
        <FeedbackSection />
      </main>
      <Footer />

      <FloatingCTA />
    </div>
  );
}

export default App;
