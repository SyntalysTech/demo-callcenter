'use client';

import { useEffect, useState } from 'react';
import { STATUS_CONFIG, type LeadStatus, type Lead } from '@/lib/types';
import { getLeads, getStats, getClients, getReminders } from '@/lib/localStorage';
import { Users, UserPlus, TrendingUp, Calendar, DollarSign, Bell, Zap } from 'lucide-react';
import Link from 'next/link';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new7days: 0,
    byStatus: { red: 0, yellow: 0, orange: 0, blue: 0, green: 0 } as Record<LeadStatus, number>,
    recentLeads: [] as Lead[],
    totalClients: 0,
    totalSavings: 0,
    pendingReminders: 0,
  });

  useEffect(() => {
    const allLeads = getLeads();
    const globalStats = getStats();
    const clients = getClients();
    const reminders = getReminders();

    const sevenDaysAgo = subDays(new Date(), 7);
    const new7days = allLeads.filter(l => new Date(l.created_at) >= sevenDaysAgo).length;

    const byStatus: Record<LeadStatus, number> = {
      red: 0,
      yellow: 0,
      orange: 0,
      blue: 0,
      green: 0,
    };

    allLeads.forEach(lead => {
      if (lead.status in byStatus) {
        byStatus[lead.status as LeadStatus]++;
      }
    });

    const recentLeads = [...allLeads]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    setLeads(allLeads);
    setStats({
      total: allLeads.length,
      new7days,
      byStatus,
      recentLeads,
      totalClients: clients.length,
      totalSavings: globalStats.totalSavings,
      pendingReminders: reminders.filter(r => !r.completed).length,
    });
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Resumen de actividad del CRM</p>
        </div>
        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
          <Zap size={16} />
          Modo Demo - LocalStorage
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 rounded-lg">
              <Users className="text-brand-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserPlus className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nuevos (7 días)</p>
              <p className="text-2xl font-bold text-gray-800">{stats.new7days}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Clientes Activos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ahorro Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSavings}€</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Leads por Estado</h2>
          <div className="space-y-3">
            {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((status) => (
              <Link
                key={status}
                href={"/leads?status=" + status}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={"w-4 h-4 rounded-full " + STATUS_CONFIG[status].bgColor} />
                  <span className="text-gray-700">{STATUS_CONFIG[status].label}</span>
                </div>
                <span className="font-semibold text-gray-800">{stats.byStatus[status]}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Últimos Leads</h2>
            <Link href="/leads" className="text-brand-primary hover:underline text-sm">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentLeads.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay leads todavía</p>
            ) : (
              stats.recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={"/leads/" + lead.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{lead.full_name}</p>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={"w-3 h-3 rounded-full " + STATUS_CONFIG[lead.status as LeadStatus].bgColor} />
                    <span className="text-sm text-gray-500">
                      {format(new Date(lead.created_at), 'dd MMM', { locale: es })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recordatorios</h2>
            <Link href="/recordatorios" className="text-brand-primary hover:underline text-sm">
              Ver todos
            </Link>
          </div>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="text-orange-600" size={28} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.pendingReminders}</p>
            <p className="text-gray-500">Pendientes</p>
          </div>
          <Link
            href="/recordatorios"
            className="block w-full text-center py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition font-medium"
          >
            Gestionar recordatorios
          </Link>
        </div>
      </div>
    </div>
  );
}
