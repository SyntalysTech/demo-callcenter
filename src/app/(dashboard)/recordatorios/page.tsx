'use client';

import { useState, useEffect } from 'react';
import { getReminders, updateReminder, getLeads } from '@/lib/localStorage';
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Bell,
  Calendar,
  Check,
  Phone,
  Clock,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  X,
  PhoneOff,
  CalendarClock
} from 'lucide-react';
import Link from 'next/link';

interface DemoReminder {
  id: string;
  lead_id: string;
  lead_name: string;
  date: string;
  time: string;
  note: string;
  completed: boolean;
  created_at: string;
}

export default function RecordatoriosPage() {
  const [reminders, setReminders] = useState<DemoReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'today' | 'week' | 'completed'>('pending');
  const [selectedReminder, setSelectedReminder] = useState<DemoReminder | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const data = getReminders();
    setReminders(data);
    setLoading(false);
  };

  const getFilteredReminders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekFromNow = addDays(today, 7);

    switch (filter) {
      case 'pending':
        return reminders.filter(r => !r.completed && isPast(new Date(r.date)));
      case 'today':
        return reminders.filter(r => !r.completed && isToday(new Date(r.date)));
      case 'week':
        return reminders.filter(r => {
          const date = new Date(r.date);
          return !r.completed && date >= today && date <= weekFromNow;
        });
      case 'completed':
        return reminders.filter(r => r.completed);
      default:
        return reminders;
    }
  };

  const filteredReminders = getFilteredReminders();

  const stats = {
    overdue: reminders.filter(r => !r.completed && isPast(new Date(r.date)) && !isToday(new Date(r.date))).length,
    today: reminders.filter(r => !r.completed && isToday(new Date(r.date))).length,
    tomorrow: reminders.filter(r => !r.completed && isTomorrow(new Date(r.date))).length,
    thisWeek: reminders.filter(r => {
      const date = new Date(r.date);
      return !r.completed && date >= new Date() && date <= addDays(new Date(), 7);
    }).length,
  };

  const handleMarkComplete = (reminder: DemoReminder) => {
    updateReminder(reminder.id, { completed: true });
    setSelectedReminder(null);
    loadData();
  };

  const handleReschedule = (reminder: DemoReminder, newDate: string) => {
    updateReminder(reminder.id, { date: newDate });
    setSelectedReminder(null);
    loadData();
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    if (isPast(date)) return 'Atrasado';
    return format(date, "d MMM", { locale: es });
  };

  const getDateColor = (dateStr: string, completed: boolean) => {
    if (completed) return 'text-gray-400';
    const date = new Date(dateStr);
    if (isPast(date) && !isToday(date)) return 'text-red-600';
    if (isToday(date)) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recordatorios</h1>
          <p className="text-gray-500">Gestiona los seguimientos de tus leads y clientes</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter('pending')}
          className={`bg-white rounded-xl shadow-sm p-4 text-left transition ${filter === 'pending' ? 'ring-2 ring-brand-primary' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Atrasados</p>
              <p className="text-xl font-bold text-red-600">{stats.overdue}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('today')}
          className={`bg-white rounded-xl shadow-sm p-4 text-left transition ${filter === 'today' ? 'ring-2 ring-brand-primary' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hoy</p>
              <p className="text-xl font-bold text-yellow-600">{stats.today}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('week')}
          className={`bg-white rounded-xl shadow-sm p-4 text-left transition ${filter === 'week' ? 'ring-2 ring-brand-primary' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Esta semana</p>
              <p className="text-xl font-bold text-blue-600">{stats.thisWeek}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`bg-white rounded-xl shadow-sm p-4 text-left transition ${filter === 'completed' ? 'ring-2 ring-brand-primary' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completados</p>
              <p className="text-xl font-bold text-green-600">
                {reminders.filter(r => r.completed).length}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            {filter === 'pending' && 'Recordatorios atrasados'}
            {filter === 'today' && 'Recordatorios de hoy'}
            {filter === 'week' && 'Recordatorios de esta semana'}
            {filter === 'completed' && 'Recordatorios completados'}
          </h2>
          <span className="text-sm text-gray-500">{filteredReminders.length} recordatorios</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando recordatorios...</div>
        ) : filteredReminders.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No hay recordatorios en esta categoría</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-4 hover:bg-gray-50 transition ${reminder.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Phone className="text-purple-500" size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{reminder.lead_name}</h3>
                        {reminder.completed && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-600 rounded-full">
                            Completado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{reminder.note}</p>
                      <p className="text-sm text-gray-400 mt-1">Hora: {reminder.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-medium ${getDateColor(reminder.date, reminder.completed)}`}>
                        {getDateLabel(reminder.date)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {format(new Date(reminder.date), "d MMM yyyy", { locale: es })}
                      </p>
                    </div>

                    {!reminder.completed && (
                      <button
                        onClick={() => setSelectedReminder(reminder)}
                        className="px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition text-sm"
                      >
                        Completar
                      </button>
                    )}

                    <Link
                      href={`/leads/${reminder.lead_id}`}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight size={20} className="text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complete Modal */}
      {selectedReminder && (
        <CompleteReminderModal
          reminder={selectedReminder}
          onClose={() => setSelectedReminder(null)}
          onComplete={handleMarkComplete}
          onReschedule={handleReschedule}
        />
      )}
    </div>
  );
}

function CompleteReminderModal({
  reminder,
  onClose,
  onComplete,
  onReschedule
}: {
  reminder: DemoReminder;
  onClose: () => void;
  onComplete: (reminder: DemoReminder) => void;
  onReschedule: (reminder: DemoReminder, newDate: string) => void;
}) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Completar Recordatorio</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-900">{reminder.lead_name}</p>
            <p className="text-sm text-gray-500">{reminder.note}</p>
            <p className="text-sm text-gray-400 mt-1">{reminder.time}</p>
          </div>

          {!showReschedule ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Resultado:</p>

              <button
                onClick={() => onComplete(reminder)}
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition"
              >
                <Phone size={20} className="text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Contactado</p>
                  <p className="text-sm text-gray-500">Se habló con el lead</p>
                </div>
              </button>

              <button
                onClick={() => onComplete(reminder)}
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition"
              >
                <PhoneOff size={20} className="text-yellow-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">No contestó</p>
                  <p className="text-sm text-gray-500">El lead no atendió</p>
                </div>
              </button>

              <button
                onClick={() => setShowReschedule(true)}
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
              >
                <CalendarClock size={20} className="text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Reprogramar</p>
                  <p className="text-sm text-gray-500">Cambiar fecha del recordatorio</p>
                </div>
              </button>

              <button
                onClick={() => onComplete(reminder)}
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
              >
                <Check size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Marcar completado</p>
                  <p className="text-sm text-gray-500">Sin más acciones</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva fecha</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReschedule(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => newDate && onReschedule(reminder, newDate)}
                  disabled={!newDate}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition disabled:opacity-50"
                >
                  Reprogramar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
