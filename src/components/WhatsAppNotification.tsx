'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, CheckCheck, Send } from 'lucide-react';

interface WhatsAppNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  phone: string;
  message: string;
  type: 'follow_up' | 'reminder' | 'appointment';
}

export function WhatsAppNotification({
  isOpen,
  onClose,
  leadName,
  phone,
  message,
  type
}: WhatsAppNotificationProps) {
  const [status, setStatus] = useState<'sending' | 'sent' | 'delivered' | 'read'>('sending');
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus('sending');
      setShowCheck(false);

      // Simular envío
      const timer1 = setTimeout(() => setStatus('sent'), 800);
      const timer2 = setTimeout(() => setStatus('delivered'), 1500);
      const timer3 = setTimeout(() => {
        setStatus('read');
        setShowCheck(true);
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const typeConfig = {
    follow_up: { label: 'Follow-Up Automático', color: 'bg-green-500' },
    reminder: { label: 'Recordatorio', color: 'bg-blue-500' },
    appointment: { label: 'Cita Programada', color: 'bg-purple-500' },
  };

  const statusConfig = {
    sending: { icon: '...', text: 'Enviando', color: 'text-gray-400' },
    sent: { icon: '✓', text: 'Enviado', color: 'text-gray-400' },
    delivered: { icon: '✓✓', text: 'Entregado', color: 'text-gray-400' },
    read: { icon: '✓✓', text: 'Leído', color: 'text-blue-500' },
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      {/* Notification Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className={`${typeConfig[type].color} px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{typeConfig[type].label}</p>
              <p className="text-white/80 text-xs">WhatsApp Business</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* WhatsApp Style Message */}
        <div className="bg-[#ECE5DD] p-4">
          {/* Contact Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">
                {leadName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{leadName}</p>
              <p className="text-gray-500 text-xs">{phone}</p>
            </div>
          </div>

          {/* Message Bubble */}
          <div className="bg-[#DCF8C6] rounded-lg p-3 ml-auto max-w-[90%] relative shadow-sm">
            <p className="text-gray-800 text-sm leading-relaxed">{message}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[10px] text-gray-500">
                {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={`text-xs ${statusConfig[status].color}`}>
                {status === 'read' || status === 'delivered' ? (
                  <CheckCheck size={14} className={status === 'read' ? 'text-blue-500' : 'text-gray-400'} />
                ) : status === 'sent' ? (
                  '✓'
                ) : (
                  <span className="animate-pulse">...</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status === 'sending' ? (
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              ) : status === 'read' ? (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              ) : (
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
              )}
              <span className={`text-xs font-medium ${statusConfig[status].color}`}>
                {statusConfig[status].text}
              </span>
            </div>
            {showCheck && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCheck size={14} />
                Mensaje recibido
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast de notificación pequeño
export function WhatsAppToast({
  message,
  leadName,
  onClose
}: {
  message: string;
  leadName: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-start gap-3 max-w-sm">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <MessageCircle size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">WhatsApp enviado a {leadName}</p>
          <p className="text-gray-500 text-xs truncate mt-0.5">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
