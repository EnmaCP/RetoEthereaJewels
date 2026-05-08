import React, { useState, useEffect } from 'react';
import './ComiteEmpresa.css';


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

            <div className="comite-content">
                {/* COLUMNA IZQUIERDA */}
                <div className="left-column">

                    <section className="quienes-somos">
                        <h2>¿Quiénes somos?</h2>
                        <p>
                            Somos un equipo de compañeros y compañeras elegidos para representarte. Piensa en nosotros como tu
                            &quot;delegado de clase&quot;: nuestra misión es ser tu voz ante la dirección, velar por
                            nuestros derechos laborales, resolver tus dudas del día a día y proponer
                            mejoras para que trabajar aquí sea cada vez mejor. Básicamente, estamos en tu mismo barco
                            y estamos aquí para ayudarte.<br></br> ¡No dudes en contactar con nosotros!
                        </p>
                    </section>

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
                </div>
            </div>
        </div>
    );
}