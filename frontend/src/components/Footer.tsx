import './Footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Etherea Jewels</h3>
          <p className="footer-text">
            Elegance and sophistication in every detail. Discover our collection of jewelry designed to shine in every special moment of your life.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/catalogue">Catalog</Link></li>
            <li><Link to="/personalization">Personalization</Link></li>
            <li><Link to="/intranet">Intranet</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Customer Care</h4>
          <ul className="footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Follow Us</h4>
          <div className="footer-social">
            <a href="#" className="social-icon">Instagram</a>
            <a href="#" className="social-icon">Facebook</a>
            <a href="#" className="social-icon">Pinterest</a>
            <a href="#" className="social-icon">Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Etherea Jewels. All rights reserved.</p>
      </div>
    </footer>
  );
}
