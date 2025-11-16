import React from 'react';
import { Check } from 'lucide-react';

const FeatureItem = ({ children }) => (
  <li className="flex items-start mb-3">
    <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
    <span>{children}</span>
  </li>
);

const HowToStep = ({ number, text }) => (
    <div className="flex items-center">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white font-bold rounded-full mr-4">
            {number}
        </div>
        <span className="text-lg">{text}</span>
    </div>
);

const TestimonialCard = ({ quote, author }) => (
    <div className="bg-[#1e2025] p-6 rounded-lg h-full flex flex-col justify-between">
        <p className="text-gray-300 mb-4">"{quote}"</p>
        <p className="text-gray-500 text-sm">- {author}</p>
    </div>
);

const About = () => {
  return (
    <section className="bg-[#101114] text-white py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">About Watch2Gether</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Column: Description & Features */}
          <div>
            <p className="text-gray-300 leading-relaxed mb-6">
              With Watch2Gether you can watch YouTube together. Services like Vimeo, Netflix, Amazon, Disney & Co are also supported. Create a room and invite friends to your WatchParty.
            </p>
            <ul>
              <FeatureItem>Synchronized player for video and audio</FeatureItem>
              <FeatureItem>Talk to your friends in the integrated chat room</FeatureItem>
              <FeatureItem>Enjoy content from YouTube, Vimeo, Dailymotion and SoundCloud</FeatureItem>
              <FeatureItem>Organize content into playlists</FeatureItem>
              <FeatureItem>Webcam support</FeatureItem>
            </ul>
          </div>
          
          {/* Right Column: How-To Steps */}
          <div className="bg-[#1e2025] p-8 rounded-lg flex flex-col space-y-6">
            <HowToStep number="1" text="Create a room" />
            <div className="h-px bg-gray-600 w-full"></div>
            <HowToStep number="2" text="Share the link" />
             <div className="h-px bg-gray-600 w-full"></div>
            <HowToStep number="3" text="Watch2Gether" />
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <TestimonialCard quote="I just wanted to say that Watch2Gether is absolutely wonderful, me and my girlfriend are in a long distance relationship and we use it all the time." author="led by Ismail" />
            <TestimonialCard quote="I think teachers would be really interested in this site as it allows students to watch videos and comment on them." author="Lynn by Email" />
            <TestimonialCard quote="My friends and I love Watch2Gether. We don't live near each other any more, but now we get to continue our tradition of watching videos together every day." author="David on facebook" />
            <TestimonialCard quote="The Watch2Gether website is the best thing ever :) it's the first of its kind to help with online RPG games. We mostly use it for background music and sound effects." author="Anton on facebook" />
        </div>

      </div>
    </section>
  );
};

export default About;
