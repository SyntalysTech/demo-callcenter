'use client';

import { useState, useEffect } from 'react';
import { getReferrals } from '@/lib/localStorage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Users,
  Gift,
  CheckCircle,
  Clock,
  Euro,
  TrendingUp
} from 'lucide-react';

interface DemoReferral {
  id: string;
  referrer_name: string;
  referrer_phone: string;
  referred_name: string;
  referred_phone: string;
  status: 'pending' | 'contacted' | 'converted' | 'lost';
  bonus_paid: boolean;
  created_at: string;
}

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  contacted: { label: 'Contactado', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  converted: { label: 'Convertido', color: 'text-green-600', bgColor: 'bg-green-100' },
  lost: { label: 'Perdido', color: 'text-red-600', bgColor: 'bg-red-100' },
};

export default function ReferidosPage() {
  const [referrals, setReferrals] = useState<DemoReferral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getReferrals();
    setReferrals(data);
    setLoading(false);
  }, []);

  const stats = {
    total: referrals.length,
    converted: referrals.filter(r => r.status === 'converted').length,
    pending: referrals.filter(r => r.status === 'pending' || r.status === 'contacted').length,
    totalBonus: referrals.filter(r => r.bonus_paid).length * 20,
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programa de Referidos</h1>
          <p className="text-gray-500">20€ por cada cliente referido que firme contrato</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referidos</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Convertidos</p>
              <p className="text-xl font-bold text-green-600">{stats.converted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Euro size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bonus Pagados</p>
              <p className="text-xl font-bold text-emerald-600">{stats.totalBonus}€</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Gift size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Programa de Referidos</h2>
            <p className="text-purple-100 mt-1">
              Cada cliente que refiera a otra persona recibe 20€ cuando el referido firma contrato.
              Es una forma efectiva de crecer el negocio mediante recomendaciones.
            </p>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Lista de Referidos</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando referidos...</div>
        ) : referrals.length === 0 ? (
          <div className="p-8 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No hay referidos todavía</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {referrals.map((referral) => {
              const statusConfig = STATUS_CONFIG[referral.status];

              return (
                <div key={referral.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{referral.referred_name}</p>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                          {referral.bonus_paid && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-600">
                              Bonus pagado
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{referral.referred_phone}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Referido por: {referral.referrer_name} ({referral.referrer_phone})
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(referral.created_at), "d MMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
