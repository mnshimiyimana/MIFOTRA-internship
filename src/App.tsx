import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Impact } from "@/components/sections/Impact";
import { CTA, Footer } from "@/components/layout/Footer";
import { Faq } from "@/components/sections/Faq";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import { ChevronUp } from "lucide-react";
import { Button } from "./components/ui/button";
// import { NotificationBanner } from "./components/sections/NotificationBanner";

export default function App() {
  const reduceMotion = useReducedMotion();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-background selection:bg-primary/10 min-h-screen font-sans selection:text-primary relative">
        {/* <NotificationBanner /> */}

        <Navbar />

        <main>
          <Hero />
          <About />
          <HowItWorks />

          <Faq />

          <Impact />
          <CTA />

          {/* <Testimonials /> */}
        </main>

        <Footer />

        {/* Floating UX Elements */}
        <div className="right-4 bottom-4 md:right-8 md:bottom-8 z-30 fixed flex flex-col gap-4">
          <AnimatePresence>
            {showScrollTop && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Button
                  onClick={scrollToTop}
                  aria-label="Back to top"
                  size="icon"
                  variant="outline"
                  className="rounded-2xl w-14 h-14 border-[#d9e3ef] bg-white text-primary shadow-[0_12px_30px_-12px_rgb(18_41_112/35%)] hover:bg-[#f5f9ff] hover:text-primary transition-colors"
                >
                  <ChevronUp className="w-6 h-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
