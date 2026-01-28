'use client';

import { useState } from 'react';
import {
  Phone,
  PhoneCall,
  Loader2,
  CheckCircle,
  XCircle,
  Volume2,
  Mic,
  Bot,
  Zap,
  Clock,
  MessageCircle,
  ArrowRight,
  PlayCircle,
  User,
  FileText
} from 'lucide-react';
import { useNotifications } from '@/components/WhatsAppNotificationCenter';

// Numero verificado en Twilio para pruebas
const VERIFIED_TEST_NUMBER = '+34684094634';

// Estados de ejemplo para el CRM
const CRM_STATES = [
  { id: 'green', label: 'Interesado', color: 'bg-green-500', description: 'Cliente interesado, enviar follow-up' },
  { id: 'blue', label: 'Cita programada', color: 'bg-blue-500', description: 'Llamar en fecha/hora específica' },
  { id: 'orange', label: 'Llamar luego', color: 'bg-orange-500', description: 'Contactar más adelante' },
  { id: 'yellow', label: 'No contesta', color: 'bg-yellow-400', description: 'Sin respuesta' },
  { id: 'red', label: 'No interesado', color: 'bg-red-500', description: 'Descartar lead' },
];

export default function PruebaLlamadaPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; callSid?: string } | null>(null);
  const [leadName, setLeadName] = useState('Carlos García');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedCRMState, setSelectedCRMState] = useState<string | null>(null);
  const [callStep, setCallStep] = useState(0);

  const { sendWhatsApp, addNotification } = useNotifications();
  const [whatsAppNumber, setWhatsAppNumber] = useState('+34684094634');

  const sendWhatsAppNotification = async (name: string, useRealAPI: boolean = false) => {
    const message = `Hola ${name}, gracias por atender nuestra llamada. Como comentamos, podemos ayudarte a ahorrar hasta un 30% en tu factura de luz. ¿Te viene bien que te enviemos un estudio personalizado sin compromiso?`;

    if (useRealAPI) {
      // Envío REAL via Twilio API
      await sendWhatsApp(whatsAppNumber, message, name);
    } else {
      // Solo demo visual
      addNotification({
        type: 'whatsapp',
        title: 'Follow-Up Automático',
        message,
        leadName: name,
        phone: whatsAppNumber,
        status: 'sending',
      });
    }
  };

  const handleTestCall = async () => {
    setLoading(true);
    setResult(null);
    setCallStep(1);

    // Simular progreso de la llamada para demo
    setTimeout(() => setCallStep(2), 1500);
    setTimeout(() => setCallStep(3), 3000);
    setTimeout(() => {
      setCallStep(4);
      setSelectedCRMState('green');
    }, 4500);
    setTimeout(() => {
      setCallStep(5);
      sendWhatsAppNotification(leadName);
    }, 6000);

    try {
      const response = await fetch('/api/voice/outgoing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: VERIFIED_TEST_NUMBER,
          leadName: leadName || undefined,
          customMessage: customMessage || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Llamada iniciada correctamente a ${VERIFIED_TEST_NUMBER}`,
          callSid: data.callSid,
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Error al iniciar la llamada',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Error de conexion. Verifica que el servidor este funcionando.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestTTS = async () => {
    const text = customMessage || 'Hola, esto es una prueba del sistema de voz con ElevenLabs.';
    const audioUrl = `/api/voice/tts?text=${encodeURIComponent(text)}`;

    const audio = new Audio(audioUrl);
    audio.play().catch(err => {
      console.error('Error reproduciendo audio:', err);
      alert('Error reproduciendo audio. Verifica la API key de ElevenLabs.');
    });
  };

  const handleDemoFlow = (useRealWhatsApp: boolean = false) => {
    setCallStep(1);
    setSelectedCRMState(null);

    setTimeout(() => setCallStep(2), 1500);
    setTimeout(() => setCallStep(3), 3000);
    setTimeout(() => {
      setCallStep(4);
      setSelectedCRMState('green');
    }, 4500);
    setTimeout(() => {
      setCallStep(5);
      sendWhatsAppNotification(leadName, useRealWhatsApp);
    }, 6000);
  };

  const handleQuickWhatsApp = (useRealAPI: boolean = false) => {
    sendWhatsAppNotification(leadName, useRealAPI);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agente de Voz IA</h1>
          <p className="text-gray-500">Sistema de llamadas automatizadas con ElevenLabs + OpenAI</p>
        </div>
        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Activo
        </span>
      </div>

      {/* Demo Hero Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-emerald-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={24} />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Demostración en Vivo</span>
            </div>
            <h2 className="text-2xl font-bold mb-3">Agente de Voz con IA Conversacional</h2>
            <p className="text-white/80 mb-4">
              Nuestro agente realiza llamadas automatizadas con voz natural, resuelve objeciones
              y actualiza el CRM en tiempo real. Todo sin intervención humana.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleDemoFlow(false)}
                className="bg-white text-brand-primary px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <PlayCircle size={20} />
                Demo Visual
              </button>
              <button
                onClick={() => handleDemoFlow(true)}
                className="bg-green-500 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={20} />
                Enviar WhatsApp REAL
              </button>
              <div className="flex items-center gap-2 text-white/80">
                <Clock size={16} />
                <span className="text-sm">Twilio API</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-center">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center animate-pulse-ring">
              <PhoneCall size={48} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Flow Progress */}
      {callStep > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-fade-in">
          <h3 className="font-semibold text-gray-800 mb-4">Flujo de la Llamada</h3>
          <div className="flex items-center justify-between">
            {/* Step 1: Llamada */}
            <div className={`flex flex-col items-center text-center transition-all ${callStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-colors ${callStep >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <Phone size={24} className={callStep >= 1 ? 'text-white' : 'text-gray-400'} />
              </div>
              <p className="text-sm font-medium text-gray-800">Llamando</p>
              <p className="text-xs text-gray-500">Iniciando conexión</p>
              {callStep === 1 && <Loader2 size={16} className="animate-spin text-blue-500 mt-1" />}
              {callStep > 1 && <CheckCircle size={16} className="text-green-500 mt-1" />}
            </div>

            <ArrowRight size={24} className={`text-gray-300 transition-colors ${callStep >= 2 ? 'text-green-500' : ''}`} />

            {/* Step 2: Conversación */}
            <div className={`flex flex-col items-center text-center transition-all ${callStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-colors ${callStep >= 2 ? 'bg-purple-500' : 'bg-gray-200'}`}>
                <Mic size={24} className={callStep >= 2 ? 'text-white' : 'text-gray-400'} />
              </div>
              <p className="text-sm font-medium text-gray-800">Conversando</p>
              <p className="text-xs text-gray-500">IA respondiendo</p>
              {callStep === 2 && <Loader2 size={16} className="animate-spin text-purple-500 mt-1" />}
              {callStep > 2 && <CheckCircle size={16} className="text-green-500 mt-1" />}
            </div>

            <ArrowRight size={24} className={`text-gray-300 transition-colors ${callStep >= 3 ? 'text-green-500' : ''}`} />

            {/* Step 3: Análisis */}
            <div className={`flex flex-col items-center text-center transition-all ${callStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-colors ${callStep >= 3 ? 'bg-amber-500' : 'bg-gray-200'}`}>
                <Bot size={24} className={callStep >= 3 ? 'text-white' : 'text-gray-400'} />
              </div>
              <p className="text-sm font-medium text-gray-800">Analizando</p>
              <p className="text-xs text-gray-500">Procesando respuesta</p>
              {callStep === 3 && <Loader2 size={16} className="animate-spin text-amber-500 mt-1" />}
              {callStep > 3 && <CheckCircle size={16} className="text-green-500 mt-1" />}
            </div>

            <ArrowRight size={24} className={`text-gray-300 transition-colors ${callStep >= 4 ? 'text-green-500' : ''}`} />

            {/* Step 4: CRM */}
            <div className={`flex flex-col items-center text-center transition-all ${callStep >= 4 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-colors ${callStep >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}>
                <FileText size={24} className={callStep >= 4 ? 'text-white' : 'text-gray-400'} />
              </div>
              <p className="text-sm font-medium text-gray-800">CRM Actualizado</p>
              <p className="text-xs text-gray-500">Estado: Interesado</p>
              {callStep === 4 && <Loader2 size={16} className="animate-spin text-green-500 mt-1" />}
              {callStep > 4 && <CheckCircle size={16} className="text-green-500 mt-1" />}
            </div>

            <ArrowRight size={24} className={`text-gray-300 transition-colors ${callStep >= 5 ? 'text-green-500' : ''}`} />

            {/* Step 5: WhatsApp */}
            <div className={`flex flex-col items-center text-center transition-all ${callStep >= 5 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-colors ${callStep >= 5 ? 'bg-green-600' : 'bg-gray-200'}`}>
                <MessageCircle size={24} className={callStep >= 5 ? 'text-white' : 'text-gray-400'} />
              </div>
              <p className="text-sm font-medium text-gray-800">Follow-Up</p>
              <p className="text-xs text-gray-500">WhatsApp enviado</p>
              {callStep >= 5 && <CheckCircle size={16} className="text-green-500 mt-1" />}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de prueba */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PhoneCall size={20} className="text-brand-primary" />
            Iniciar llamada de prueba
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numero de destino (verificado)
              </label>
              <input
                type="text"
                value={VERIFIED_TEST_NUMBER}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                Solo se pueden hacer llamadas a numeros verificados en Twilio
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del lead
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Nombre para personalizar el saludo"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp destino (para follow-up)
              </label>
              <input
                type="text"
                value={whatsAppNumber}
                onChange={(e) => setWhatsAppNumber(e.target.value)}
                placeholder="+34612345678"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Numero con prefijo internacional (ej: +34612345678)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje personalizado (opcional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Deja vacio para usar el script profesional..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTestCall}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  <>
                    <Phone size={20} />
                    Llamar ahora
                  </>
                )}
              </button>

              <button
                onClick={handleTestTTS}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Probar solo la voz (sin llamar)"
              >
                <Volume2 size={20} />
                Probar voz
              </button>
            </div>

            {result && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  result.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {result.success ? (
                  <CheckCircle className="text-green-600 shrink-0" size={20} />
                ) : (
                  <XCircle className="text-red-600 shrink-0" size={20} />
                )}
                <div>
                  <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                    {result.message}
                  </p>
                  {result.callSid && (
                    <p className="text-xs text-gray-500 mt-1">
                      Call SID: {result.callSid}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CRM Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-500" />
              Actualización CRM Automática
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              El agente actualiza el estado del lead según la respuesta obtenida:
            </p>
            <div className="space-y-2">
              {CRM_STATES.map((state) => (
                <div
                  key={state.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    selectedCRMState === state.id
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${state.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{state.label}</p>
                    <p className="text-xs text-gray-500">{state.description}</p>
                  </div>
                  {selectedCRMState === state.id && (
                    <CheckCircle size={20} className="text-green-500 animate-bounce-in" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Zap size={18} />
              Características del Agente
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} />
                Voz natural con ElevenLabs (Turbo v2.5)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} />
                Latencia de respuesta &lt; 500ms
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} />
                Resolución automática de objeciones
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} />
                Detección de interés y cierre
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} />
                Follow-up por WhatsApp automático
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
