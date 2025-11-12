import React from 'react';

interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-2xl transition-all duration-500 hover:scale-[1.03] border-t-4 border-red-600/70 hover:border-red-500">
    <Icon className="w-10 h-10 text-red-500 mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default FeatureCard;
