import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gray-900 border-t border-red-700/50 p-8">
    <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400">
      <div>
        <h4 className="text-white font-bold mb-3 uppercase text-sm">Fantasy</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-red-500">How to Play</a></li>
          <li><a href="#" className="hover:text-red-500">Contest Rules</a></li>
          <li><a href="#" className="hover:text-red-500">Prizes</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-3 uppercase text-sm">Leagues</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-red-500">Nepal T20</a></li>
          <li><a href="#" className="hover:text-red-500">Nepal Super League</a></li>
          <li><a href="#" className="hover:text-red-500">International Cricket</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-3 uppercase text-sm">Company</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-red-500">About Us</a></li>
          <li><a href="#" className="hover:text-red-500">Contact</a></li>
          <li><a href="#" className="hover:text-red-500">Careers</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-3 uppercase text-sm">Legal</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-red-500">Terms of Service</a></li>
          <li><a href="#" className="hover:text-red-500">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
    <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} LivescoreNepal Fantasy. All rights reserved.
    </div>
  </footer>
);

export default Footer;
