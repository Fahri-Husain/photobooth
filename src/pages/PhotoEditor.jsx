import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Download, SlidersHorizontal, Sticker, RotateCcw, Trash2, Frame } from 'lucide-react';
import './PhotoEditor.css';

const layouts = {
  '1': { id: 1, title: 'Classic Strip', type: 'strip', slots: 3 },
  '2': { id: 2, title: 'Postcard Grid', type: 'grid', slots: 4 },
  '3': { id: 3, title: 'Polaroid Style', type: 'polaroid', slots: 1 },
  '4': { id: 4, title: 'Portrait', type: 'portrait', slots: 1 }
};

const STICKERS = ['🎀', '✨', '💖', '🌸', '👑', '🧸', '🍒', '🦋', '🍓', '🍄', '🕶️', '💋'];

const FRAMES = [
  { id: 'frame-none', name: 'Minimalist (Default)' },
  { id: 'frame-scrapbook-vintage', name: 'Vintage Scrapbook' },
  { id: 'frame-y2k-denim', name: 'Y2K Denim Diary' },
  { id: 'frame-tartan-ribbon', name: 'Tartan Ribbons' },
  { id: 'frame-snoopy-denim', name: 'Snoopy Denim' },
  { id: 'frame-elegant-ticket', name: 'Elegant Red Ticket' },
  { id: 'frame-punk-rock', name: 'Punk Rock Star' }
];

