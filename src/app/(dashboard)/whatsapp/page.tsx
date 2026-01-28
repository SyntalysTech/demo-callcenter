'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Send,
  CheckCheck,
  User,
  Phone,
  Calendar,
  Zap,
  ArrowRight,
  PlayCircle,
  RefreshCw,
  Bell
} from 'lucide-react';
import { useNotifications } from '@/components/WhatsAppNotificationCenter';

// Datos demo de conversaciones
const demoConversations = [
  {
    id: '1',
    name: 'María García',
    phone: '+34 612 345 678',
    lastMessage: 'Perfecto, quedamos el jueves entonces',
    time: '10:32',
    unread: 0,
    status: 'read' as const,
    avatar: 'MG',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    phone: '+34 623 456 789',
    lastMessage: 'Me interesa la oferta de ahorro en luz',
    time: '09:15',
    unread: 2,
    status: 'delivered' as const,
    avatar: 'CR',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    phone: '+34 634 567 890',
    lastMessage: 'Gracias por la información',
    time: 'Ayer',
    unread: 0,
    status: 'read' as const,
    avatar: 'AM',
  },
  {
    id: '4',
    name: 'Pedro López',
    phone: '+34 645 678 901',
    lastMessage: 'Follow-up automático enviado',
    time: 'Ayer',
    unread: 0,
    status: 'sent' as const,
    avatar: 'PL',
  },
];

// Plantillas de mensajes automáticos
const messageTemplates = [
  {
    id: 'follow_up',
    name: 'Follow-Up Post-Llamada',
    message: 'Hola {nombre}, gracias por atender nuestra llamada. Como comentamos, podemos ayudarte a ahorrar hasta un 30% en tu factura de luz. ¿Te viene bien que te enviemos un estudio personalizado sin compromiso?',
    type: 'whatsapp' as const,
  },
  {
    id: 'reminder',
    name: 'Recordatorio de Cita',
    message: 'Hola {nombre}, te recordamos tu cita programada para mañana. Nuestro asesor te llamará a las {hora}. ¿Sigues disponible?',
    type: 'whatsapp' as const,
  },
  {
    id: 'appointment',
    name: 'Confirmación de Interés',
    message: 'Hola {nombre}, hemos recibido tu solicitud de información sobre ahorro energético. Un asesor se pondrá en contacto contigo en breve. ¡Gracias por confiar en nosotros!',
    type: 'whatsapp' as const,
  },
];

