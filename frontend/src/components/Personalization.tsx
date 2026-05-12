import { useState } from 'react';
import './Personalization.css';
import { useNavigate } from 'react-router-dom';

export function Personalization() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [quote, setQuote] = useState('');
  const [font, setFont] = useState('tangerine');
  const [symbol, setSymbol] = useState<string | null>(null);
  const [material, setMaterial] = useState('Gold');
  const [shape, setShape] = useState('Circle');
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  const shapes = ['Circle', 'Oval', 'Square', 'Bar'];
  const symbols = ['✧', '♡', '❀', '☆', '∞', '☾'];
  const materials = [
    { name: 'Gold', color: '#D4AF37' },
    { name: 'Silver', color: '#E5E4E2' },
    { name: 'Rose Gold', color: '#B76E79' },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    alert("Your personalization has been saved successfully! Adding to the cart...");
    navigate('/cart');
  };

  return (
    <div className="personalization-page">
      <h1 className="section-title">Personalization Studio</h1>
      <p className="personalization-subtitle">Create a timeless piece uniquely yours.</p>

      <div className="personalization-container">
        {/* Left Column: Controls */}
        <div className="personalization-controls">
          
          <div className="control-section">
            <h3>1. Add Photos</h3>
            <p className="section-desc">Upload a memorable image for photo engraving.</p>
            <div className="photo-upload-wrapper">
              <label htmlFor="photo-upload" className="upload-btn">
                <span>Upload Image</span>
              </label>
              <input 
                type="file" 
                id="photo-upload" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                style={{ display: 'none' }}
              />
              {photo && <p className="success-text">Image uploaded successfully!</p>}
            </div>
          </div>

          <div className="control-section">
            <h3>2. Add Quotes or Text</h3>
            <p className="section-desc">Add a romantic phrase or meaningful name. {photo ? "(Engraved on the back)" : ""}</p>
            <input 
              type="text" 
              className="text-input"
              placeholder="E.g. Always & Forever..."
              value={quote}
              onChange={(e) => setQuote(e.target.value.slice(0, 30))}
            />
            <p className="char-limit">{quote.length}/30 characters</p>
          </div>

          <div className="control-section">
            <h3>3. Engraving Style</h3>
            <div className="font-selection">
              <button 
                className={`font-btn ${font === 'tangerine' ? 'active' : ''}`}
                onClick={() => setFont('tangerine')}
                style={{ fontFamily: "'Tangerine', cursive", fontSize: '1.5rem' }}
              >
                Script
              </button>
              <button 
                className={`font-btn ${font === 'times' ? 'active' : ''}`}
                onClick={() => setFont('times')}
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                Serif
              </button>
              <button 
                className={`font-btn ${font === 'sans' ? 'active' : ''}`}
                onClick={() => setFont('sans')}
                style={{ fontFamily: "sans-serif" }}
              >
                Minimal
              </button>
            </div>
          </div>

          <div className="control-section">
            <h3>4. Birthstones / Symbols</h3>
            <div className="symbols-grid">
              {symbols.map(s => (
                <button 
                  key={s} 
                  className={`symbol-btn ${symbol === s ? 'active' : ''}`}
                  onClick={() => setSymbol(s === symbol ? null : s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>5. Shape Selection</h3>
            <div className="shapes-grid">
              {shapes.map(s => (
                <button 
                  key={s} 
                  className={`shape-btn ${shape === s ? 'active' : ''}`}
                  onClick={() => setShape(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>6. Material Selection</h3>
            <div className="materials-grid">
              {materials.map(m => (
                <button 
                  key={m.name} 
                  className={`material-btn ${material === m.name ? 'active' : ''}`}
                  onClick={() => setMaterial(m.name)}
                >
                  <span className="color-swatch" style={{ backgroundColor: m.color }}></span>
                  {m.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Preview */}
        <div className="personalization-preview">
          <div className="preview-card">
            <h3>Live Preview</h3>
            
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewSide === 'front' ? 'active' : ''}`} 
                onClick={() => setViewSide('front')}
              >
                Front
              </button>
              <button 
                className={`toggle-btn ${viewSide === 'back' ? 'active' : ''}`} 
                onClick={() => setViewSide('back')}
              >
                Back
              </button>
            </div>

            <div className="mock-jewelry-container">
              {/* Dynamic pendant visual */}
              <div 
                className={`jewelry-pendant shape-${shape.toLowerCase()}`} 
                style={{
                  background: material === 'Gold' ? 'linear-gradient(135deg, #f9d976 0%, #e9b646 100%)' :
                              material === 'Silver' ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' :
                              'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)'
                }}
              >
                {photo && viewSide === 'front' && (
                  <div className="pendant-photo">
                    <img src={photo} alt="Engraved" />
                  </div>
                )}
                {((!photo && viewSide === 'front') || viewSide === 'back') && (
                  <div className="pendant-engraving">
                    <span className={`engraved-text font-${font}`}>
                      {quote || (viewSide === 'back' ? 'Back Text' : 'Your Text')}
                    </span>
                    {symbol && <span className="engraved-symbol">{symbol}</span>}
                  </div>
                )}
              </div>
            </div>
            <p className="preview-note">Your custom design in {material}</p>

            <button className="save-btn" onClick={handleSave}>
              Save Personalization
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
