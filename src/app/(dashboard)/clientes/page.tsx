'use client';

import { useState, useEffect } from 'react';
import { getClients, createClient as createClientStorage } from '@/lib/localStorage';
import { Client, ClientStatus, CLIENT_STATUS_CONFIG, ENERGY_PROVIDERS, EnergyProvider } from '@/lib/types';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Plus,
  Search,
  UserCheck,
  Euro,
  TrendingDown,
  Clock,
  Phone,
  Mail,
  FileText,
  Bell,
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    setLoading(true);
    const data = getClients();
    setClients(data);
    setLoading(false);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clients.length,
    signed: clients.filter(c => c.status === 'signed' || c.status.startsWith('reminder_')).length,
    pendingReminders: clients.filter(c =>
      c.next_reminder_date && new Date(c.next_reminder_date) <= new Date()
    ).length,
    renewalPending: clients.filter(c => c.status === 'reminder_month12').length,
    totalSavings: clients.reduce((sum, c) => sum + (c.total_savings_to_date || 0), 0),
  };

  const getDaysUntilRenewal = (client: Client) => {
    if (!client.contract_end_date) return null;
    return differenceInDays(new Date(client.contract_end_date), new Date());
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500">Gestiona tus clientes firmados y su seguimiento</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition"
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clientes</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Contratos Activos</p>
              <p className="text-xl font-bold text-gray-900">{stats.signed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Bell size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Recordatorios Hoy</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pendingReminders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Renovaciones</p>
              <p className="text-xl font-bold text-orange-600">{stats.renewalPending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingDown size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ahorro Generado</p>
              <p className="text-xl font-bold text-emerald-600">{stats.totalSavings.toFixed(0)}€</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(CLIENT_STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando clientes...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center">
            <UserCheck size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No hay clientes todavía</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition"
            >
              Añadir primer cliente
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client) => {
              const statusConfig = CLIENT_STATUS_CONFIG[client.status as ClientStatus];
              const daysUntilRenewal = getDaysUntilRenewal(client);

              return (
                <Link
                  key={client.id}
                  href={`/clientes/${client.id}`}
                  className="block p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <UserCheck size={24} className="text-brand-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{client.full_name}</h3>
                          {statusConfig && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {client.phone}
                          </span>
                          {client.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={14} />
                              {client.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Compañía</p>
                        <p className="font-medium text-gray-900">
                          {ENERGY_PROVIDERS[client.provider as EnergyProvider]}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">Mensual</p>
                        <p className="font-medium text-gray-900">{client.monthly_cost?.toFixed(0)}€</p>
                      </div>

                      {client.total_savings_to_date > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Ahorro total</p>
                          <p className="font-medium text-emerald-600">
                            {client.total_savings_to_date.toFixed(0)}€
                          </p>
                        </div>
                      )}

                      {daysUntilRenewal !== null && daysUntilRenewal <= 30 && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Renovación</p>
                          <p className={`font-medium ${daysUntilRenewal <= 7 ? 'text-red-600' : 'text-orange-600'}`}>
                            {daysUntilRenewal} días
                          </p>
                        </div>
                      )}

                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateClientModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            loadClients();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function CreateClientModal({
  onClose,
  onCreated
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    dni: '',
    provider: 'endesa' as EnergyProvider,
    monthly_cost: '',
    signed_at: new Date().toISOString().split('T')[0],
    contract_duration_months: '12',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const contractEndDate = new Date(formData.signed_at);
    contractEndDate.setMonth(contractEndDate.getMonth() + parseInt(formData.contract_duration_months));

    createClientStorage({
      full_name: formData.full_name,
      email: formData.email || null,
      phone: formData.phone,
      address: formData.address || null,
      dni: formData.dni || null,
      provider: formData.provider,
      monthly_cost: parseFloat(formData.monthly_cost) || 0,
      signed_at: new Date(formData.signed_at).toISOString(),
      contract_start_date: formData.signed_at,
      contract_end_date: contractEndDate.toISOString().split('T')[0],
      status: 'signed',
      notes: formData.notes || null,
    });

    setLoading(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nuevo Cliente</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compañía *</label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value as EnergyProvider })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                {Object.entries(ENERGY_PROVIDERS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coste mensual (€) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.monthly_cost}
                onChange={(e) => setFormData({ ...formData, monthly_cost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha firma *</label>
              <input
                type="date"
                value={formData.signed_at}
                onChange={(e) => setFormData({ ...formData, signed_at: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración contrato</label>
              <select
                value={formData.contract_duration_months}
                onChange={(e) => setFormData({ ...formData, contract_duration_months: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="6">6 meses</option>
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
