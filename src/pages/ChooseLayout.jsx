import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const layouts = [
  { id: 1, title: 'Classic Strip', desc: '2x6 traditional photo strip with 3 photos.', type: 'strip' },
  { id: 2, title: 'Postcard Grid', desc: '4x6 print with a 4-photo grid layout.', type: 'grid' },
  { id: 3, title: 'Polaroid Style', desc: 'Single 4x4 photo with custom text below.', type: 'polaroid' },
  { id: 4, title: 'Portrait', desc: 'Full bleed 4x6 single portrait shot.', type: 'portrait' }
];

const ChooseLayout = () => {
  const navigate = useNavigate();
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
        <h1 className="heading-lg">Choose Your Layout</h1>
        <p className="text-lg mt-4">Select a print design that perfectly matches your event style.</p>
      </div>

      <div className="layout-grid">
        {layouts.map((layout) => (
          <motion.div 
            key={layout.id} 
            className="layout-card" 
            variants={itemVariants}
            onClick={() => navigate(`/edit/${layout.id}`)}
          >
            <div className="layout-preview">
              {/* Visual representation based on type */}
              <div className={`mockup ${layout.type}`}>
                {layout.type === 'strip' && (
                  <div className="photo-strip" style={{ width: '80px', padding: '5px', gap: '5px' }}>
                    <div className="photo-frame" style={{ background: '#ddd' }}></div>
                    <div className="photo-frame" style={{ background: '#ddd' }}></div>
                    <div className="photo-frame" style={{ background: '#ddd' }}></div>
                  </div>
                )}
                {layout.type === 'grid' && (
                  <div style={{ width: '120px', height: '80px', background: '#fff', padding: '5px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <div style={{ background: '#ddd' }}></div>
                    <div style={{ background: '#ddd' }}></div>
                    <div style={{ background: '#ddd' }}></div>
                    <div style={{ background: '#ddd' }}></div>
                  </div>
                )}
                {layout.type === 'polaroid' && (
                  <div style={{ width: '100px', height: '120px', background: '#fff', padding: '5px 5px 25px 5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <div style={{ background: '#ddd', height: '100%' }}></div>
                  </div>
                )}
                {layout.type === 'portrait' && (
                  <div style={{ width: '80px', height: '120px', background: '#ddd', border: '5px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}></div>
                )}
              </div>
            </div>
            <h3 className="layout-title">{layout.title}</h3>
            <p className="layout-desc">{layout.desc}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </motion.div>
  );
};

export default ChooseLayout;
