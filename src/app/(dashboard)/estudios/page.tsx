'use client';

import { useState, useEffect } from 'react';
import { getStudies, getClients } from '@/lib/localStorage';
import { EnergyStudy, ENERGY_PROVIDERS, EnergyProvider } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  FileText,
  TrendingDown,
  Euro,
  Zap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function EstudiosPage() {
  const [studies, setStudies] = useState<EnergyStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getStudies();
    setStudies(data);
    setLoading(false);
  }, []);

  const stats = {
    total: studies.length,
    totalSavings: studies.reduce((sum, s) => sum + (s.annual_savings || 0), 0),
    avgSavingsPercent: studies.length > 0
      ? Math.round(studies.reduce((sum, s) => sum + (s.monthly_savings / (s.current_monthly_cost || 1) * 100), 0) / studies.length)
      : 0,
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudios Energéticos</h1>
          <p className="text-gray-500">Análisis de ahorro para clientes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Estudios</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Euro size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ahorro Anual Total</p>
              <p className="text-xl font-bold text-green-600">{stats.totalSavings.toFixed(0)}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingDown size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ahorro Promedio</p>
              <p className="text-xl font-bold text-purple-600">{stats.avgSavingsPercent}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Studies List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Lista de Estudios</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando estudios...</div>
        ) : studies.length === 0 ? (
          <div className="p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No hay estudios todavía</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {studies.map((study) => (
              <Link
                key={study.id}
                href={`/estudios/${study.id}`}
                className="block p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                      <Zap size={24} className="text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Estudio #{study.id}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>
                          {study.current_provider && ENERGY_PROVIDERS[study.current_provider]}
                          {' → '}
                          {ENERGY_PROVIDERS[study.new_provider]}
                        </span>
                        <span>
                          {format(new Date(study.created_at), "d MMM yyyy", { locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Antes</p>
                      <p className="font-medium text-gray-900">{study.current_monthly_cost}€/mes</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Después</p>
                      <p className="font-medium text-gray-900">{study.new_monthly_cost}€/mes</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Ahorro</p>
                      <p className="font-medium text-green-600">{study.monthly_savings}€/mes</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Anual</p>
                      <p className="font-bold text-green-600">{study.annual_savings}€</p>
                    </div>

                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
