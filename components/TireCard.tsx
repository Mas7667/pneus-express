import React from 'react';
import { Tire, TireType } from '../types';

interface TireCardProps {
  tire: Tire;
  onEdit: (tire: Tire) => void;
  onDelete: (id: string) => void;
}

const getTypeColor = (type: TireType) => {
  switch (type) {
    case TireType.WINTER: return 'bg-blue-100 text-blue-800 border-blue-200';
    case TireType.SUMMER: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case TireType.PERFORMANCE: return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-green-100 text-green-800 border-green-200';
  }
};

export const TireCard: React.FC<TireCardProps> = ({ tire, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="h-40 bg-slate-100 relative overflow-hidden group">
        <img 
          src={tire.imageUrl || `https://picsum.photos/seed/${tire.id}/400/300`} 
          alt={`${tire.brand} ${tire.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(tire.type)}`}>
            {tire.type}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">{tire.brand}</h3>
            <p className="text-slate-500 font-medium">{tire.model}</p>
          </div>
          <span className="text-xl font-bold text-slate-900">{tire.price.toFixed(2)} $</span>
        </div>

        <div className="text-sm text-slate-600 mb-4 bg-slate-50 p-2 rounded border border-slate-100">
           <span className="font-mono">{tire.width}/{tire.ratio} R{tire.diameter}</span>
        </div>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{tire.description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <span className={`text-xs font-medium px-2 py-1 rounded ${tire.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            Stock: {tire.stock}
          </span>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => onEdit(tire)}
              className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors"
            >
              Modifier
            </button>
            <button 
              onClick={() => onDelete(tire.id)}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};