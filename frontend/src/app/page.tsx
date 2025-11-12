import React from 'react';
import { Zap, Users, BarChart } from 'lucide-react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import UpcomingContestsSection from '../components/UpcomingContestsSection';
import Footer from '../components/Footer';

const App: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Live Score Integration',
      description: 'Your points update in real-time as the match progresses, powered by our lightning-fast livescore engine.',
    },
    {
      icon: Users,
      title: 'Private & Public Contests',
      description: 'Challenge your friends in private leagues or compete against the best players across Nepal for massive prizes.',
    },
    {
      icon: BarChart,
      title: 'Advanced Player Stats',
      description: 'Dive deep into historical performance data, pitch reports, and team news before picking your squad.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-white">
      <Header />
      <main>
        <HeroSection />

        <section id="features" className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
              Why Play <span className="text-red-500">LivescoreNepal Fantasy</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <UpcomingContestsSection />

        <section className="bg-red-600 py-12">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <h3 className="text-3xl font-extrabold text-white mb-4 md:mb-0">
              Ready to Win Big?
            </h3>
            <a
              href="#"
              className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-700 transform hover:scale-105"
            >
              Start Drafting Your Team Today
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
