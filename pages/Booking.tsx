import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { dbService } from '../services/db';
import { Appointment, AppointmentStatus } from '../types';
import { Modal } from '../components/Modal';
import { AlertModal } from '../components/AlertModal';
import { useAlert } from '../hooks/useAlert';
import { useAuth } from '../contexts/AuthContext';

const OPENING_HOUR = 8;
const CLOSING_HOUR = 16;
const MAX_CAPACITY = 3;

export const Booking: React.FC = () => {
  const location = useLocation();
  const selectedTire = (location.state as any)?.selectedTire || '';
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Booking Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    carBrand: selectedTire
  });

  // Alert modal
  const { alertState, showAlert, showConfirm, closeAlert } = useAlert();

  useEffect(() => {
    loadAppointments();
  }, []);

  // Mettre à jour carBrand si un pneu est sélectionné depuis TireCard
  useEffect(() => {
    if (selectedTire) {
      setFormData(prev => ({ ...prev, carBrand: selectedTire }));
    }
  }, [selectedTire]);

  const loadAppointments = async () => {
    setLoading(true);
    const data = await dbService.getAppointments();
    setAppointments(data);
    
    // Filtrer les réservations de l'utilisateur connecté
    if (user) {
      const userAppointments = data.filter(apt => apt.clientEmail === user.email);
      setMyAppointments(userAppointments);
    }
    
    setLoading(false);
  };

  const timeSlots = Array.from({ length: CLOSING_HOUR - OPENING_HOUR }, (_, i) => {
    const hour = OPENING_HOUR + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getSlotStatus = (time: string) => {
    const dateObj = new Date(selectedDate);
    const day = dateObj.getDay();
    
    // Check Weekend (Note: getDay() returns 0 for Sunday, 6 for Saturday. In some contexts Monday is 0, but JS Date uses 0=Sun)
    // Actually, 'selectedDate' string "YYYY-MM-DD" parsed might have timezone issues. 
    // Safer to create date with time to ensure local day check.
    const localDay = new Date(selectedDate + 'T12:00:00').getDay();
    
    if (localDay === 0 || localDay === 6) return 'closed';

    const count = appointments.filter(a => a.date === selectedDate && a.time === time).length;
    if (count >= MAX_CAPACITY) return 'full';
    return 'available';
  };

  const handleSlotClick = (time: string) => {
    const status = getSlotStatus(time);
    if (status !== 'available') return;
    setSelectedSlot(time);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    // Pré-remplir avec l'email de l'utilisateur connecté
    const appointmentData = {
      ...formData,
      clientEmail: user?.email || formData.clientEmail,
      date: selectedDate,
      time: selectedSlot
    };

    try {
      await dbService.createAppointment(appointmentData);
      setIsModalOpen(false);
      setFormData({ clientName: '', clientEmail: '', carBrand: '' });
      await loadAppointments();
      showAlert({
        title: "Rendez-vous confirmé !",
        message: `Votre rendez-vous pour le ${selectedDate} à ${selectedSlot} a été confirmé.`,
        type: "success"
      });
    } catch (err: any) {
      showAlert({
        title: "Erreur",
        message: err.message || "Erreur lors de la réservation",
        type: "error"
      });
    }
  };

  const isWeekend = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.getDay() === 0 || d.getDay() === 6;
  };

  const getStatusBadge = (statut: AppointmentStatus) => {
    const styles = {
      [AppointmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [AppointmentStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[statut]}`}>
        {statut}
      </span>
    );
  };

  const handleCancelAppointment = async (id: string) => {
    const confirmed = await showConfirm({
      title: "Annuler le rendez-vous",
      message: "Êtes-vous sûr de vouloir annuler ce rendez-vous ?",
      type: "confirm"
    });

    if (!confirmed) return;

    try {
      // Mettre à jour le statut au lieu de supprimer
      const appointment = appointments.find(apt => apt.id === id);
      if (appointment) {
        await dbService.updateAppointment(id, {
          ...appointment,
          statut: AppointmentStatus.CANCELLED
        });
        await loadAppointments();
        showAlert({
          title: "Succès",
          message: "Le rendez-vous a été annulé",
          type: "success"
        });
      }
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
      showAlert({
        title: "Erreur",
        message: "Erreur lors de l'annulation",
        type: "error"
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Réserver un service</h1>
        <p className="text-slate-500 mb-6">Sélectionnez une date et une heure pour votre changement de pneus.</p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Calendar Selection */}
          <div className="w-full md:w-1/3 space-y-4">
            <label className="block text-sm font-medium text-slate-700">Date souhaitée</label>
            <input 
              type="date" 
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
            
            {isWeekend(selectedDate) && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100">
                Le garage est fermé le samedi et le dimanche.
              </div>
            )}
            
            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">
              <h4 className="font-semibold mb-2">Horaire d'ouverture</h4>
              <p>Lundi - Vendredi</p>
              <p>08:00 - 16:00</p>
            </div>
          </div>

          {/* Time Slots */}
          <div className="w-full md:w-2/3">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Disponibilités pour le {new Date(selectedDate).toLocaleDateString()}
            </h3>
            
            {loading ? (
              <div className="animate-pulse flex space-x-4"><div className="h-10 w-full bg-slate-200 rounded"></div></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map(time => {
                  const status = getSlotStatus(time);
                  let btnClass = "py-3 px-4 rounded-lg font-medium border text-center transition-all ";
                  
                  if (status === 'closed') {
                    btnClass += "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed";
                  } else if (status === 'full') {
                    btnClass += "bg-red-50 text-red-400 border-red-100 cursor-not-allowed decoration-red-400";
                  } else {
                    btnClass += "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md cursor-pointer";
                  }

                  return (
                    <button 
                      key={time} 
                      onClick={() => handleSlotClick(time)}
                      disabled={status !== 'available'}
                      className={btnClass}
                    >
                      {time}
                      {status === 'full' && <span className="block text-xs font-normal">Complet</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Réservation pour ${selectedSlot}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
            <input 
              required
              value={formData.clientName}
              onChange={e => setFormData({...formData, clientName: e.target.value})}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Courriel</label>
            <input 
              required
              type="email"
              value={user?.email || formData.clientEmail}
              onChange={e => setFormData({...formData, clientEmail: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500"
              placeholder="jean@exemple.com"
              disabled={!!user}
            />
            {user && (
              <p className="text-xs text-slate-500 mt-1">Email pré-rempli depuis votre compte</p>
            )}
          </div>

          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Marque de voiture</label>
            <input 
              required
              value={formData.carBrand}
              onChange={e => setFormData({...formData, carBrand: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500"
              placeholder="ex: Toyota Corolla"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Annuler</button>
             <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Confirmer</button>
          </div>
        </form>
      </Modal>

      {/* Mes réservations - uniquement pour les utilisateurs connectés */}
      {user && myAppointments.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Mes Réservations</h2>
          <div className="space-y-3">
            {myAppointments.map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-slate-800">{apt.clientName}</span>
                    {getStatusBadge(apt.statut)}
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>📅 {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time}</p>
                    <p>🚗 {apt.carBrand}</p>
                  </div>
                </div>
                {/* {apt.statut === AppointmentStatus.PENDING && (
                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Annuler
                  </button>
                )} */}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
      />
    </div>
  );
};