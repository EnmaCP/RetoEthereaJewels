import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="not-found">
            <h1 className="not-found_code">404</h1>
            <p className="not-found_message">We're sorry, the product or page you're looking for doesn't exist.</p>
            <button className="not-found_btn" onClick={() => navigate('/')}>Return to catalogue</button>
        </div>
    );
}