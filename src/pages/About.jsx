import React from 'react';
import { motion } from 'framer-motion';
import './Pages.css';

const About = () => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="page-wrapper"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container">
        <div className="page-header">
        <h1 className="heading-lg">The Experience</h1>
        <p className="text-lg mt-4">Redefining the classic photobooth.</p>
      </div>
      
      <div className="about-content">
        <div>
          <h2 className="heading-serif mb-4">Studio Quality</h2>
          <p className="text-muted">
            We bring professional lighting, DSLR cameras, and high-end printers to every event. 
            No iPads or webcams—just stunning, flattering portraits that you and your guests will cherish.
          </p>
        </div>
        <div>
          <h2 className="heading-serif mb-4">Aesthetic Focused</h2>
          <p className="text-muted">
            Our open-air booth design is sleek and modern, blending seamlessly into any luxury venue. 
            We offer premium backdrops and custom-designed print templates tailored to your event.
          </p>
        </div>
      </div>
      </div>
    </motion.div>
  );
};

export default About;
