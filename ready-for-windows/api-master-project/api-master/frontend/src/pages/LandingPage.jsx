import { Link } from 'react-router-dom';
import {
  KeyIcon,
  ShieldCheckIcon,
  BoltIcon,
  ChartBarIcon,
  UsersIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const features = [
    {
      icon: KeyIcon,
      title: 'Proxy API Keys',
      description:
        'Generate secure proxy keys for your APIs. Keep your original API keys safe and easily rotate them without updating your applications.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Military-Grade Encryption',
      description:
        'All API keys are encrypted using AES-256-GCM encryption. Your sensitive data is protected with industry-leading security standards.',
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description:
        'Manage up to 20 APIs simultaneously with sub-millisecond response times. Built for performance and scalability.',
    },
    {
      icon: ChartBarIcon,
      title: 'Real-time Analytics',
      description:
        'Monitor API usage, track requests, and get detailed analytics. Make data-driven decisions with comprehensive insights.',
    },
    {
      icon: UsersIcon,
      title: 'Team Collaboration',
      description:
        'Enterprise and Ultimate plans include team chat, file sharing, and collaborative API management for your entire team.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Multi-Platform',
      description:
        'Available on Windows, macOS, Linux, iOS, Android, and as a web application. Work from anywhere, on any device.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Individual',
      description: 'Perfect for independent developers',
      price: {
        daily: 4.99,
        weekly: 9.99,
        monthly: 19.99,
        yearly: 179.99,
      },
      features: [
        'Manage up to 20 APIs',
        'Unlimited proxy keys',
        'Test/Production switching',
        'AES-256 encryption',
        'Basic analytics',
        'Email support',
      ],
      highlighted: false,
    },
    {
      name: 'Ultimate',
      description: 'For small teams and startups',
      price: {
        monthly: 99.99,
        yearly: 999.99,
      },
      features: [
        'Manage up to 50 APIs',
        'Up to 5 team members',
        'Team chat & file sharing',
        'Advanced analytics',
        'API whitelisting',
        'Priority email support',
        'All Individual features',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'For larger development teams',
      price: {
        monthly: 299.99,
        yearly: 2999.99,
      },
      features: [
        'Manage up to 100 APIs',
        'Up to 10 team members',
        'Team collaboration tools',
        'Custom branding',
        'Dedicated support',
        'SLA guarantee',
        'All Ultimate features',
      ],
      highlighted: false,
    },
  ];

  const benefits = [
    '⏱️ Save 10+ hours per week on API management',
    '🔒 Eliminate security vulnerabilities from exposed API keys',
    '🔄 Switch APIs without code changes',
    '📊 Gain visibility into API usage patterns',
    '👥 Improve team collaboration and productivity',
    '🚀 Deploy faster with simplified API integration',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <KeyIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">API Master</span>
              <span className="px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-700 rounded-full">
                ALPHA
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full mb-6">
              <SparklesIcon className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                Revolutionary API Management Tool
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Manage APIs Like
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-500">
                Never Before
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              The most innovative API implementation and management tool of 2025.
              Secure, fast, and incredibly easy to use.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="btn btn-primary bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-4"
              >
                <RocketLaunchIcon className="w-6 h-6 mr-2 inline" />
                Start Free Trial
              </Link>
              <a
                href="#features"
                className="btn bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 border-2 border-white/30 text-lg px-8 py-4"
              >
                Learn More
              </a>
            </div>
            <p className="text-white/70 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Developers Love API Master
            </h2>
            <p className="text-xl text-gray-600">
              Transform the way you work with APIs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card card-hover"
              >
                <p className="text-lg font-medium text-gray-800">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your APIs effectively
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card card-hover text-center"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card ${
                  plan.highlighted
                    ? 'ring-2 ring-primary-600 shadow-xl relative'
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      €{plan.price.monthly}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  {plan.price.yearly && (
                    <p className="text-sm text-gray-500 mt-1">
                      or €{plan.price.yearly}/year (save €
                      {(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)})
                    </p>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`btn w-full ${
                    plan.highlighted ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your API Workflow?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of developers who have already revolutionized their API
            management
          </p>
          <Link
            to="/register"
            className="btn bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-4"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                  <KeyIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">API Master</span>
              </div>
              <p className="text-gray-400 mb-4">
                The revolutionary API management tool that saves you time, enhances
                security, and boosts productivity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 API Master. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
