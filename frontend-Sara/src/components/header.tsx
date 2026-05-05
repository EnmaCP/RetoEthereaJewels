import { type CartItem } from "../types";
import { Link } from "react-router-dom";
import logoPrincipal from "./imagen/LogoPrincipal.png";
import searchIcon from "./imagen/Search_Icon.png";
import shoppingCart from "./imagen/ShoppingCart.png";
import userIcon from "./imagen/UserIcon.png";
import favoritosIcon from "./imagen/Favoritos.png";

export function Header() {
    const rawCart = sessionStorage.getItem("cart");
    const cart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const rawUser = sessionStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    return (
        <header className='site-header'>
            <div className="header-top">
            <div className="logo">
                <img src={logoPrincipal} alt="Etherea Jewelry logo" />
            </div>
            <div className="header-right">
                <div className="search-bar">
                     <input type="text" placeholder="Buscar artículos" />
                    <button className="search-btn"><img src={searchIcon} alt="Lupa" className="search-icon" /></button>
                </div>
                <div className="header-icons">
                    <button className="icon-btn"><img src={shoppingCart} alt="Carrito" className="cart-icon" /></button>
                    <button className="icon-btn"><img src={userIcon} alt="Usuario" className="user-icon" /></button>
                </div>
            </div>
        </div>
        
        <nav className="navbar">
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="#colecciones">Collections</a></li>
                <li><a href="#personalizacion">Personalization</a></li>
                <li><Link to="/intranet">Private Zone</Link></li>
                <li className="favorites"><a href="#favoritos"><img src={favoritosIcon} alt="Favoritos" className="favorites-icon"/></a></li>
            </ul>  
        </nav>
        </header>
    );
}

export default Header;