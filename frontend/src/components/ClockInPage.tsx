import { useState, useEffect } from 'react';
import './IntranetLayout.css';
import { useUser } from './UserContext';
import { fichagesAPI } from '../services/apiService';

export default function ClockInPage() {
    const { customer } = useUser();

    const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
    const [note, setNote] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p className="intranet-text">Cargando estado del fichaje...</p>;

    return (
        <div>
            <h2 className="intranet-page-title">Registro de Fichajes</h2>
            
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
                    rows={4}
                    className="clock-textarea"
                    placeholder="Escribe aquí si has llegado tarde, si hay algún problema, etc."
                />
            </div>

            <button 
                onClick={handleClockEvent}
                className={`btn-intranet ${isClockedIn ? 'btn-clock-out' : 'btn-clock-in'}`}
            >
                {isClockedIn ? 'Fichar salida' : 'Fichar entrada'}
            </button>
        </div>
    );
}
