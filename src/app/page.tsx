'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Phone,
  MessageCircle,
  FileText,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Users,
  TrendingUp,
  Shield,
  Sparkles
} from 'lucide-react';

export default function DemoLandingPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  const features = [
    {
      icon: Phone,
      title: 'Agente de Voz IA',
      description: 'Llamadas automatizadas con voz natural. Latencia < 500ms. Resolución de objeciones en tiempo real.',
      color: 'bg-blue-500',
    },
    {
      icon: MessageCircle,
      title: 'Follow-Up WhatsApp',
      description: 'Mensajes automáticos post-llamada. Plantillas personalizadas. Tasa de apertura del 95%.',
      color: 'bg-green-500',
    },
    {
      icon: FileText,
      title: 'CRM Inteligente',
      description: 'Actualización automática de estados. Historial completo. Integración con tu sistema.',
      color: 'bg-purple-500',
    },
    {
      icon: Sparkles,
      title: 'Asistente IA',
      description: 'Chat interno con contexto del CRM. Respuestas instantáneas. Análisis de datos.',
      color: 'bg-amber-500',
    },
  ];

  const stats = [
    { value: '95%', label: 'Tasa de contacto' },
    { value: '<500ms', label: 'Latencia' },
    { value: '+35%', label: 'Conversión' },
    { value: '24/7', label: 'Disponibilidad' },
  ];

  const workflow = [
    { step: 1, title: 'Importa Leads', description: 'Carga tu base de datos de contactos' },
    { step: 2, title: 'Agente Llama', description: 'IA realiza llamadas con voz natural' },
    { step: 3, title: 'CRM Actualiza', description: 'Estados sincronizados automáticamente' },
    { step: 4, title: 'WhatsApp Follow-Up', description: 'Mensaje de seguimiento inmediato' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-800">EnergyVoice</span>
              <span className="text-brand-primary font-bold text-xl ml-1">AI</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/dashboard"
              className="bg-brand-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors"
            >
              Ver Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-emerald-600 to-teal-500" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
                <Zap size={16} className="text-yellow-300" />
                Solución para empresas energéticas
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Automatiza tus ventas con{' '}
                <span className="text-yellow-300">Agentes de Voz IA</span>
              </h1>

              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Aumenta tu capacidad de contacto, reduce costes operativos y mejora
                la conversión con nuestro sistema de llamadas automatizadas con IA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  <PlayCircle size={20} />
                  Explorar Demo
                </Link>
                <Link
                  href="/call-center/prueba"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Phone size={20} />
                  Probar Agente de Voz
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Todo lo que necesitas para escalar tus ventas
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Una plataforma completa que integra llamadas automáticas, WhatsApp y CRM
              para maximizar tu eficiencia comercial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Cómo funciona
            </h2>
            <p className="text-xl text-gray-500">
              Un flujo automatizado de principio a fin
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {workflow.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mb-3 text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 max-w-[150px]">{item.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <ArrowRight size={24} className="text-gray-300 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Beneficios para tu empresa energética
              </h2>
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, text: 'Aumenta la productividad del equipo comercial en un 300%' },
                  { icon: Clock, text: 'Reduce el tiempo de contacto de horas a segundos' },
                  { icon: Users, text: 'Escala sin necesidad de contratar más personal' },
                  { icon: Shield, text: 'Cumplimiento normativo y grabación de llamadas' },
                  { icon: Zap, text: 'Integración con tu CRM existente' },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon size={18} className="text-green-600" />
                    </div>
                    <p className="text-gray-700">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-primary to-emerald-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Solicita una demostración personalizada</h3>
              <p className="text-white/80 mb-6">
                Descubre cómo EnergyVoice AI puede transformar tu proceso de ventas
                con una demo adaptada a tu empresa.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre de tu empresa"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="email"
                  placeholder="Tu email corporativo"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="w-full bg-white text-brand-primary px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Solicitar Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Empieza a automatizar tus ventas hoy
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Explora todas las funcionalidades de nuestra plataforma con la demo interactiva
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-brand-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Acceder a la Demo
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <span className="font-semibold text-white">EnergyVoice AI</span>
            </div>
            <p className="text-sm">
              Demo MVP - Solución de agentes de voz para empresas energéticas
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span>Powered by ElevenLabs + OpenAI + Twilio</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
