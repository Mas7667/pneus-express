import React, { useEffect, useState, useMemo } from 'react';
import { dbService } from '../services/db';
import { Tire, TireType, NewTire } from '../types';
import { TireCard } from '../components/TireCard';
import { Modal } from '../components/Modal';
import { TireForm } from '../components/TireForm';
import { AlertModal } from '../components/AlertModal';
import { useAlert } from '../hooks/useAlert';
import { useAuth } from '../contexts/AuthContext';

export const Inventory: React.FC = () => {
  const [tires, setTires] = useState<Tire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TireType | ''>('');

  const { alertState, showAlert, showConfirm, closeAlert } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTire, setEditingTire] = useState<Tire | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await dbService.getTires();
      setTires(data);
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTires = useMemo(() => {
    return tires.filter(tire => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        tire.brand.toLowerCase().includes(searchLower) ||
        tire.model.toLowerCase().includes(searchLower) ||
        tire.description.toLowerCase().includes(searchLower) ||
        `${tire.width}/${tire.ratio}R${tire.diameter}`.includes(searchTerm);
      
      const matchesType = filterType === '' || tire.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [tires, searchTerm, filterType]);

  const handleAdd = () => {
    setEditingTire(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (tire: Tire) => {
    setEditingTire(tire);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: "Confirmer la suppression",
      message: "Êtes-vous sûr de vouloir supprimer ce pneu ?",
      type: "confirm",
      confirmText: "Supprimer",
      cancelText: "Annuler"
    });
    
    if (!confirmed) return;
    
    try {
      await dbService.deleteTire(id);
      await loadData();
      showAlert({
        title: "Succès",
        message: "Le pneu a été supprimé avec succès",
        type: "success"
      });
    } catch (err) {
      showAlert({
        title: "Erreur",
        message: "Erreur lors de la suppression du pneu",
        type: "error"
      });
    }
  };

  const handleSubmit = async (data: NewTire) => {
    setIsSubmitting(true);
    try {
      if (editingTire) {
        await dbService.updateTire(editingTire.id, data);
        showAlert({
          title: "Succès",
          message: "Le pneu a été modifié avec succès",
          type: "success"
        });
      } else {
        await dbService.createTire(data);
        showAlert({
          title: "Succès",
          message: "Le pneu a été ajouté avec succès",
          type: "success"
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      showAlert({
        title: "Erreur",
        message: "Erreur lors de la sauvegarde du pneu",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {user && !isAdmin ? 'Catalogue de Pneus' : 'Inventaire'}
          </h1>
          <p className="text-slate-500">
            {user && !isAdmin ? 'Découvrez notre sélection de pneus' : 'Gérez votre stock de pneus'}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Ajouter un pneu
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Rechercher par marque, modèle ou dimension..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as TireType)}
          >
            <option value="">Tous les types</option>
            {Object.values(TireType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {(searchTerm || filterType) && (
          <div className="mt-3 text-sm text-slate-600">
            <span className="font-medium">{filteredTires.length}</span> résultat{filteredTires.length > 1 ? 's' : ''} trouvé{filteredTires.length > 1 ? 's' : ''}
            <button 
              onClick={() => { setSearchTerm(''); setFilterType(''); }}
              className="ml-3 text-orange-600 hover:text-orange-700 font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <>
          {filteredTires.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              Aucun résultat trouvé.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTires.map(tire => (
                <TireCard 
                  key={tire.id} 
                  tire={tire} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          )}
        </>
      )}

      {isAdmin && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title={editingTire ? "Modifier le pneu" : "Ajouter un nouveau pneu"}
        >
          <TireForm 
            initialData={editingTire}
            loading={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

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
