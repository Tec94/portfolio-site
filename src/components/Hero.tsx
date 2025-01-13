import React from 'react';
import { Github, Mail, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl font-bold mb-6">Jack Cao</h1>
        <h2 className="text-2xl text-gray-600 mb-8">Computer Science Graduate</h2>
        <div className="flex items-center justify-center space-x-6 text-gray-600 mb-12">
          <span className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Dallas, TX
          </span>
          <a href="mailto:jack.cao@utdallas.edu" className="flex items-center hover:text-blue-600">
            <Mail className="h-4 w-4 mr-2" />
            jack.cao@utdallas.edu
          </a>
          <a href="https://github.com" className="flex items-center hover:text-blue-600">
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </a>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Full-stack developer with experience in web development, computer vision, and data analysis.
          Passionate about building scalable solutions and solving complex problems.
        </p>
      </div>
    </section>
  );
}