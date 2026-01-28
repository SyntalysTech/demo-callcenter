'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { X, MessageCircle, CheckCheck, Phone, Bell, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'whatsapp' | 'call' | 'crm';
  title: string;
  message: string;
  leadName: string;
  phone: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  error?: string;
  messageSid?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  sendWhatsApp: (to: string, message: string, leadName: string) => Promise<void>;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Si es solo demo visual (sin API), simular estados
    if (notification.status === 'sending' && !notification.messageSid) {
      setTimeout(() => {
        setNotifications(prev =>
          prev.map(n => n.id === newNotification.id ? { ...n, status: 'sent' } : n)
        );
      }, 800);
      setTimeout(() => {
        setNotifications(prev =>
          prev.map(n => n.id === newNotification.id ? { ...n, status: 'delivered' } : n)
        );
      }, 1500);
      setTimeout(() => {
        setNotifications(prev =>
          prev.map(n => n.id === newNotification.id ? { ...n, status: 'read' } : n)
        );
      }, 3000);
    }

    return newNotification.id;
  };

  // Función para enviar WhatsApp REAL via API
  const sendWhatsApp = async (to: string, message: string, leadName: string) => {
    const notificationId = Math.random().toString(36).substr(2, 9);

    // Agregar notificación en estado "enviando"
    const newNotification: Notification = {
      id: notificationId,
      type: 'whatsapp',
      title: 'WhatsApp Follow-Up',
      message,
      leadName,
      phone: to,
      timestamp: new Date(),
      status: 'sending',
    };
    setNotifications(prev => [newNotification, ...prev]);

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message, leadName }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Actualizar a "enviado"
        setNotifications(prev =>
          prev.map(n => n.id === notificationId
            ? { ...n, status: 'sent', messageSid: data.messageSid }
            : n
          )
        );

        // Simular "entregado" después de 2s
        setTimeout(() => {
          setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, status: 'delivered' } : n)
          );
        }, 2000);

        // Simular "leído" después de 4s
        setTimeout(() => {
          setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
          );
        }, 4000);

      } else {
        // Error
        setNotifications(prev =>
          prev.map(n => n.id === notificationId
            ? { ...n, status: 'failed', error: data.error }
            : n
          )
        );
      }
    } catch (error: any) {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId
          ? { ...n, status: 'failed', error: error.message }
          : n
        )
      );
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, sendWhatsApp, removeNotification, clearAll }}>
      {children}
      <NotificationToasts notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
}

function NotificationToasts({
  notifications,
  onRemove
}: {
  notifications: Notification[];
  onRemove: (id: string) => void;
}) {
  const visibleNotifications = notifications.slice(0, 3);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-96">
      {visibleNotifications.map((notification, index) => (
        <WhatsAppToastNotification
          key={notification.id}
          notification={notification}
          onClose={() => onRemove(notification.id)}
          delay={index * 100}
        />
      ))}
    </div>
  );
}

function WhatsAppToastNotification({
  notification,
  onClose,
  delay = 0
}: {
  notification: Notification;
  onClose: () => void;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), delay);
    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [delay, onClose]);

  const statusConfig = {
    sending: { text: 'Enviando...', color: 'text-gray-400', bgColor: 'bg-yellow-400' },
    sent: { text: 'Enviado', color: 'text-gray-400', bgColor: 'bg-blue-400' },
    delivered: { text: 'Entregado', color: 'text-gray-400', bgColor: 'bg-blue-400' },
    read: { text: 'Leído', color: 'text-blue-500', bgColor: 'bg-green-500' },
    failed: { text: 'Error', color: 'text-red-500', bgColor: 'bg-red-500' },
  };

  const config = {
    whatsapp: { icon: MessageCircle, color: 'bg-green-500', label: 'WhatsApp' },
    call: { icon: Phone, color: 'bg-blue-500', label: 'Llamada' },
    crm: { icon: Bell, color: 'bg-purple-500', label: 'CRM' },
  }[notification.type];

  const status = statusConfig[notification.status];

  if (!isVisible) return null;

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      {/* Header */}
      <div className={`${notification.status === 'failed' ? 'bg-red-500' : config.color} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            {notification.status === 'failed' ? (
              <AlertCircle size={16} className="text-white" />
            ) : (
              <config.icon size={16} className="text-white" />
            )}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{notification.title}</p>
            <p className="text-white/70 text-xs">
              {notification.status === 'failed' ? 'Error de envío' : 'Twilio WhatsApp API'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="bg-[#ECE5DD] p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold text-sm">
              {notification.leadName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{notification.leadName}</p>
            <p className="text-gray-500 text-xs">{notification.phone}</p>
          </div>
        </div>

        {/* Bubble */}
        <div className={`${notification.status === 'failed' ? 'bg-red-100' : 'bg-[#DCF8C6]'} rounded-lg p-3 shadow-sm ml-4`}>
          <p className="text-gray-800 text-sm leading-relaxed">{notification.message}</p>
          {notification.error && (
            <p className="text-red-600 text-xs mt-2 font-medium">{notification.error}</p>
          )}
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-[10px] text-gray-500">
              {notification.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className={`text-xs ${status.color} font-medium`}>
              {notification.status === 'failed' ? (
                <AlertCircle size={14} className="text-red-500" />
              ) : notification.status === 'read' || notification.status === 'delivered' ? (
                <CheckCheck size={14} className={notification.status === 'read' ? 'text-blue-500' : 'text-gray-400'} />
              ) : notification.status === 'sent' ? (
                '✓'
              ) : (
                <span className="animate-pulse">...</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.bgColor} ${notification.status === 'sending' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-medium ${status.color}`}>{status.text}</span>
        </div>
        {notification.messageSid && (
          <span className="text-[10px] text-gray-400 font-mono">
            {notification.messageSid.slice(0, 12)}...
          </span>
        )}
        {notification.status === 'read' && (
          <span className="text-xs text-green-600 font-medium">Mensaje leído</span>
        )}
      </div>
    </div>
  );
}

export function NotificationPanel() {
  const { notifications, clearAll } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay notificaciones</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="p-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          {notifications.length} notificaciones
        </span>
        <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600">
          Limpiar todo
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {notifications.map(notification => (
          <div key={notification.id} className="p-3 hover:bg-gray-50">
            <div className="flex items-start gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                notification.status === 'failed' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {notification.status === 'failed' ? (
                  <AlertCircle size={14} className="text-red-600" />
                ) : (
                  <MessageCircle size={14} className="text-green-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {notification.leadName}
                </p>
                <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.timestamp.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {notification.status === 'read' && (
                <CheckCheck size={14} className="text-blue-500" />
              )}
              {notification.status === 'failed' && (
                <AlertCircle size={14} className="text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
