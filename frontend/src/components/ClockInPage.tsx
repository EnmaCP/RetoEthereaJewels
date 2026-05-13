import { useState, useEffect } from 'react';
import './ClockInPage.css';
import { useUser } from './UserContext';
import { fichagesAPI } from '../services/apiService';

export default function ClockInPage() {
    const { customer } = useUser();

    const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
    const [note, setNote] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const checkStatus = async () => {
            if (!customer) return;
            try {
                const data = await fichagesAPI.getByUsuario(customer.id);
                if (Array.isArray(data) && data.length > 0) {
                    setIsClockedIn(data[0].tipo === 'entrada');
                } else {
                    setIsClockedIn(false);
                }
            } catch (err) {
                console.error("Error checking status", err);
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, [customer]);

    const handleClockEvent = async () => {
        if (!customer) return;
        const type = isClockedIn ? 'salida' : 'entrada';
        try {
            const data = await fichagesAPI.create({
                id_usuario: customer.id,
                tipo: type,
                nota: note
            });
            setIsClockedIn(!isClockedIn);
            setNote('');
            const date = new Date(data.fecha);
            setMessage(`Fichaje de ${type} registrado a las ${date.toLocaleTimeString()}`);
        } catch (err) {
            console.error("Error clocking", err);
            setMessage("Error al registrar el fichaje.");
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem', color: '#8c736d' }}>Cargando estado del fichaje...</p>;

    return (
        <div className="clock-container">
            <h1 className="pv-title" style={{ textAlign: 'center' }}>Registro de Jornada</h1>
            
            <div className="clock-card">
                <div className="digital-clock">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="clock-status">
                    Estado actual: <strong>{isClockedIn ? 'Trabajando' : 'Fuera de turno'}</strong>
                </div>

                {message && (
                    <div className="clock-message-success">
                        {message}
                    </div>
                )}

                <div className="clock-form-group">
                    <label className="clock-label">
                        Incidencia (opcional):
                    </label>
                    <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="clock-textarea"
                        placeholder="Escribe aquí si has llegado tarde, o hay alguna incidencia..."
                    />
                </div>

                <button 
                    onClick={handleClockEvent}
                    className={`btn-clock ${isClockedIn ? 'btn-clock-out' : 'btn-clock-in'}`}
                >
                    {isClockedIn ? 'Fichar salida' : 'Fichar entrada'}
                </button>
            </div>
        </div>
    );
}
