import React from 'react';
import AthenaImage from '../images/PerfectAthenaPhotoUpdated2.png';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Lenis from 'lenis';

const HomeHero = () => {
  // Initialize intersection observer for the features section
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {/* Athena Background Section */}
      <div
        id="athena-section"
        className="text-white bg-cover bg-center h-screen flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${AthenaImage})`,
        }}
      >
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="text-5xl font-bold mb-4"
        >
          Welcome to Athena
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
          className="text-lg mb-12 text-center"
        >
          Transforming Education with AI – Smart, Seamless, and Scalable.
        </motion.p>
      </div>

      {/* Flexbox Features Section */}
      <div
        id="features-section"
        ref={ref} // Attach the observer reference
        className="bg-zinc-900 text-white py-12 flex flex-col items-center"
      >
        <h2 className="text-4xl font-bold mb-8">Our Features</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}} // Trigger animation on view
              transition={{
                delay: index * 0.2,
                duration: 0.5,
                ease: 'easeInOut',
              }}
              className="flex flex-col items-center bg-zinc-800 rounded-lg shadow-lg p-6 w-64"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
              <p className="text-sm text-zinc-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

const features = [
  {
    title: 'AI Grading',
    description: 'Automated and efficient grading for assignments.',
    icon: '🧠',
  },
  {
    title: 'Lecture Slides',
    description: 'Create engaging slides in seconds.',
    icon: '📊',
  },
  {
    title: 'Podcast Creation',
    description: 'Easily create educational podcasts.',
    icon: '🎙️',
  },
  {
    title: 'Student Analytics',
    description: 'Detailed insights into student performance.',
    icon: '📈',
  },
];

export default HomeHero;
