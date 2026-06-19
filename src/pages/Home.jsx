import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Pages.css';

const Home = () => {
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  const textVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="page-wrapper home-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container hero-container">
        <div className="hero-content">
          <motion.h1 className="heading-display" variants={textVariants}>
            Capture the<br/>
            <span className="italic-serif">elegant</span> moments.
          </motion.h1>
          <motion.p className="text-lg mt-4" variants={textVariants} transition={{ delay: 0.4 }}>
            Premium photobooth experiences for weddings, corporate events, and exclusive parties. Elevate your event with studio-quality portraits.
          </motion.p>
          <motion.div className="mt-8" variants={textVariants} transition={{ delay: 0.6 }}>
            <Link to="/choose-layout" className="btn-primary">
              Explore Layouts
            </Link>
          </motion.div>
        </div>
        <motion.div 
          className="hero-image-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="hero-image-placeholder">
            <div className="photo-strip">
              <div className="photo-frame"></div>
              <div className="photo-frame"></div>
              <div className="photo-frame"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
