import { Outlet, NavLink } from 'react-router-dom';
import './IntranetLayout.css';
import logoPrincipal from "./imagen/LogoPrincipal.png";
import searchIcon from "./imagen/Search_Icon.png";
import shoppingCart from "./imagen/ShoppingCart.png";
import userIcon from "./imagen/UserIcon.png";
import favoritosIcon from "./imagen/Favoritos.png";

export default function IntranetLayout() {
    const raw = sessionStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;

    return (
        <div className="intranet-layout">
            <header className="site-header">
                <div className="header-top">
                    <div className="logo">
                        <a href="/"><img src={logoPrincipal} alt="Etherea Jewelry logo" /></a>
                    </div>
                    <div className="header-right">
                        <div className="search-bar">
                             <input type="text" placeholder="Buscar artículos" />
                            <button className="search-btn"><img src={searchIcon} alt="Lupa" className="search-icon" /></button>
                        </div>
                    </div>
                </div>
            <nav className="navbar">
                <ul className="nav-links">
                    <li>
                        <NavLink to="/intranet" end>
                            Bienvenida
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/intranet/fichajes">
                            Fichajes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/intranet/comite-empresa">
                            Comite de Empresa
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/intranet/acuerdos">
                            Acuerdos/Convenios
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/intranet/permisos-vacaciones">
                            Permisos y Vacaciones
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/">
                            Volver a Tienda
                        </NavLink>
                    </li>
                </ul>
            </nav>
            </header>
            <main className="intranet-main">
                <div className="intranet-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}