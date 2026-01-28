'use client';

import { Lead, LeadNote, LeadStatus, Client, ClientStatus, EnergyStudy } from './types';

// Mock data for demo
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    full_name: 'María García López',
    phone: '+34612345678',
    email: 'maria.garcia@email.com',
    status: 'green',
    contact_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Interesada en reducir factura de luz. Tiene negocio propio.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: 'demo-user',
  },
  {
    id: '2',
    full_name: 'Carlos Rodríguez Martín',
    phone: '+34623456789',
    email: 'carlos.rodriguez@empresa.com',
    status: 'orange',
    contact_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Llamar el jueves a las 10:00. Tiene taller mecánico.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: 'demo-user',
  },
  {
    id: '3',
    full_name: 'Ana Martínez Sánchez',
    phone: '+34634567890',
    email: 'ana.martinez@gmail.com',
    status: 'yellow',
    contact_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: 'demo-user',
  },
  {
    id: '4',
    full_name: 'Pedro López Fernández',
    phone: '+34645678901',
    email: 'pedro.lopez@hotmail.com',
    status: 'red',
    contact_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'No tiene interés actualmente. Tiene contrato reciente.',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: 'demo-user',
  },
  {
    id: '5',
    full_name: 'Laura Díaz González',
    phone: '+34656789012',
    email: 'laura.diaz@empresa.es',
    status: 'green',
    contact_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Cliente convertido - Ahorro del 25%. Restaurante.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: 'demo-user',
  },
  {
    id: '6',
    full_name: 'Javier Ruiz Pérez',
    phone: '+34667890123',
    email: 'javier.ruiz@mail.com',
    status: 'blue',
    contact_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Cita programada para viernes 16:00. Quiere estudio personalizado.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: 'demo-user',
  },
  {
    id: '7',
    full_name: 'Carmen Navarro Gil',
    phone: '+34678901234',
    email: 'carmen.navarro@gmail.com',
    status: 'yellow',
    contact_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'No contesta. Reintentar mañana.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: 'demo-user',
  },
  {
    id: '8',
    full_name: 'Roberto Sánchez Moreno',
    phone: '+34689012345',
    email: null,
    status: 'orange',
    contact_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Llamar después de las 18:00. Trabaja hasta tarde.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: 'demo-user',
  },
];

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    lead_id: '5',
    energy_study_id: '1',
    full_name: 'Laura Díaz González',
    email: 'laura.diaz@empresa.es',
    phone: '+34656789012',
    address: 'Plaza España 8, Valencia',
    dni: '12345678A',
    signed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    contract_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    contract_end_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
    provider: 'iberdrola',
    monthly_cost: 300,
    total_savings_to_date: 450,
    status: 'signed',
    last_reminder_sent: null,
    next_reminder_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    referred_by_client_id: null,
    referral_bonus_paid: false,
    notes: 'Restaurante La Terraza - Muy satisfecha con el ahorro',
    assigned_to: 'demo-user',
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    lead_id: '9',
    energy_study_id: '2',
    full_name: 'Fernando Gómez Torres',
    email: 'fernando@gimnasio.com',
    phone: '+34678901234',
    address: 'Av. de la Constitución 45, Sevilla',
    dni: '87654321B',
    signed_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    contract_start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    contract_end_date: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
    provider: 'endesa',
    monthly_cost: 610,
    total_savings_to_date: 560,
    status: 'reminder_month2',
    last_reminder_sent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    next_reminder_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    referred_by_client_id: null,
    referral_bonus_paid: false,
    notes: 'Gimnasio FitLife - Alto consumo por climatización',
    assigned_to: 'demo-user',
  },
];

const MOCK_NOTES: LeadNote[] = [
  {
    id: '1',
    lead_id: '1',
    note: 'Primera llamada realizada. Muy interesada en conocer opciones de ahorro. Tiene panadería.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'demo-user',
  },
  {
    id: '2',
    lead_id: '1',
    note: 'Enviado WhatsApp con información del estudio. Responde que lo revisará.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'demo-user',
  },
  {
    id: '3',
    lead_id: '2',
    note: 'Contactado por WhatsApp. Prefiere que le llamemos el jueves por la mañana.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'demo-user',
  },
  {
    id: '4',
    lead_id: '6',
    note: 'Muy interesado. Quiere un estudio personalizado para su negocio.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'demo-user',
  },
];

