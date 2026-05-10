import React from 'react';
import './ComiteEmpresa.css';

const convenios = [
    { id: 1, title: 'Convenio Colectivo de Joyería', text: 'El presente convenio rige las condiciones laborales, salariales y de descanso para todo el personal adscrito al sector de la joyería, platería y relojería. Incluye las últimas actualizaciones de 2025.' },
    { id: 2, title: 'Acuerdo de Teletrabajo', text: 'Establece las condiciones para el trabajo a distancia, incluyendo la compensación por gastos de equipo y conexión, así como los días mínimos de presencia en oficina requeridos.' },
    { id: 3, title: 'Acuerdo de Formación Continua', text: 'Detalla los presupuestos anuales destinados a la formación del equipo, los permisos retribuidos para asistir a cursos y la plataforma de aprendizaje interno.' },
    { id: 4, title: 'Protocolo de Prevención', text: 'Medidas actualizadas de salud laboral y prevención de riesgos, especialmente enfocadas en ergonomía para el personal de taller y manejo de productos químicos.' },
];

export function Acuerdos() {
    return (
        <div className="comite-container">
            <h1 className="comite-title">Acuerdos y Convenios</h1>
            
            <div className="comite-content" style={{ display: 'block' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>
                    En esta sección puedes consultar la información oficial sobre los acuerdos vigentes 
                    en Etherea Jewelry y el marco legal de nuestro sector.
                </p>

                <div className="logros-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {convenios.map(convenio => (
                        <div key={convenio.id} className="logro-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="logro-info">
                                <h3 style={{ borderBottom: '1px solid #c9af8c', paddingBottom: '10px' }}>{convenio.title}</h3>
                                <p style={{ marginTop: '10px' }}>{convenio.text}</p>
                            </div>
                            <button style={{ 
                                alignSelf: 'flex-start', 
                                marginTop: 'auto',
                                backgroundColor: '#c9af8c',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Descargar PDF
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
