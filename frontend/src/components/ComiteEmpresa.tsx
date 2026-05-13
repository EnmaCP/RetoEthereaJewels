import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ComiteEmpresa.css';
import videoPresentation from './imagen/videopresentation.mp4';


const logros = [
    { id: 1, title: 'Mejoras de ergonomía', text: 'Conseguimos la renovación de las sillas y mejoramos la iluminación y las lupas para el equipo de taller, cuidando la postura y la vista en los trabajos más minuciosos.' },
    { id: 2, title: 'Turnos más justos en campañas fuertes', text: 'Acordamos un nuevo sistema de libranzas para las campañas de Navidad y San Valentín, asegurando que todos podamos conciliar mejor en nuestras épocas de más.' },
    { id: 3, title: 'Renovación de la zona de descanso', text: 'Gestionamos la mejora del office y la zona de café para que todos tengamos un espacio mucho más cómodo y agradable donde desconectar durante los descansos.' },
];
const integrantes = [
    { id: 1, name: 'Lolo Lopez', role: 'Presidente' },
    { id: 2, name: 'Sara Marcopolo', role: 'Secretaria' },
    { id: 3, name: 'Enma Continente', role: 'Vocal' },
    { id: 4, name: 'Sofia Tuerca', role: 'Empleada' },
    { id: 5, name: 'Lidia Dorado', role: 'Empleada' },
    { id: 6, name: 'Andres Aravoy', role: 'Empleado en prácticas' },
    { id: 7, name: 'Ainara Gorrión', role: 'Empleada' },
    { id: 8, name: 'Daniel Romareda', role: 'Empleado' },
    { id: 9, name: 'Chino Atleticont', role: 'Empleado' },
];

const objetivos = [
    { id: 1, title: 'Jornada intensiva en verano', text: 'Estamos negociando la posibilidad de implementar una jornada continua durante los meses de julio y agosto para mejorar la conciliación.' },
    { id: 2, title: 'Plan de formación a medida', text: 'Vamos a solicitar a la empresa un presupuesto para ofrecer cursos gratuitos al equipo, desde nuevas técnicas de modelado 3D hasta atención al cliente para ventas personalizadas.' },
];

export function Committee() {
    return (
        <div className="comite-container">
            {/* Título principal que abarca todo */}
            <h1 className="comite-title">Comité de empresa</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem', alignItems: 'center' }}>
                <section className="quienes-somos" style={{ flex: '1 1 400px', margin: 0 }}>
                    <h2>¿Quiénes somos?</h2>
                    <p>
                        Somos un equipo de compañeros y compañeras elegidos para representarte. Piensa en nosotros como tu
                        &quot;delegado de clase&quot;: nuestra misión es ser tu voz ante la dirección, velar por
                        nuestros derechos laborales, resolver tus dudas del día a día y proponer
                        mejoras para que trabajar aquí sea cada vez mejor. Básicamente, estamos en tu mismo barco
                        y estamos aquí para ayudarte.<br></br> ¡No dudes en contactar con nosotros!
                    </p>
                </section>

                <section className="bienvenida-video" style={{ flex: '1 1 400px', margin: 0 }}>
                    <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(203, 169, 124, 0.2)' }}>
                        <video 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            controls
                            style={{ width: '100%', display: 'block', maxHeight: '350px', objectFit: 'cover' }}
                        >
                            <source src={videoPresentation} type="video/mp4" />
                            Tu navegador no soporta el formato de video.
                        </video>
                    </div>
                </section>
            </div>

            <div className="comite-content">
                {/* COLUMNA IZQUIERDA */}
                <div className="left-column">

                    <section className="nuestros-logros">
                        <h2>Nuestros logros</h2>
                        <div className="logros-list">
                            {logros.map(logro => (
                                <div key={logro.id} className="logro-card">
                                    <div className="logro-image-placeholder"></div>
                                    <div className="logro-info">
                                        <h3>{logro.title}</h3>
                                        <p>{logro.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="objetivos">
                        <h2>Objetivos 2026</h2>
                        <div className="logros-list">
                            {objetivos.map(objetivo => (
                                <div key={objetivo.id} className="logro-card">
                                    <div className="logro-image-placeholder"></div>
                                    <div className="logro-info">
                                        <h3>{objetivo.title}</h3>
                                        <p>{objetivo.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="contacto-comite">
                        <h2>Contacta con nosotros</h2>
                        <p>Si tienes alguna duda, sugerencia o necesitas ayuda con algún tema laboral, no dudes en escribirnos de forma totalmente confidencial.</p>
                        <form className="contacto-form">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input type="text" placeholder="Tu nombre" />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input type="email" placeholder="tu@email.com" />
                            </div>
                            <div className="form-group">
                                <label>Mensaje / Consulta</label>
                                <textarea placeholder="¿En qué podemos ayudarte?"></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Enviar Mensaje</button>
                        </form>
                    </section>

                </div>

                {/* COLUMNA DERECHA */}
                <div className="right-column">
                    <h2>Integrantes</h2>
                    <div className="integrantes-grid">
                        {integrantes.map(integrante => (
                            <div key={integrante.id} className="integrante-card">
                                <div className="integrante-img-container">
                                    {/* Usa una etiqueta <img> real aquí si tienes las URLs */}
                                    <div className="img-placeholder">Foto</div>
                                </div>
                                <div className="integrante-info">
                                    <h3>{integrante.name}</h3>
                                    <p style={{ textTransform: 'capitalize' }}>{integrante.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <section className="enlaces-interes" style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h2>Enlaces de Interés</h2>
                        <Link to="/intranet/acuerdos" className="btn-intranet" style={{ textAlign: 'center', display: 'block', width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                            📄 Ver Acuerdos
                        </Link>
                        <Link to="/intranet/permisos-vacaciones" className="btn-intranet" style={{ textAlign: 'center', display: 'block', width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                            ✈️ Permisos y Vacaciones
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
}