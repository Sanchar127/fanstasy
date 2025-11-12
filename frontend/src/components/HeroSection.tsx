import React from 'react';
import { ChevronRight } from 'lucide-react';

const HeroSection: React.FC = () => (
  <section
    className="relative h-[60vh] md:h-[70vh] flex items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url(https://placehold.co/1920x800/222/FFF?text=NEPAL+CRICKET+STADIUM+FANTASY)' }}
  >
    <div className="text-center p-6 max-w-4xl">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 animate-fadeInDown">
        Draft Your <span className="text-red-500">Nepali Dream Team</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light animate-fadeInUp delay-200">
        Play fantasy leagues for Nepali Cricket, Football, and Global tournaments. Real-time scores, real-time strategy.
      </p>
      <a
        href="#"
        className="inline-flex items-center bg-yellow-400 text-gray-900 font-extrabold py-3 px-8 rounded-full text-lg shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-yellow-500/50 group"
      >
        Join the Game Now
        <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  </section>
);

export default HeroSection;
