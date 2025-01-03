import React from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const Features = () => {
  return (
    <div className="text-white">
        <Navbar />
      <Parallax pages={features.length}>
        {features.map((feature, index) => (
          <ParallaxLayer
            key={index}
            offset={index}
            speed={0.5}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: index % 2 === 0 ? '#1a1a1a' : '#121212',
            }}
          >
            <FeatureSection {...feature} />
          </ParallaxLayer>
        ))}
      </Parallax>
    </div>
  );
};

const FeatureSection = ({ title, description, image }) => (
  <div className="flex flex-col md:flex-row items-center justify-around h-screen p-8">
    {/* Left: Text */}
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="w-1/2 p-6 text-center md:text-left"
    >
      <h2 className="text-4xl font-bold mb-4">{title}</h2>
      <p className="text-lg text-zinc-400">{description}</p>
    </motion.div>

    {/* Right: Image */}
    <motion.img
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      src={image}
      alt={title}
      className="w-full md:w-1/2 rounded-lg shadow-lg"
    />
  </div>
);

const features = [
  {
    title: 'AI Grading',
    description: 'Save countless hours with automated grading for assignments, quizzes, and exams.',
    image: 'https://images.unsplash.com/photo-1550610136-e3a935e2708c',
  },
  {
    title: 'Lecture Slides',
    description: 'AI-powered tools to generate captivating lecture slides in seconds.',
    image: 'https://images.unsplash.com/photo-1590642919807-92f03b70e06a',
  },
  {
    title: 'Podcast Creation',
    description: 'Record, edit, and share educational podcasts effortlessly.',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5',
  },
  {
    title: 'Student Analytics',
    description: 'Detailed analytics to track student progress and performance.',
    image: 'https://images.unsplash.com/photo-1562347819-dfcb7c39d885',
  },
];

export default Features;