const PhotoEditor = () => {
  const { layoutId } = useParams();
  const navigate = useNavigate();
  const layout = layouts[layoutId] || layouts['4'];

  const [phase, setPhase] = useState('capture'); // 'capture' or 'edit'
  const [photos, setPhotos] = useState(Array(layout.slots).fill(null));
  const [activeSlot, setActiveSlot] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Edit state
  const [activeTab, setActiveTab] = useState('filters'); // 'filters', 'stickers', 'frames'
  const [selectedFrame, setSelectedFrame] = useState('frame-none');
  const [filters, setFilters] = useState({
    brightness: 100, contrast: 100, saturation: 100, sepia: 0, blur: 0, grayscale: 0
  });
  
  // Stickers state: { id, emoji, x, y }
  const [stickers, setStickers] = useState([]);
  const [draggedSticker, setDraggedSticker] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const layoutRef = useRef(null); // Ref for the final layout to capture stickers relative to it

  // Initialize camera when in capture phase
  useEffect(() => {
    let stream = null;
    if (phase === 'capture') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Error accessing camera: ", err));
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [phase]);

  const startCaptureSequence = async () => {
    setIsCapturing(true);
    let currentPhotos = [...photos];
    
    for (let i = 0; i < layout.slots; i++) {
      setActiveSlot(i);
      // 3 second countdown
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        await new Promise(r => setTimeout(r, 1000));
      }
      setCountdown(null);
      
      // Flash effect could go here
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (canvas && video) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        // flip horizontally for mirror effect
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        currentPhotos[i] = canvas.toDataURL('image/png');
        setPhotos([...currentPhotos]);
      }
      
      // Wait a moment before next photo
      if (i < layout.slots - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    setIsCapturing(false);
    setTimeout(() => setPhase('edit'), 1000);
  };

  const handleRetake = () => {
    setPhotos(Array(layout.slots).fill(null));
    setActiveSlot(0);
    setStickers([]);
    setPhase('capture');
  };

  const handleFilterChange = (filterName, value) => setFilters(prev => ({ ...prev, [filterName]: value }));
  const resetFilters = () => setFilters({ brightness: 100, contrast: 100, saturation: 100, sepia: 0, blur: 0, grayscale: 0 });

  const addSticker = (emoji) => {
    setStickers([...stickers, { id: Date.now(), emoji, x: 50, y: 50 }]);
  };

  const handlePointerDown = (e, id) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;

    setDraggedSticker({ id, startX, startY, startXPos: sticker.x, startYPos: sticker.y });
  };

  const handlePointerMove = (e) => {
    if (!draggedSticker || !layoutRef.current) return;
    
    const deltaX = e.clientX - draggedSticker.startX;
    const deltaY = e.clientY - draggedSticker.startY;
    
    setStickers(prev => prev.map(s => {
      if (s.id === draggedSticker.id) {
        return { ...s, x: draggedSticker.startXPos + deltaX, y: draggedSticker.startYPos + deltaY };
      }
      return s;
    }));
  };

  const handlePointerUp = () => {
    setDraggedSticker(null);
  };

  const deleteSticker = (id) => {
    setStickers(prev => prev.filter(s => s.id !== id));
  };

  const filterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) sepia(${filters.sepia}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%)`
  };

  return (
    <motion.div 
      className="editor-page"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="editor-container">
        
        {/* Left Sidebar */}
        <div className="editor-sidebar">
          <div className="sidebar-header">
            <button className="back-btn" onClick={() => navigate('/choose-layout')}>← Back</button>
            <h2 className="heading-serif">{phase === 'capture' ? 'Take Photos' : 'Edit & Decorate'}</h2>
          </div>

          {phase === 'capture' ? (
            <div className="tool-section capture-section">
              <p className="text-muted mb-4">Get ready! We will take {layout.slots} photo{layout.slots > 1 ? 's' : ''}.</p>
              <button 
                className="btn-primary w-full" 
                onClick={startCaptureSequence}
                disabled={isCapturing}
              >
                <Camera size={18} className="mr-2" />
                {isCapturing ? 'Capturing...' : 'Start Camera'}
              </button>
              
              <div className="slots-preview mt-8">
                <p className="text-sm font-medium mb-2">Progress</p>
                <div className="slot-indicators">
                  {photos.map((p, i) => (
                    <div key={i} className={`indicator ${p ? 'filled' : ''} ${activeSlot === i && isCapturing ? 'active' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="tabs-container">
                <button className={`tab-btn ${activeTab === 'filters' ? 'active' : ''}`} onClick={() => setActiveTab('filters')}>
                  <SlidersHorizontal size={16} /> Filters
                </button>
                <button className={`tab-btn ${activeTab === 'stickers' ? 'active' : ''}`} onClick={() => setActiveTab('stickers')}>
                  <Sticker size={16} /> Stickers
                </button>
                <button className={`tab-btn ${activeTab === 'frames' ? 'active' : ''}`} onClick={() => setActiveTab('frames')}>
                  <Frame size={16} /> Frames
                </button>
              </div>

              {activeTab === 'filters' && (
                <div className="tool-section">
                  <div className="section-title">
                    <span>Adjustments</span>
                    <button className="reset-btn ml-auto" onClick={resetFilters}><RotateCcw size={14} /></button>
                  </div>
                  
                  <div className="sliders-container">
                    {['brightness', 'contrast', 'saturation', 'grayscale', 'sepia'].map(f => (
                      <div className="slider-group" key={f}>
                        <div className="slider-label">
                          <span style={{textTransform:'capitalize'}}>{f}</span>
                          <span>{filters[f]}%</span>
                        </div>
                        <input type="range" min="0" max="200" value={filters[f]} onChange={(e) => handleFilterChange(f, e.target.value)} />
                      </div>
                    ))}
                    <div className="slider-group">
                      <div className="slider-label"><span>Blur</span><span>{filters.blur}px</span></div>
                      <input type="range" min="0" max="20" value={filters.blur} onChange={(e) => handleFilterChange('blur', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stickers' && (
                <div className="tool-section">
                  <div className="section-title"><span>Cute Stickers</span></div>
                  <p className="text-sm text-muted mb-4">Click to add, then drag to position.</p>
                  <div className="stickers-grid">
                    {STICKERS.map(emoji => (
                      <button key={emoji} className="sticker-btn" onClick={() => addSticker(emoji)}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'frames' && (
                <div className="tool-section">
                  <div className="section-title"><span>Beautiful Frames</span></div>
                  <p className="text-sm text-muted mb-4">Choose a style for your print.</p>
                  <div className="frames-list">
                    {FRAMES.map(frame => (
                      <button 
                        key={frame.id} 
                        className={`frame-btn ${selectedFrame === frame.id ? 'active' : ''}`}
                        onClick={() => setSelectedFrame(frame.id)}
                      >
                        {frame.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="export-section">
                <button className="btn-secondary w-full mb-4" onClick={handleRetake}>
                  <Camera size={18} className="mr-2" /> Retake Photos
                </button>
                <button className="btn-primary w-full">
                  <Download size={18} className="mr-2" /> Save & Export
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Canvas */}
        <div className="editor-canvas">
          <div className="canvas-wrapper">
            
            {phase === 'capture' ? (
              <div className="camera-container">
                <video ref={videoRef} autoPlay playsInline className="webcam-video" />
                <AnimatePresence>
                  {countdown !== null && (
                    <motion.div 
                      key={countdown}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      className="countdown-overlay"
                    >
                      {countdown}
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Hidden canvas for capturing */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
            ) : (
              <div className="layout-relative-wrapper" ref={layoutRef}>
                <div className={`preview-layout ${layout.type} ${selectedFrame}`}>
                  {layout.type === 'strip' && (
                    <div className="layout-strip">
                      {photos.map((photo, index) => (
                        <div key={index} className="photo-slot">
                          {photo ? <img src={photo} alt="" style={filterStyle} /> : <div className="empty-slot" />}
                        </div>
                      ))}
                      <div className="strip-footer"><span>{new Date().toLocaleDateString()}</span></div>
                    </div>
                  )}

                  {layout.type === 'grid' && (
                    <div className="layout-grid-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="photo-slot">
                          {photo ? <img src={photo} alt="" style={filterStyle} /> : <div className="empty-slot" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {layout.type === 'polaroid' && (
                    <div className="layout-polaroid">
                      <div className="photo-slot">
                        {photos[0] ? <img src={photos[0]} alt="" style={filterStyle} /> : <div className="empty-slot" />}
                      </div>
                      <div className="polaroid-text">Memories</div>
                    </div>
                  )}

                  {layout.type === 'portrait' && (
                    <div className="layout-portrait">
                      <div className="photo-slot">
                        {photos[0] ? <img src={photos[0]} alt="" style={filterStyle} /> : <div className="empty-slot" />}
                      </div>
                    </div>
                  )}
                </div>

                {/* Draggable Stickers Overlay */}
                {stickers.map(sticker => (
                  <div 
                    key={sticker.id}
                    className="draggable-sticker"
                    style={{ transform: `translate(${sticker.x}px, ${sticker.y}px)` }}
                    onPointerDown={(e) => handlePointerDown(e, sticker.id)}
                  >
                    {sticker.emoji}
                    <button className="delete-sticker-btn" onClick={(e) => { e.stopPropagation(); deleteSticker(sticker.id); }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default PhotoEditor;