const MOCK_STUDIES: EnergyStudy[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    lead_id: '5',
    created_by: 'demo-user',
    has_invoice: true,
    current_provider: 'naturgy',
    current_monthly_cost: 450,
    current_power_p1: 10,
    current_power_p2: 10,
    current_consumption_annual: 18000,
    new_provider: 'iberdrola',
    new_monthly_cost: 300,
    new_power_p1: 8,
    new_power_p2: 8,
    has_maintenance_insurance: false,
    maintenance_insurance_cost: null,
    has_pac_iberdrola: false,
    pac_cost: null,
    other_services: null,
    other_services_cost: null,
    monthly_savings: 150,
    annual_savings: 1800,
    contract_duration_months: 12,
    special_conditions: 'Precio fijo durante 12 meses',
    ai_generated: false,
    ai_error: null,
    pdf_url: null,
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    lead_id: '9',
    created_by: 'demo-user',
    has_invoice: true,
    current_provider: 'iberdrola',
    current_monthly_cost: 890,
    current_power_p1: 25,
    current_power_p2: 25,
    current_consumption_annual: 45000,
    new_provider: 'endesa',
    new_monthly_cost: 610,
    new_power_p1: 20,
    new_power_p2: 20,
    has_maintenance_insurance: true,
    maintenance_insurance_cost: 15,
    has_pac_iberdrola: false,
    pac_cost: null,
    other_services: 'Monitorización de consumos',
    other_services_cost: 10,
    monthly_savings: 280,
    annual_savings: 3360,
    contract_duration_months: 24,
    special_conditions: 'Descuento por consumo elevado',
    ai_generated: false,
    ai_error: null,
    pdf_url: null,
  },
];

// Reminders type for demo
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

const MOCK_REMINDERS: DemoReminder[] = [
  {
    id: '1',
    lead_id: '2',
    lead_name: 'Carlos Rodríguez Martín',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    note: 'Llamar para seguimiento - Tiene taller mecánico',
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    lead_id: '6',
    lead_name: 'Javier Ruiz Pérez',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '16:00',
    note: 'Cita para presentar estudio personalizado',
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    lead_id: '8',
    lead_name: 'Roberto Sánchez Moreno',
    date: new Date().toISOString().split('T')[0],
    time: '18:30',
    note: 'Llamar después del trabajo',
    completed: false,
    created_at: new Date().toISOString(),
  },
];

// Referrals type for demo
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

const MOCK_REFERRALS: DemoReferral[] = [
  {
    id: '1',
    referrer_name: 'Laura Díaz González',
    referrer_phone: '+34656789012',
    referred_name: 'Miguel Ángel Torres',
    referred_phone: '+34699123456',
    status: 'contacted',
    bonus_paid: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    referrer_name: 'Fernando Gómez Torres',
    referrer_phone: '+34678901234',
    referred_name: 'Patricia Vega Ruiz',
    referred_phone: '+34699234567',
    status: 'converted',
    bonus_paid: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Storage keys
const KEYS = {
  LEADS: 'demo_leads',
  CLIENTS: 'demo_clients',
  REMINDERS: 'demo_reminders',
  STUDIES: 'demo_studies',
  NOTES: 'demo_notes',
  REFERRALS: 'demo_referrals',
  INITIALIZED: 'demo_initialized',
};

// Initialize localStorage with mock data
export function initializeStorage() {
  if (typeof window === 'undefined') return;

  const initialized = localStorage.getItem(KEYS.INITIALIZED);
  if (!initialized) {
    localStorage.setItem(KEYS.LEADS, JSON.stringify(MOCK_LEADS));
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(MOCK_CLIENTS));
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(MOCK_REMINDERS));
    localStorage.setItem(KEYS.STUDIES, JSON.stringify(MOCK_STUDIES));
    localStorage.setItem(KEYS.NOTES, JSON.stringify(MOCK_NOTES));
    localStorage.setItem(KEYS.REFERRALS, JSON.stringify(MOCK_REFERRALS));
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  }
}

// Generic helpers
function getItems<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  initializeStorage();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function setItems<T>(key: string, items: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(items));
}

// LEADS
export function getLeads(): Lead[] {
  return getItems(KEYS.LEADS, MOCK_LEADS);
}

export function getLead(id: string): Lead | null {
  const leads = getLeads();
  return leads.find(l => l.id === id) || null;
}

export function createLead(lead: Partial<Lead>): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    id: Date.now().toString(),
    full_name: lead.full_name || '',
    phone: lead.phone || '',
    email: lead.email || null,
    status: lead.status || 'yellow',
    contact_date: lead.contact_date || new Date().toISOString(),
    notes: lead.notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: lead.assigned_to || 'demo-user',
  };
  leads.unshift(newLead);
  setItems(KEYS.LEADS, leads);
  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return null;

  leads[index] = { ...leads[index], ...updates, updated_at: new Date().toISOString() };
  setItems(KEYS.LEADS, leads);
  return leads[index];
}

export function deleteLead(id: string): boolean {
  const leads = getLeads();
  const filtered = leads.filter(l => l.id !== id);
  if (filtered.length === leads.length) return false;
  setItems(KEYS.LEADS, filtered);
  return true;
}

// CLIENTS
export function getClients(): Client[] {
  return getItems(KEYS.CLIENTS, MOCK_CLIENTS);
}

export function getClient(id: string): Client | null {
  const clients = getClients();
  return clients.find(c => c.id === id) || null;
}

