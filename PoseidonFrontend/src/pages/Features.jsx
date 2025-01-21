import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AthenaChat from '../HomePageImages/AthenaChat.png';
import FeedbackImage from '../HomePageImages/Feedback.png';
import ResponseAndGrading from '../HomePageImages/ResponseAndGrading.png';
import Rubric from '../HomePageImages/Rubric.png';
import TeacherDashboard from '../HomePageImages/TeacherDashboard.png';

const Features = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4 text-center"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Powerful Features for Modern Education
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover how Athena's innovative features can transform your teaching experience
          </p>
        </motion.div>
      </section>

      {/* Features Sections */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FeatureSection
            title="AI-Powered Grading"
            description="Save countless hours with our intelligent grading system. Athena analyzes student submissions using advanced AI algorithms to provide detailed feedback and suggestions."
            image={ResponseAndGrading}
            imagePosition="right"
          />
          
          <FeatureSection
            title="Smart Feedback Generation"
            description="Generate personalized, constructive feedback for each student automatically. Our AI understands context and provides specific suggestions for improvement."
            image={FeedbackImage}
            imagePosition="left"
          />
          
          <FeatureSection
            title="Interactive Rubrics"
            description="Create and manage comprehensive rubrics with ease. Our intuitive interface helps you define clear criteria and grade consistently across assignments."
            image={Rubric}
            imagePosition="right"
          />
          
          <FeatureSection
            title="Intelligent Chat Support"
            description="Get instant answers to your questions with Athena's AI chat assistant. Access teaching resources, grading guidelines, and best practices at your fingertips."
            image={AthenaChat}
            imagePosition="left"
          />
          
          <FeatureSection
            title="Comprehensive Dashboard"
            description="Monitor student progress, manage assignments, and track performance all in one place. Our dashboard provides valuable insights to help you make informed decisions."
            image={TeacherDashboard}
            imagePosition="right"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-yellow-900/10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <h2 className="text-4xl font-bold mb-6 text-yellow-400">Ready to Transform Your Teaching?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of educators who are already using Athena to enhance their teaching experience.
          </p>
          <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
            Get Started Now
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Athena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureSection = ({ title, description, image, imagePosition }) => {
  const contentOrder = imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2';
  const imageOrder = imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col lg:flex-row items-center gap-12 py-20"
    >
      <div className={`lg:w-1/2 ${contentOrder}`}>
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">{title}</h2>
        <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
      </div>
      <div className={`lg:w-1/2 ${imageOrder}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img src={image} alt={title} className="rounded-lg shadow-2xl" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Features;
