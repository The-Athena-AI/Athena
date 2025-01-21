import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AthenaChat from '../HomePageImages/AthenaChat.png';
import FeedbackImage from '../HomePageImages/Feedback.png';
import ResponseAndGrading from '../HomePageImages/ResponseAndGrading.png';

const Resources = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Educational Resources
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover guides, tutorials, and best practices to enhance your teaching experience
          </p>
        </motion.div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-yellow-400"
          >
            Featured Resources
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ResourceCard
              title="Getting Started with AI Grading"
              description="Learn how to use Athena's AI grading system effectively"
              image={ResponseAndGrading}
              category="Tutorial"
              readTime="10 min read"
              delay={0.2}
            />
            <ResourceCard
              title="Creating Effective Rubrics"
              description="Best practices for designing comprehensive grading rubrics"
              image={FeedbackImage}
              category="Guide"
              readTime="15 min read"
              delay={0.4}
            />
            <ResourceCard
              title="Maximizing Student Engagement"
              description="Strategies to increase student participation and learning outcomes"
              image={AthenaChat}
              category="Best Practices"
              readTime="12 min read"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-yellow-400"
          >
            Browse by Category
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard
              title="Getting Started"
              count={12}
              icon="🚀"
              delay={0.2}
            />
            <CategoryCard
              title="Tutorials"
              count={24}
              icon="📚"
              delay={0.3}
            />
            <CategoryCard
              title="Best Practices"
              count={18}
              icon="⭐"
              delay={0.4}
            />
            <CategoryCard
              title="Case Studies"
              count={8}
              icon="📊"
              delay={0.5}
            />
            <CategoryCard
              title="Integration Guides"
              count={15}
              icon="🔧"
              delay={0.6}
            />
            <CategoryCard
              title="Updates & News"
              count={20}
              icon="📰"
              delay={0.7}
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-yellow-400/20 to-black border border-yellow-400/50 rounded-lg p-8"
          >
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for the latest educational resources and updates
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-black border border-yellow-400/50 text-white focus:outline-none focus:border-yellow-400"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const ResourceCard = ({ title, description, image, category, readTime, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5 }}
    className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300"
  >
    <div className="h-48 overflow-hidden">
      <motion.img
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-yellow-400 text-sm">{category}</span>
        <span className="text-gray-400 text-sm">{readTime}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <button className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors">
        Read More →
      </button>
    </div>
  </motion.div>
);

const CategoryCard = ({ title, count, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5 }}
    className="bg-black border border-gray-800 rounded-lg p-6 hover:border-yellow-400/50 transition-all duration-300"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{count} resources</p>
  </motion.div>
);

export default Resources; 