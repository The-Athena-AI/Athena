import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import AthenaChat from '../HomePageImages/AthenaChat.png';
import FeedbackImage from '../HomePageImages/Feedback.png';
import ResponseAndGrading from '../HomePageImages/ResponseAndGrading.png';
import Rubric from '../HomePageImages/Rubric.png';
import TeacherDashboard from '../HomePageImages/TeacherDashboard.png';
import { Link } from "react-router-dom";
import AthenaImage from '../images/PerfectAthenaPhotoUpdated2.png';
import SignupComponent from "../components/SignupComponent";

const Home = () => {
  const [showSignup, setShowSignup] = useState(false);
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const imageParallax = useTransform(scrollY, [0, 500], [0, -100]);

  // Story section animations
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const stories = [
    {
      title: "Empowering Teachers",
      description: "From hours of grading to minutes of insight. Athena transforms the way teachers evaluate and guide their students.",
      stat: "Save 15+ hours weekly",
      icon: "⏱️"
    },
    {
      title: "Engaging Students",
      description: "Personalized feedback that speaks to each student's unique journey, helping them understand and grow.",
      stat: "90% improvement in student engagement",
      icon: "📈"
    },
    {
      title: "Building Future Leaders",
      description: "Through AI-powered insights and adaptive learning paths, we're helping shape the next generation of innovators.",
      stat: "85% better learning outcomes",
      icon: "🎓"
    }
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          style={{ y: imageParallax }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={AthenaImage}
            alt="Athena Background" 
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent"
          >
            Transform Your Teaching
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Empower your classroom with AI-driven insights, automated grading, and personalized learning paths.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={() => setShowSignup(true)}
            className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-yellow-400 rounded-full flex justify-center"
          >
            <motion.div 
              className="w-1 h-2 bg-yellow-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 relative">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-bold text-center mb-16 text-yellow-400"
          >
            Why Choose Athena?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="AI Grading"
              description="Save hours with intelligent automated grading that provides detailed feedback."
              image={ResponseAndGrading}
              delay={0.4}
            />
            <FeatureCard 
              title="Smart Feedback"
              description="Generate personalized feedback that helps students improve."
              image={FeedbackImage}
              delay={0.5}
            />
            <FeatureCard 
              title="Interactive Rubrics"
              description="Create and manage detailed rubrics with ease."
              image={Rubric}
              delay={0.4}
            />
          </div>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-black via-yellow-900/10 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16 text-yellow-400"
          >
            The Journey to Success
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: index * 0.2 }}
                  className="text-4xl mb-6"
                >
                  {story.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">{story.title}</h3>
                <p className="text-gray-300 mb-6">{story.description}</p>
                <div className="text-yellow-400 font-bold text-lg">{story.stat}</div>
              </motion.div>
            ))}
          </div>

          {/* Success Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 text-center"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-4xl font-bold text-yellow-400 mb-2"
                >
                  500+
                </motion.div>
                <p className="text-gray-300">Schools Using Athena</p>
              </div>
              <div className="p-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="text-4xl font-bold text-yellow-400 mb-2"
                >
                  1M+
                </motion.div>
                <p className="text-gray-300">Assignments Graded</p>
              </div>
              <div className="p-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  className="text-4xl font-bold text-yellow-400 mb-2"
                >
                  98%
                </motion.div>
                <p className="text-gray-300">Teacher Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-yellow-400 mb-12">What Educators Are Saying</h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-yellow-400/20"
            >
              <p className="text-xl text-gray-300 italic mb-6">
                "Athena has revolutionized how I teach. The AI grading is incredibly accurate, and the personalized feedback helps my students understand exactly where they need to improve. It's like having a teaching assistant that works 24/7."
              </p>
              <div className="text-yellow-400 font-semibold">Dr. Sarah Mitchell</div>
              <div className="text-gray-400">High School English Teacher</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-b from-black to-yellow-900/10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold mb-6 text-yellow-400"
              >
                Experience the Future of Education
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-300 mb-8 text-lg"
              >
                Our intuitive dashboard puts everything you need at your fingertips. Grade assignments, track progress, and communicate with students - all in one place.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link to="/features" className="inline-block border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105">
                  Learn More
                </Link>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <img src={TeacherDashboard} alt="Athena Dashboard" className="rounded-lg shadow-2xl hover:shadow-yellow-400/20 transition-shadow duration-300" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <FooterSection 
              title="Product" 
              links={[
                { text: "Features", to: "/features" },
                { text: "Pricing", to: "/pricing" },
                { text: "Resources", to: "/resources" }
              ]}
            />
            <FooterSection 
              title="Company" 
              links={[
                { text: "About", to: "/about" },
                { text: "Contact", to: "/contact" },
                { text: "Careers", to: "/careers" }
              ]}
            />
            <FooterSection 
              title="Legal" 
              links={[
                { text: "Privacy", to: "/privacy" },
                { text: "Terms", to: "/terms" }
              ]}
            />
            <FooterSection 
              title="Connect" 
              links={[
                { text: "Twitter", href: "#" },
                { text: "LinkedIn", href: "#" },
                { text: "Facebook", href: "#" }
              ]}
            />
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2024 Athena. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Signup Modal */}
      {showSignup && <SignupComponent onClose={() => setShowSignup(false)} />}
    </div>
  );
};

const FeatureCard = ({ title, description, image, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-gray-900 rounded-lg p-6 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300"
  >
    <div className="h-48 mb-4 overflow-hidden rounded-lg">
      <motion.img 
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        src={image} 
        alt={title} 
        className="w-full h-full object-cover"
      />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-yellow-400">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

const FooterSection = ({ title, links }) => (
  <div>
    <h3 className="text-yellow-400 font-semibold mb-4">{title}</h3>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          {link.to ? (
            <Link to={link.to} className="hover:text-yellow-400 transition-colors">
              {link.text}
            </Link>
          ) : (
            <a href={link.href} className="hover:text-yellow-400 transition-colors">
              {link.text}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Home;