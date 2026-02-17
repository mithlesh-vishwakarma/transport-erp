import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            About <span className="text-primary-600">Us</span>
          </motion.h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">
            We are dedicated to revolutionizing the logistics industry through innovative technology and unwavering commitment to service.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Team at work"
              className="relative rounded-2xl shadow-2xl z-10"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Driving Efficiency Since 2010</h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Founded with a vision to simplify complex transport operations, we have grown from a small fleet management provider to a comprehensive logistics partner. Our software solutions empower businesses to track, manage, and optimize their supply chains with ease.
            </p>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We believe in transparency, reliability, and continuous innovation. Our team of experts works tirelessly to ensure our clients have the best tools at their disposal to stay ahead in a competitive market.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Industry Leaders', '24/7 Support', 'Advanced Tech', 'Global Network'].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-slate-700 font-medium">
                  <CheckCircle2 className="text-primary-600" size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The principles that guide our every decision and interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: Award,
                title: 'Excellence',
                desc: 'We strive for perfection in every delivery and line of code.'
              },
              {
                icon: Users,
                title: 'Integrity',
                desc: 'Honesty and transparency are the pillars of our client relationships.'
              },
              {
                icon: CheckCircle2,
                title: 'Innovation',
                desc: 'Constantly evolving to meet the changing needs of the modern world.'
              }
            ].map((value, i) => (
              <div key={i} className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700 hover:border-primary-600 transition-colors">
                <div className="inline-flex p-4 rounded-full bg-slate-900 text-primary-400 mb-6">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-slate-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
