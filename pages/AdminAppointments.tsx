import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { Appointment, AppointmentStatus } from '../types';
import { Modal } from '../components/Modal';
import { AlertModal } from '../components/AlertModal';
import { useAlert } from '../hooks/useAlert';

export const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Alert modal
  const { alertState, showAlert, showConfirm, closeAlert } = useAlert();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await dbService.getAppointments();
    console.log('📅 Rendez-vous chargés:', data.map(apt => ({
      client: apt.clientName,
      date: apt.date,
      statut: apt.statut
    })));
    setAppointments(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: "Annuler le rendez-vous",
      message: "Êtes-vous sûr de vouloir annuler ce rendez-vous ?",
      type: "confirm",
      confirmText: "Annuler le RDV",
      cancelText: "Retour"
    });
    
    if (!confirmed) return;
    
    try {
      await dbService.deleteAppointment(id);
      await loadData();
      showAlert({
        title: "Succès",
        message: "Le rendez-vous a été annulé",
        type: "success"
      });
    } catch (err) {
      showAlert({
        title: "Erreur",
        message: "Erreur lors de l'annulation du rendez-vous",
        type: "error"
      });
    }
  };

  const handleEdit = (apt: Appointment) => {
    setEditingApt(apt);
    setFormData(apt);
    setIsModalOpen(true);
  };

  const handleMarkCompleted = async (apt: Appointment) => {
    const confirmed = await showConfirm({
      title: "Marquer comme terminé",
      message: `Marquer le rendez-vous de ${apt.clientName} comme terminé ?`,
      type: "confirm",
      confirmText: "Terminé",
      cancelText: "Annuler"
    });

    if (!confirmed) return;

    try {
      console.log('🔄 Mise à jour du statut:', apt.id, 'vers', AppointmentStatus.COMPLETED);
      await dbService.updateAppointment(apt.id, { statut: AppointmentStatus.COMPLETED });
      await loadData();
      showAlert({
        title: "Succès",
        message: "Le rendez-vous a été marqué comme terminé",
        type: "success"
      });
    } catch (err: any) {
      console.error('❌ Erreur mise à jour statut:', err);
      showAlert({
        title: "Erreur",
        message: "Erreur lors de la mise à jour du statut: " + (err.message || err),
        type: "error"
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApt) {
        try {
            await dbService.updateAppointment(editingApt.id, formData);
            setIsModalOpen(false);
            await loadData();
            showAlert({
              title: "Succès",
              message: "Le rendez-vous a été modifié",
              type: "success"
            });
        } catch(err: any) {
            showAlert({
              title: "Erreur",
              message: "Erreur: " + (err.message || "Erreur lors de la modification"),
              type: "error"
            });
        }
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des Rendez-vous</h1>
          <p className="text-slate-500">Vue administrative pour les employés</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
             <div className="p-8 text-center text-slate-500">Chargement...</div>
        ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Aucun rendez-vous planifié.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Heure</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Véhicule</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {appointments.map(apt => (
                            <tr key={apt.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-slate-900">{apt.date}</div>
                                    <div className="text-sm text-indigo-600">{apt.time}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{apt.clientName}</div>
                                    <div className="text-sm text-slate-500">{apt.clientEmail}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {apt.carBrand}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(apt.statut)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2 items-center flex-wrap">
                                        {apt.statut === AppointmentStatus.PENDING && (
                                            <button 
                                                onClick={() => handleMarkCompleted(apt)} 
                                                className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 rounded font-medium transition-colors shadow-sm"
                                                title="Marquer comme terminé"
                                            >
                                                ✓ Terminé
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleEdit(apt)} 
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Modifier
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(apt.id)} 
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modifier le rendez-vous"
      >
        <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Date</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border rounded"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Heure</label>
                    <select value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-3 py-2 border rounded">
                        {[8,9,10,11,12,13,14,15].map(h => <option key={h} value={`${h.toString().padStart(2,'0')}:00`}>{`${h.toString().padStart(2,'0')}:00`}</option>)}
                    </select>
                </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-slate-700">Nom</label>
                 <input value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full px-3 py-2 border rounded"/>
            </div>
            <div>
                 <label className="block text-sm font-medium text-slate-700">Voiture</label>
                 <input value={formData.carBrand} onChange={e => setFormData({...formData, carBrand: e.target.value})} className="w-full px-3 py-2 border rounded"/>
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Sauvegarder</button>
            </div>
        </form>
      </Modal>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        onConfirm={alertState.onConfirm}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
      />
    </div>
  );
};