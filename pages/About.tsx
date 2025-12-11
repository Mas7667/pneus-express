import React, { useState } from 'react';
import { dbService } from '../services/db';
import { AlertModal } from '../components/AlertModal';
import { useAlert } from '../hooks/useAlert';

export const About: React.FC = () => {
  const { alertState, showAlert, showConfirm, closeAlert } = useAlert();

  const handleReset = async () => {
    const confirmed = await showConfirm({
      title: "Réinitialiser la base de données",
      message: "Cela effacera toutes les données locales et rechargera la page. Continuer ?",
      type: "warning",
      confirmText: "Réinitialiser",
      cancelText: "Annuler"
    });

    if (confirmed) {
      await dbService.reset();
      showAlert({
        title: "Information",
        message: "La base de données a été réinitialisée",
        type: "info"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="border-b border-slate-100 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">À Propos</h1>
          <p className="text-slate-500">Détails du projet et de l'environnement.</p>
        </div>

        {/* Partie 2: Environnement de développement */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Informations du projet</h2>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold w-32 inline-block">Application:</span> Pneus Express Manager</p>
              <p><span className="font-semibold w-32 inline-block">Version:</span> 1.0.0</p>
              <p><span className="font-semibold w-32 inline-block">Développeur:</span> Étudiant(e) en Programmation Avancée</p>
              <p><span className="font-semibold w-32 inline-block">Date:</span> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Environnement technique</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <li>React 18.2.0</li>
              <li>TypeScript 4.9+</li>
              <li>Tailwind CSS 3.4</li>
              <li>React Router Dom 6.22</li>
              <li>NodeJS 20.x (Environnement local)</li>
              <li>Vercel (Plateforme de déploiement)</li>
            </ul>
          </div>

          {/* Special request from user */}
          <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
            <h3 className="font-bold text-orange-800 mb-1">Note importante</h3>
            <p className="text-orange-900 italic">
              "J’ai fait le travail à 40% par l’IA"
            </p>
          </div>

          {/* <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-medium text-slate-800 mb-2">Actions de débogage</h3>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Réinitialiser la base de données
            </button>
            <p className="text-xs text-slate-400 mt-2">Utilisez ce bouton si l'application semble bloquée ou pour restaurer les données initiales.</p>
          </div> */}
        </section>
      </div>

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