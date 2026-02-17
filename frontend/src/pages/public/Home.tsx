import { motion } from 'framer-motion';
import { ArrowRight, Clock, Globe, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-primary-900/20 z-10" />
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Logistics Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:w-2/3 mt-12 sm:mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                Next-Gen <span className="text-primary-400">Logistics</span> &<br />
                Transport Solutions
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                Streamline your supply chain with our advanced Transport ERP system.
                Real-time tracking, automated invoicing, and insightful analytics to keep your business moving forward.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 md:text-lg transition-all shadow-lg hover:shadow-primary-500/30"
                >
                  Get Started <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-3 border border-slate-600 text-base font-medium rounded-full text-slate-200 hover:bg-slate-800 md:text-lg transition-all"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Stats/Decorations */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block absolute top-1/3 right-0 w-1/3 h-full bg-gradient-to-l from-primary-600/10 to-transparent pointer-events-none"
        />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">Why Choose Us</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Redefining Logistics Management</h3>
            <p className="text-slate-500 max-w-2xl mx-auto">
              We provide end-to-end solutions that help you manage your fleet, track shipments, and optimize costs efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: 'Global Reach',
                desc: 'Seamlessly manage shipments across borders with our integrated tracking systems.'
              },
              {
                icon: Clock,
                title: 'Real-Time Tracking',
                desc: 'Get instant updates on your cargo status and vehicle locations 24/7.'
              },
              {
                icon: ShieldCheck,
                title: 'Secure & Reliable',
                desc: 'Enterprise-grade security ensuring your data and goods are always protected.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary-900/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-900/30 blur-3xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Optimize Your Transport Business?</h2>
          <p className="text-slate-300 text-lg mb-10">
            Join thousands of logistics companies that trust Transport ERP for their daily operations.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-slate-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
