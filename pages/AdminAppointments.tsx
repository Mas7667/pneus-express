import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { Appointment } from '../types';
import { Modal } from '../components/Modal';

export const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await dbService.getAppointments();
    setAppointments(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Annuler ce rendez-vous ?")) return;
    await dbService.deleteAppointment(id);
    loadData();
  };

  const handleEdit = (apt: Appointment) => {
    setEditingApt(apt);
    setFormData(apt);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApt) {
        try {
            await dbService.updateAppointment(editingApt.id, formData);
            setIsModalOpen(false);
            loadData();
        } catch(err: any) {
            alert("Erreur: " + err.message);
        }
    }
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleEdit(apt)} className="text-indigo-600 hover:text-indigo-900 mr-4">Modifier</button>
                                    <button onClick={() => handleDelete(apt.id)} className="text-red-600 hover:text-red-900">Annuler</button>
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
    </div>
  );
};