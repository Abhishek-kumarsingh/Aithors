import { ModernAIHeader } from "@/components/landing/modern-ai-header";
import { ModernAILandingHero } from "@/components/landing/modern-ai-landing-hero";
import { ModernAIHowItWorks } from "@/components/landing/modern-ai-how-it-works";
import { ModernAIFeatures } from "@/components/landing/modern-ai-features";
import { ModernAITryDemo } from "@/components/landing/modern-ai-try-demo";
import { ModernAITestimonials } from "@/components/landing/modern-ai-testimonials";
import { ModernAIRoadmapPreview } from "@/components/landing/modern-ai-roadmap-preview";
import { ModernAIFAQ } from "@/components/landing/modern-ai-faq";
import { ModernAIFooter } from "@/components/landing/modern-ai-footer";

export default function Home() {
  return (
    <>
      <ModernAIHeader />

      {/* Full-width Hero Section */}
      <ModernAILandingHero />

      {/* Rest of the content with background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
        <main>
          <ModernAIHowItWorks />
          <ModernAIFeatures />
          <ModernAITryDemo />
          <ModernAITestimonials />
          <ModernAIRoadmapPreview />
          <ModernAIFAQ />
        </main>

        <ModernAIFooter />
      </div>
    </>
  );
}
