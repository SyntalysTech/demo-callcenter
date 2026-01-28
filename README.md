# EnergyVoice AI - Demo MVP

Solución de **Agentes de Voz con IA** para empresas del sector energético.

## Funcionalidades

### 1. Agente de Voz IA
- Llamadas automatizadas con voz natural (ElevenLabs Turbo v2.5)
- Latencia de respuesta < 500ms
- Resolución automática de objeciones
- Detección de interés y cierre de ventas

### 2. Follow-Up WhatsApp
- Mensajes automáticos post-llamada
- Plantillas personalizadas
- Tasa de entrega del 95%
- Simulación visual del envío

### 3. CRM Inteligente
- Actualización automática de estados:
  - **Verde**: Interesado / Cerrado
  - **Azul**: Cita programada
  - **Naranja**: Llamar luego
  - **Amarillo**: No contesta
  - **Rojo**: No interesado
- Historial de notas y actividad
- Gestión de leads y clientes

### 4. Asistente IA
- Chat con contexto del CRM
- Respuestas instantáneas sobre leads y métricas

## Stack Tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Voz**: ElevenLabs (TTS), OpenAI (STT + NLP), Twilio (Telefonía)
- **UI**: Lucide Icons, Custom Components

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ELEVENLABS_API_KEY=
OPENAI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx                 # Landing page demo
│   ├── (auth)/login/            # Autenticación
│   ├── (dashboard)/
│   │   ├── dashboard/           # Panel principal
│   │   ├── leads/               # Gestión de leads
│   │   ├── clientes/            # Gestión de clientes
│   │   ├── whatsapp/            # Follow-up WhatsApp
│   │   ├── call-center/         # Agente de voz
│   │   └── calid-ai/            # Asistente IA
│   └── api/
│       ├── voice/               # API del agente de voz
│       └── calid-ai/            # API del asistente
├── components/
│   ├── Sidebar.tsx              # Navegación
│   ├── WhatsAppNotification.tsx # Notificaciones visuales
│   └── StatusBadge.tsx          # Estados de leads
└── lib/
    ├── types.ts                 # Tipos TypeScript
    ├── api.ts                   # Funciones de datos
    └── supabase.ts              # Cliente Supabase
```

## Demo

La demo permite explorar todas las funcionalidades sin necesidad de configurar servicios externos:

1. **Landing Page** (`/`): Vista general de la solución
2. **Dashboard** (`/dashboard`): Métricas y KPIs
3. **Agente de Voz** (`/call-center/prueba`): Simulación del flujo de llamada
4. **WhatsApp** (`/whatsapp`): Demostración de follow-up automático

## Contacto

Para más información sobre implementación personalizada, contactar a través de la demo.

---

*Powered by ElevenLabs + OpenAI + Twilio*
