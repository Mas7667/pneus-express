import React, { useState, useEffect } from 'react';
import { Tire, NewTire, TireType } from '../types';

interface TireFormProps {
  initialData?: Tire;
  onSubmit: (data: NewTire) => void;
  onCancel: () => void;
  loading: boolean;
}

export const TireForm: React.FC<TireFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState<NewTire>({
    brand: '',
    model: '',
    width: 205,
    ratio: 55,
    diameter: 16,
    price: 0,
    stock: 0,
    type: TireType.SUMMER,
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'width' || name === 'ratio' || name === 'diameter' || name === 'price' || name === 'stock' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Marque</label>
          <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Modèle</label>
          <input required name="model" value={formData.model} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Largeur</label>
          <input required type="number" name="width" value={formData.width} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Ratio</label>
          <input required type="number" name="ratio" value={formData.ratio} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Diamètre</label>
          <input required type="number" name="diameter" value={formData.diameter} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white">
            {Object.values(TireType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
          <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Prix ($)</label>
        <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div className="flex justify-end pt-4 space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
          Annuler
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  );
};