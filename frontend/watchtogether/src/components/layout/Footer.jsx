import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#101114] text-gray-400 py-12 px-6">
      <div className="container mx-auto">
        {/* Informational Box */}
        <div className="bg-[#1e2025] p-6 rounded-lg mb-10 text-center text-gray-300">
          <p>
            With Watch2Gether you can easily host a watch party and watch YouTube videos with friends. Other services such as Vimeo, Netflix, Amazon, Disney & Co are also supported. Create a room, share the link and you're ready to go. All videos run synchronously and you can talk to each other using the built-in chat. Have fun with Watch2Gether!
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="space-y-2 text-center md:text-left mb-6 md:mb-0">
                <a href="#" className="block hover:text-white transition-colors">Product documentation</a>
                <a href="#" className="block hover:text-white transition-colors">Contact</a>
                <a href="#" className="block hover:text-white transition-colors">Site notice / Impressum</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy settings</a>
                <a href="#" className="block hover:text-white transition-colors">Data Privacy Policy</a>
            </div>
            <div className="text-center md:text-right">
                <p>&copy; 2024 Watch Together. All rights reserved.</p>
                <p className="text-sm">A project for learning purposes.</p>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