export default function WhatsAppPage() {
  const [selectedConversation, setSelectedConversation] = useState(demoConversations[0]);
  const [realWhatsAppNumber, setRealWhatsAppNumber] = useState('+34684094634');

  const { addNotification, sendWhatsApp } = useNotifications();

  const handleSendDemo = (template: typeof messageTemplates[0], useRealAPI: boolean = false) => {
    const message = template.message
      .replace('{nombre}', selectedConversation.name)
      .replace('{hora}', '10:00');

    if (useRealAPI) {
      // Envío REAL via Twilio
      sendWhatsApp(realWhatsAppNumber, message, selectedConversation.name);
    } else {
      // Solo demo visual
      addNotification({
        type: 'whatsapp',
        title: template.name,
        message: message,
        leadName: selectedConversation.name,
        phone: selectedConversation.phone,
        status: 'sending',
      });
    }
  };

  const handleSendMultiple = () => {
    // Solo demo visual para envío múltiple
    demoConversations.forEach((conv, index) => {
      setTimeout(() => {
        addNotification({
          type: 'whatsapp',
          title: 'Envío Masivo',
          message: `Hola ${conv.name}, tenemos una oferta especial de ahorro energético para ti. ¿Te interesa conocer más detalles?`,
          leadName: conv.name,
          phone: conv.phone,
          status: 'sending',
        });
      }, index * 1500);
    });
  };

  const handleSendRealToNumber = () => {
    const message = `Hola, gracias por tu interés en nuestros servicios de ahorro energético. Un asesor se pondrá en contacto contigo en breve.`;
    sendWhatsApp(realWhatsAppNumber, message, 'Cliente Demo');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">WhatsApp Follow-Up</h1>
          <p className="text-gray-500">Sistema de seguimiento automático post-llamada</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Conectado
          </span>
        </div>
      </div>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Demostración de Follow-Up Automático</h2>
            <p className="text-green-100 mb-4">
              Después de cada llamada, el sistema envía automáticamente un mensaje de WhatsApp
              para mantener el contacto con el cliente potencial.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleSendDemo(messageTemplates[0], false)}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-50 transition-colors"
              >
                <PlayCircle size={18} />
                Demo Visual
              </button>
              <button
                onClick={handleSendRealToNumber}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-50 transition-colors"
              >
                <Send size={18} />
                Enviar WhatsApp REAL
              </button>
              <button
                onClick={handleSendMultiple}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-white/30 transition-colors border border-white/30"
              >
                <Send size={18} />
                Demo masivo (4)
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={realWhatsAppNumber}
                  onChange={(e) => setRealWhatsAppNumber(e.target.value)}
                  placeholder="+34612345678"
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm w-48"
                />
                <span className="text-white/70 text-xs">Num. destino real</span>
              </div>
              <p className="text-white/60 text-xs max-w-md">
                <strong>Sandbox:</strong> El destinatario debe enviar primero &quot;join &lt;palabra&gt;&quot; a WhatsApp +14155238886 para recibir mensajes.
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center">
              <MessageCircle size={64} className="text-white/50" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Conversaciones Recientes</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {demoConversations.length} activas
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {demoConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                    selectedConversation.id === conv.id ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-semibold">{conv.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-800 truncate">{conv.name}</p>
                      <span className="text-xs text-gray-500">{conv.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {conv.status === 'read' && <CheckCheck size={14} className="text-blue-500" />}
                      {conv.status === 'delivered' && <CheckCheck size={14} className="text-gray-400" />}
                      {conv.status === 'sent' && <span className="text-gray-400 text-xs">✓</span>}
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Templates */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Send size={18} className="text-green-500" />
              Plantillas de Mensajes Automáticos
            </h3>
            <div className="space-y-4">
              {messageTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:bg-green-50/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">{template.name}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {template.message.replace('{nombre}', selectedConversation.name).replace('{hora}', '10:00')}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleSendDemo(template, false)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Demo
                      </button>
                      <button
                        onClick={() => handleSendDemo(template, true)}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Send size={14} />
                        Real
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Demo */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <RefreshCw size={18} className="text-blue-500" />
              Flujo de Follow-Up Automático
            </h3>
            <div className="flex items-center justify-between py-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Phone size={24} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">Llamada</p>
                <p className="text-xs text-gray-500">Agente IA llama</p>
              </div>

              <ArrowRight size={24} className="text-gray-300" />

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <User size={24} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">CRM Update</p>
                <p className="text-xs text-gray-500">Estado actualizado</p>
              </div>

              <ArrowRight size={24} className="text-gray-300" />

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <MessageCircle size={24} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">WhatsApp</p>
                <p className="text-xs text-gray-500">Follow-up enviado</p>
              </div>

              <ArrowRight size={24} className="text-gray-300" />

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <Calendar size={24} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">Programar</p>
                <p className="text-xs text-gray-500">Cita o callback</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-3xl font-bold text-green-600">95%</p>
              <p className="text-sm text-gray-500">Tasa de entrega</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">78%</p>
              <p className="text-sm text-gray-500">Tasa de lectura</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">+35%</p>
              <p className="text-sm text-gray-500">Conversión</p>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-start gap-3">
              <Bell size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Las notificaciones aparecen en la esquina superior derecha</p>
                <p className="text-sm text-green-700 mt-1">
                  Pulsa cualquier botón de &quot;Enviar&quot; o &quot;Probar&quot; para ver la simulación
                  del envío de WhatsApp con estados en tiempo real (enviando → enviado → entregado → leído).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
