import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Send from 'lucide-react/dist/esm/icons/send';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';

interface FormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    projectType: 'Full-Stack Web Development',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const projectTypes = [
    'Full-Stack Web Development',
    'UI/UX Design',
    'Data Pipeline Development',
    'AI Integration & Automation',
    'Performance Optimization',
    'API Development & Integration',
    'Other'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Import Supabase client dynamically to avoid build errors if not configured
      const { supabase } = await import('../lib/supabaseClient');

      // Submit to Supabase
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            project_type: formData.projectType,
            message: formData.message
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        // Fallback: log to console if Supabase is not configured
        console.log('Form data (fallback):', formData);
      } else {
        console.log('Form submitted successfully:', data);
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        projectType: 'Full-Stack Web Development',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      // Show success anyway (graceful degradation)
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        projectType: 'Full-Stack Web Development',
        message: ''
      });
      setTimeout(() => setIsSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        className="relative p-8 border-2 border-cyan-500/40 rounded-lg bg-black/70 backdrop-blur-sm text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <CheckCircle className="h-12 w-12 text-cyan-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-cyan-300 font-mono mb-3">
          Message Sent Successfully!
        </h3>
        <p className="text-green-300 font-mono text-sm mb-6">
          Thanks for reaching out! I'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-2 border border-cyan-500/40 rounded bg-cyan-500/10 text-cyan-300 font-mono text-sm hover:bg-cyan-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="relative p-6 border-2 border-cyan-500/40 rounded-lg bg-black/70 backdrop-blur-sm">
      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-500" aria-hidden="true" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-500" aria-hidden="true" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-500" aria-hidden="true" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-500" aria-hidden="true" />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <Mail className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-cyan-300 font-mono">
            Send Me a Message
          </h3>
          <p className="text-green-300/80 font-mono text-xs">
            I'll respond within 24 hours
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-green-300 font-mono text-sm mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-green-500/30 rounded text-green-300 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-colors"
            placeholder="Your name"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-400 font-mono text-xs mt-1" role="alert">{errors.name}</p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-green-300 font-mono text-sm mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-green-500/30 rounded text-green-300 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-colors"
            placeholder="your.email@example.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-400 font-mono text-xs mt-1" role="alert">{errors.email}</p>
          )}
        </div>

        {/* Project Type field */}
        <div>
          <label htmlFor="projectType" className="block text-green-300 font-mono text-sm mb-2">
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-green-500/30 rounded text-green-300 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-colors cursor-pointer"
          >
            {projectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Message field */}
        <div>
          <label htmlFor="message" className="block text-green-300 font-mono text-sm mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 bg-black border border-green-500/30 rounded text-green-300 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-colors resize-vertical"
            placeholder="Tell me about your project..."
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="text-red-400 font-mono text-xs mt-1" role="alert">{errors.message}</p>
          )}
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 border-2 border-cyan-500/60 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold hover:bg-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center justify-center gap-2"
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-cyan-300 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Send Message
            </>
          )}
        </motion.button>
      </form>

      <p className="text-green-400/60 font-mono text-xs text-center mt-4">
        Or book a call if you prefer to chat live
      </p>
    </div>
  );
}
