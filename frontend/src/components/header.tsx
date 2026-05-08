import { useState } from "react";
import { type CartItem } from "../types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoPrincipal from "./imagen/LogoPrincipal.png";
import searchIcon from "./imagen/Search_Icon.png";
import shoppingCart from "./imagen/ShoppingCart.png";
import userIcon from "./imagen/UserIcon.png";
import favoritosIcon from "./imagen/Favoritos.png";
import { useUser } from "./UserContext";

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { customer, setCustomer } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    if (location.pathname.startsWith('/intranet')) {
        return null;
    }

    const rawCart = sessionStorage.getItem("cart");
    const cart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            setCustomer(null);
            sessionStorage.removeItem("user");
            setIsDropdownOpen(false);
            navigate("/login");
        } catch (error) {
            console.error("Error logging out", error);
        }
    };

    const handleUserIconClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (customer) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            navigate("/login");
        }
    };

    return (
        <header className='site-header'>
            <div className="header-top">
            <div className="logo">
                <a href="/"><img src={logoPrincipal} alt="Etherea Jewelry logo" /></a>
            </div>
            <div className="header-right">
                <div className="search-bar">
                     <input type="text" placeholder="Buscar artículos" />
                    <button className="search-btn"><img src={searchIcon} alt="Lupa" className="search-icon" /></button>
                </div>
                <div className="header-icons">
                    <button className="icon-btn"><Link to={customer ? "/cart" : "/login"}><img src={shoppingCart} alt="Carrito" className="cart-icon" /></Link></button>
                    
                    <div className="user-menu-container">
                        <button className="icon-btn" onClick={handleUserIconClick}>
                            <img src={userIcon} alt="Usuario" className="user-icon" />
                        </button>
                        {isDropdownOpen && customer && (
                            <div className="user-dropdown">
                                <p className="user-dropdown-welcome">Welcome, {customer.username}</p>
                                <button 
                                    className="user-dropdown-btn"
                                    onClick={() => { setIsDropdownOpen(false); navigate("/mis-pedidos"); }} 
                                >
                                    Acceder a los pedidos
                                </button>
                                <button 
                                    className="user-dropdown-logout"
                                    onClick={() => { setIsDropdownOpen(false); handleLogout(); }} 
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        <nav className="navbar">
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/catalogue">Catalogue</a></li>
                <li><a href="#personalizacion">Personalization</a></li>
                <li><Link to="/intranet">Private Zone</Link></li>
                <li className="favorites"><a href="/wishlist"><img src={favoritosIcon} alt="Favoritos" className="favorites-icon"/></a></li>
            </ul>  
        </nav>
        </header>
    );
}

export default Header;