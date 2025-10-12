import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getServiceBySlug } from '../data/servicesData';
import PricingTable from '../components/PricingTable';
import BookingWidget from '../components/BookingWidget';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Scanlines from '../components/Scanlines';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Check from 'lucide-react/dist/esm/icons/check';
import TerminalTyping from '../components/TerminalTyping';
import BlurReveal from '../components/BlurReveal';
import AOS from 'aos';

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const service = slug ? getServiceBySlug(slug) : undefined;

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 120,
      delay: 50,
      easing: 'ease-out-cubic',
    });

    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (showBooking && selectedPlan) {
      // Scroll to booking section
      setTimeout(() => {
        const bookingElement = document.getElementById('booking');
        if (bookingElement) {
          bookingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [showBooking, selectedPlan]);

  if (!service) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-green-300 font-mono mb-4">Service not found</h1>
          <Link
            to="/"
            className="text-green-400 font-mono hover:text-green-300 transition-colors"
          >
            {'< '}Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setShowBooking(true);
  };

  const ServiceIcon = service.icon;

  return (
    <div className="min-h-screen bg-black">
      <Scanlines />
      <Navbar />

      <div className="pt-24 pb-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-green-400 font-mono text-sm hover:text-green-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </button>
          </motion.div>

          {/* Service header */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center justify-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ServiceIcon className="h-12 w-12 text-green-400" style={{
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.5))'
              }} />
            </motion.div>

            <TerminalTyping text={service.title} className="mb-6" />

            <BlurReveal delay={0.2}>
              <p className="text-lg text-green-300 font-mono max-w-3xl mx-auto leading-relaxed">
                <span className="text-green-500">{'> '}</span>
                {service.fullDescription}
              </p>
            </BlurReveal>
          </div>

          {/* Key features */}
          <BlurReveal delay={0.3}>
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-green-300 font-mono mb-6 text-center"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                }}
              >
                What's Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Benefits */}
                <div className="p-6 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
                  }}
                >
                  <h3 className="text-lg font-bold text-green-400 font-mono mb-4">Benefits</h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-green-300/90 font-mono text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables */}
                <div className="p-6 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
                  }}
                >
                  <h3 className="text-lg font-bold text-green-400 font-mono mb-4">Deliverables</h3>
                  <ul className="space-y-3">
                    {service.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-green-300/90 font-mono text-sm">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </BlurReveal>

          {/* Technologies */}
          <BlurReveal delay={0.4}>
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-green-300 font-mono mb-6 text-center"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                }}
              >
                Technologies & Tools
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {service.technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    className="px-4 py-2 border border-green-500/40 rounded-lg bg-green-500/10 text-green-300 font-mono text-sm"
                    whileHover={{
                      scale: 1.05,
                      borderColor: 'rgba(0, 255, 0, 0.8)',
                      boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)'
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </div>
          </BlurReveal>

          {/* Pricing plans */}
          <BlurReveal delay={0.5}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-green-300 font-mono mb-3 text-center"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                }}
              >
                Pricing Plans
              </h2>
              <p className="text-green-400 font-mono text-sm text-center mb-8">
                Choose the plan that best fits your project needs and budget
              </p>
              <PricingTable plans={service.pricingPlans} onSelectPlan={handleSelectPlan} />
            </div>
          </BlurReveal>

          {/* Booking section */}
          {showBooking && selectedPlan && (
            <BlurReveal delay={0.1}>
              <div id="booking" className="mb-16 scroll-mt-24">
                <BookingWidget selectedPlan={selectedPlan} serviceName={service.title} />
              </div>
            </BlurReveal>
          )}

          {/* CTA section */}
          <BlurReveal delay={0.6}>
            <div className="text-center p-8 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
              }}
            >
              <h3 className="text-2xl font-bold text-green-300 font-mono mb-4"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                }}
              >
                Ready to Get Started?
              </h3>
              <p className="text-green-400 font-mono text-sm mb-6 max-w-2xl mx-auto">
                Have questions or need a custom quote? Let's discuss your project and find the perfect solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => {
                    setShowBooking(true);
                    const bookingElement = document.getElementById('booking');
                    if (bookingElement) {
                      bookingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-8 py-3 border-2 border-green-500/60 rounded-lg bg-green-500/20 text-green-300 font-mono hover:bg-green-500/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  {'> '}Book Consultation
                </motion.button>
                <motion.button
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      const element = document.getElementById('contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                  className="px-8 py-3 border-2 border-green-500/40 rounded-lg bg-black/50 text-green-300 font-mono hover:bg-green-500/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  {'> '}Contact Me
                </motion.button>
              </div>
            </div>
          </BlurReveal>
        </div>
      </div>

      <Footer />
    </div>
  );
}
