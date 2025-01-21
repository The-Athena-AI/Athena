import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SignupComponent from '../components/SignupComponent';

const Pricing = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // or 'annual'

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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Choose the perfect plan for your educational needs
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center space-x-4 mb-12">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-yellow-400' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-16 h-8 bg-gray-700 rounded-full p-1 transition-colors duration-300"
            >
              <motion.div 
                className="w-6 h-6 bg-yellow-400 rounded-full"
                animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'annual' ? 'text-yellow-400' : 'text-gray-400'}`}>
              Annual
            </span>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Basic"
            price={billingCycle === 'monthly' ? 29 : 279}
            description="Perfect for individual teachers"
            features={[
              "AI Grading for up to 100 assignments/month",
              "Basic analytics dashboard",
              "Email support",
              "Up to 3 classes",
              "Standard rubric templates"
            ]}
            delay={0.2}
            onSignup={() => setShowSignup(true)}
          />
          
          <PricingCard
            title="Pro"
            price={billingCycle === 'monthly' ? 49 : 449}
            description="Ideal for active educators"
            features={[
              "AI Grading for up to 500 assignments/month",
              "Advanced analytics and insights",
              "Priority email & chat support",
              "Unlimited classes",
              "Custom rubric creation",
              "Personalized feedback templates"
            ]}
            highlighted={true}
            delay={0.4}
            onSignup={() => setShowSignup(true)}
          />
          
          <PricingCard
            title="Enterprise"
            price={billingCycle === 'monthly' ? 99 : 947}
            description="For schools and institutions"
            features={[
              "Unlimited AI Grading",
              "Complete analytics suite",
              "24/7 dedicated support",
              "School-wide administration",
              "Custom integration options",
              "Advanced API access",
              "Training and onboarding"
            ]}
            delay={0.6}
            onSignup={() => setShowSignup(true)}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-yellow-400"
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="space-y-6">
            <FAQItem 
              question="How does the AI grading system work?"
              answer="Our AI grading system uses advanced machine learning algorithms to analyze student submissions based on your rubric criteria. It provides detailed feedback and suggestions while maintaining consistency across all assignments."
            />
            <FAQItem 
              question="Can I switch plans at any time?"
              answer="Yes, you can upgrade or downgrade your plan at any time. The changes will be reflected in your next billing cycle."
            />
            <FAQItem 
              question="Is there a free trial available?"
              answer="Yes! We offer a 14-day free trial on all our plans. No credit card required to start."
            />
            <FAQItem 
              question="Do you offer discounts for educational institutions?"
              answer="Yes, we offer special pricing for schools and educational institutions. Please contact our sales team for more information."
            />
          </div>
        </div>
      </section>

      {/* Signup Modal */}
      {showSignup && <SignupComponent onClose={() => setShowSignup(false)} />}
    </div>
  );
};

const PricingCard = ({ title, price, description, features, highlighted = false, delay, onSignup }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`rounded-lg p-8 ${
      highlighted 
        ? 'bg-gradient-to-b from-yellow-400/20 to-black border-2 border-yellow-400 transform scale-105' 
        : 'bg-gray-900'
    }`}
  >
    <h3 className="text-2xl font-bold text-yellow-400 mb-2">{title}</h3>
    <p className="text-gray-400 mb-6">{description}</p>
    <div className="mb-6">
      <span className="text-4xl font-bold text-white">${price}</span>
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: delay + (index * 0.1) }}
          className="flex items-center text-gray-300"
        >
          <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {feature}
        </motion.li>
      ))}
    </ul>
    <button
      onClick={onSignup}
      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
        highlighted
          ? 'bg-yellow-400 text-black hover:bg-yellow-300'
          : 'bg-gray-800 text-white hover:bg-gray-700'
      }`}
    >
      Get Started
    </button>
  </motion.div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-b border-gray-800 pb-4"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left py-4"
      >
        <span className="text-lg font-medium text-yellow-400">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="text-gray-400 pt-2 pb-4">{answer}</p>
      </motion.div>
    </motion.div>
  );
};

export default Pricing; 