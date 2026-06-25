import CTASection from "@/components/landing/cta-section";
import FeaturesSection from "@/components/landing/feature-section";
import HeroSection from "@/components/landing/hero-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import { Briefcase } from "lucide-react";

const Home = () => {
  
  return (
    <div style={{ scrollbarWidth: "thin", scrollbarColor: "#2a3d52 #10151c" }}>
      {/* HERO SECTION */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* BG GLOW */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #4a6c8f 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <HeroSection />
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: '#d9a441' }}>Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Everything you need to land your next role
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeaturesSection />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#1e2a38' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: '#4a6c8f' }}>How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Your pipeline in three steps
            </h2>
          </div>

          <HowItWorksSection />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <CTASection />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1e2a38] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4a6c8f, #d9a441)' }}>
              <Briefcase className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">
              Career<span style={{ color: '#d9a441' }}>Path</span>
            </span>
          </div>
          <p className="text-xs text-[#4a5a6a]">© 2026 CareerPath. Built for ambitious professionals.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;