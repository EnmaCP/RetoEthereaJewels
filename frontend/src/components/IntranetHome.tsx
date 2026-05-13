import { Link } from 'react-router-dom';
import { Calendar, FileText, Clock, Users, ArrowRight, Bell } from 'lucide-react';
import './IntranetHome.css';

export default function IntranetHome() {
    const raw = sessionStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;

    const news = [
        { date: "15", month: "MAY", title: "Lanzamiento Colección Verano", desc: "Descubre las nuevas piezas inspiradas en el atardecer." },
        { date: "10", month: "MAY", title: "Nueva Política de Vacaciones", desc: "Actualización en el portal de recursos humanos." },
        { date: "02", month: "MAY", title: "Reunión Trimestral", desc: "Resultados del Q1 y objetivos para los próximos meses." }
    ];

    const days = ["L", "M", "X", "J", "V", "S", "D"];
    const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="intranet-container">

            <div className="intranet-grid-top">
                {/* Left Large Card */}
                <div>
                    <Link to="/intranet/comite-empresa" className="luxury-card card-comite">
                        <div 
                            className="card-bg" 
                            style={{ backgroundImage: 'url("https://i.pinimg.com/1200x/ad/d4/4e/add44e00e8ec1554acb4c889fc17de48.jpg")' }}
                        />
                        <div className="card-overlay"></div>
                        <div className="card-content">
                            <Users size={40} style={{ marginBottom: '1rem', color: '#f3e2e2' }} />
                            <h3>Comité de Empresa</h3>
                            <p>Gestión de actas, acuerdos y representación sindical.</p>
                        </div>
                    </Link>
                </div>

                {/* Right Stacked Cards */}
                <div className="right-stacked">
                    <div style={{ height: '100%' }}>
                        <Link to="/intranet/fichajes" className="luxury-card card-stacked">
                            <div 
                                className="card-bg" 
                                style={{ backgroundImage: 'url("https://i.pinimg.com/736x/1c/80/75/1c80756795bd659f9f14ec3f92f50f28.jpg")' }}
                            />
                            <div className="card-overlay"></div>
                            <div className="card-content">
                                <Clock size={30} style={{ marginBottom: '0.5rem', color: '#f3e2e2' }} />
                                <h3>Fichaje</h3>
                                <p>Registro de jornada laboral</p>
                            </div>
                        </Link>
                    </div>
                    
                    <div style={{ height: '100%' }}>
                        <Link to="/intranet/acuerdos" className="luxury-card card-stacked">
                            <div 
                                className="card-bg" 
                                style={{ backgroundImage: 'url("https://i.pinimg.com/736x/28/c8/e5/28c8e5b44f67da8fc0bc605e8b7d3d29.jpg")' }}
                            />
                            <div className="card-overlay"></div>
                            <div className="card-content">
                                <FileText size={30} style={{ marginBottom: '0.5rem', color: '#f3e2e2' }} />
                                <h3>Información Relevante</h3>
                                <p>Documentos y normativas</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="intranet-grid-bottom">
                {/* Bottom Left: Calendar */}
                <div className="bottom-section">
                    <div className="section-header">
                        <Calendar size={24} />
                        <h3>Calendario Laboral</h3>
                    </div>
                    <div className="calendar-grid">
                        {days.map((day, idx) => (
                            <div key={`header-${idx}`} className="calendar-day-header">{day}</div>
                        ))}
                        {/* Empty slots for month start offset */}
                        <div></div><div></div><div></div>
                        {calendarDays.map(day => (
                            <div key={`day-${day}`} className={`calendar-day ${day === 15 ? 'active' : ''}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Right: News */}
                <div className="bottom-section">
                    <div className="section-header">
                        <Bell size={24} />
                        <h3>Noticias de la Empresa</h3>
                    </div>
                    <div className="news-list">
                        {news.map((item, idx) => (
                            <div key={idx} className="news-item">
                                <div className="news-date">
                                    <span>{item.date}</span>
                                    <span>{item.month}</span>
                                </div>
                                <div className="news-content">
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                                <ArrowRight size={20} style={{ marginLeft: 'auto', alignSelf: 'center', color: '#cba97c' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