export function createClient(client: Partial<Client>): Client {
  const clients = getClients();
  const newClient: Client = {
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    lead_id: client.lead_id || '',
    energy_study_id: client.energy_study_id || null,
    full_name: client.full_name || '',
    email: client.email || null,
    phone: client.phone || '',
    address: client.address || null,
    dni: client.dni || null,
    signed_at: client.signed_at || new Date().toISOString(),
    contract_start_date: client.contract_start_date || new Date().toISOString(),
    contract_end_date: client.contract_end_date || null,
    provider: client.provider || 'iberdrola',
    monthly_cost: client.monthly_cost || 0,
    total_savings_to_date: client.total_savings_to_date || 0,
    status: client.status || 'signed',
    last_reminder_sent: null,
    next_reminder_date: null,
    referred_by_client_id: null,
    referral_bonus_paid: false,
    notes: client.notes || null,
    assigned_to: client.assigned_to || 'demo-user',
  };
  clients.unshift(newClient);
  setItems(KEYS.CLIENTS, clients);
  return newClient;
}

// REMINDERS
export function getReminders(): DemoReminder[] {
  return getItems(KEYS.REMINDERS, MOCK_REMINDERS);
}

export function createReminder(reminder: Partial<DemoReminder>): DemoReminder {
  const reminders = getReminders();
  const newReminder: DemoReminder = {
    id: Date.now().toString(),
    lead_id: reminder.lead_id || '',
    lead_name: reminder.lead_name || '',
    date: reminder.date || new Date().toISOString().split('T')[0],
    time: reminder.time || '10:00',
    note: reminder.note || '',
    completed: false,
    created_at: new Date().toISOString(),
  };
  reminders.unshift(newReminder);
  setItems(KEYS.REMINDERS, reminders);
  return newReminder;
}

export function updateReminder(id: string, updates: Partial<DemoReminder>): DemoReminder | null {
  const reminders = getReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index === -1) return null;

  reminders[index] = { ...reminders[index], ...updates };
  setItems(KEYS.REMINDERS, reminders);
  return reminders[index];
}

export function deleteReminder(id: string): boolean {
  const reminders = getReminders();
  const filtered = reminders.filter(r => r.id !== id);
  if (filtered.length === reminders.length) return false;
  setItems(KEYS.REMINDERS, filtered);
  return true;
}

// STUDIES
export function getStudies(): EnergyStudy[] {
  return getItems(KEYS.STUDIES, MOCK_STUDIES);
}

export function getStudy(id: string): EnergyStudy | null {
  const studies = getStudies();
  return studies.find(s => s.id === id) || null;
}

// NOTES
export function getNotes(leadId?: string): LeadNote[] {
  const notes = getItems(KEYS.NOTES, MOCK_NOTES);
  if (leadId) {
    return notes.filter(n => n.lead_id === leadId);
  }
  return notes;
}

export function createNote(note: Partial<LeadNote>): LeadNote {
  const notes = getNotes();
  const newNote: LeadNote = {
    id: Date.now().toString(),
    lead_id: note.lead_id || '',
    note: note.note || '',
    created_at: new Date().toISOString(),
    created_by: note.created_by || 'demo-user',
  };
  notes.unshift(newNote);
  setItems(KEYS.NOTES, notes);
  return newNote;
}

export function deleteNote(id: string): boolean {
  const notes = getNotes();
  const filtered = notes.filter(n => n.id !== id);
  if (filtered.length === notes.length) return false;
  setItems(KEYS.NOTES, filtered);
  return true;
}

// REFERRALS
export function getReferrals(): DemoReferral[] {
  return getItems(KEYS.REFERRALS, MOCK_REFERRALS);
}

// STATS for dashboard
export function getStats() {
  const leads = getLeads();
  const clients = getClients();
  const reminders = getReminders();

  const today = new Date().toISOString().split('T')[0];
  const todayReminders = reminders.filter(r => r.date === today && !r.completed);

  return {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'yellow').length,
    interestedLeads: leads.filter(l => l.status === 'green' || l.status === 'blue').length,
    callbackLeads: leads.filter(l => l.status === 'orange').length,
    notInterestedLeads: leads.filter(l => l.status === 'red').length,
    totalClients: clients.length,
    pendingReminders: reminders.filter(r => !r.completed).length,
    todayReminders: todayReminders.length,
    totalSavings: clients.reduce((sum, c) => sum + (c.total_savings_to_date || 0), 0),
    monthlySavings: clients.reduce((sum, c) => sum + (c.monthly_cost ? c.monthly_cost * 0.25 : 0), 0),
    conversionRate: leads.length > 0 ? Math.round((clients.length / leads.length) * 100) : 0,
  };
}

// Reset to initial mock data
export function resetStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.INITIALIZED);
  localStorage.removeItem(KEYS.LEADS);
  localStorage.removeItem(KEYS.CLIENTS);
  localStorage.removeItem(KEYS.REMINDERS);
  localStorage.removeItem(KEYS.STUDIES);
  localStorage.removeItem(KEYS.NOTES);
  localStorage.removeItem(KEYS.REFERRALS);
  initializeStorage();
}
