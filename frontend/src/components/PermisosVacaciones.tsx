import React from 'react';
import './PermisosVacaciones.css';

const permisos = [
    {
        id: 1,
        title: 'Matrimonio o registro de pareja de hecho',
        days: '15 días naturales',
        description: 'Se pueden disfrutar a partir del día de la celebración o registro.'
    },
    {
        id: 2,
        title: 'Fallecimiento, accidente o enfermedad grave',
        days: '5 días laborales',
        description: 'Para familiares de hasta segundo grado de consanguinidad o afinidad.'
    },
    {
        id: 3,
        title: 'Mudanza / Traslado de domicilio',
        days: '1 día laboral',
        description: 'Justificación mediante contrato de alquiler o certificado de empadronamiento.'
    },
    {
        id: 4,
        title: 'Exámenes y formación',
        days: 'Tiempo indispensable',
        description: 'Para la realización de exámenes oficiales o cursos de formación profesional.'
    },
    {
        id: 5,
        title: 'Cumplimiento de deber inexcusable',
        days: 'Tiempo indispensable',
        description: 'Como por ejemplo, citaciones judiciales, ejercicio del sufragio activo, etc.'
    }
];

export function PermisosVacaciones() {
    return (
        <div className="permisos-vacaciones-container">
            <h1 className="pv-title">Permisos Retribuidos y Vacaciones</h1>

            <div className="pv-content">
                <section className="vacaciones-section">
                    <div className="vacaciones-header">
                        <h2>Vacaciones Anuales</h2>
                        <span className="badge">30 días naturales</span>
                    </div>
                    <div className="vacaciones-card">
                        <div className="info-item">
                            <h3>Calendario de Vacaciones</h3>
                            <p>El periodo de vacaciones debe ser acordado entre la empresa y el trabajador con al menos 2 meses de antelación.</p>
                            <button className="pv-btn">Ver Calendario 2026</button>
                        </div>
                        <div className="info-item">
                            <h3>Solicitud de Vacaciones</h3>
                            <p>Envía tu propuesta de fechas a través del portal del empleado o contactando directamente con RRHH.</p>
                            <button className="pv-btn secondary">Solicitar Ahora</button>
                        </div>
                    </div>
                </section>

                <section className="permisos-section">
                    <h2>Listado de Permisos Retribuidos</h2>
                    <div className="permisos-grid">
                        {permisos.map(permiso => (
                            <div key={permiso.id} className="permiso-card">
                                <div className="permiso-header">
                                    <h3>{permiso.title}</h3>
                                    <span className="permiso-days">{permiso.days}</span>
                                </div>
                                <p>{permiso.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section className="normativa-section">
                    <h2>Normativa y Documentación</h2>
                    <div className="normativa-grid">
                        <div className="normativa-card">
                            <div className="icon">📄</div>
                            <div className="normativa-info">
                                <h4>Estatuto de los Trabajadores</h4>
                                <p>Consulta el artículo 37 y 38 sobre descansos y vacaciones.</p>
                            </div>
                        </div>
                        <div className="normativa-card">
                            <div className="icon">📁</div>
                            <div className="normativa-info">
                                <h4>Convenio Colectivo Etherea</h4>
                                <p>Mejoras específicas aplicables a nuestra empresa.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
