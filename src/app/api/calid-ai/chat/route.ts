import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Datos mock para el contexto del CRM (modo demo)
function getCRMContext() {
  const today = new Date().toISOString().split('T')[0];

  return {
    summary: {
      totalLeads: 8,
      totalClients: 2,
      leadsThisMonth: 5,
      todayRemindersCount: 1,
      pendingRemindersCount: 3,
      expiringContractsCount: 0,
    },
    leads: {
      byStatus: {
        red: 1,
        yellow: 3,
        orange: 2,
        blue: 1,
        green: 1,
      },
      recent: [
        { name: 'Maria Garcia Lopez', phone: '612345678', email: 'maria@email.com', status: 'yellow', contactDate: '2024-01-15', notes: 'Interesada en cambio de tarifa' },
        { name: 'Antonio Martinez Ruiz', phone: '623456789', email: 'antonio@email.com', status: 'blue', contactDate: '2024-01-14', notes: 'Solicita estudio energetico' },
        { name: 'Carmen Fernandez', phone: '634567890', email: null, status: 'orange', contactDate: '2024-01-13', notes: 'Llamar la semana que viene' },
        { name: 'Jose Rodriguez', phone: '645678901', email: 'jose@email.com', status: 'green', contactDate: '2024-01-12', notes: 'Contrato firmado' },
        { name: 'Ana Sanchez', phone: '656789012', email: null, status: 'red', contactDate: '2024-01-11', notes: 'No le interesa' },
      ],
    },
    clients: {
      byStatus: {
        pending: 0,
        active: 2,
        signed: 0,
        cancelled: 0,
      },
      expiringContracts: [],
      recent: [
        { name: 'Jose Rodriguez Perez', phone: '645678901', status: 'active', provider: 'Iberdrola', signedDate: '2024-01-10' },
        { name: 'Laura Gomez Martinez', phone: '667890123', status: 'active', provider: 'Endesa', signedDate: '2024-01-05' },
      ],
    },
    studies: {
      total: 2,
      avgAnnualSavings: 285,
      byType: {
        withInvoice: 1,
        withoutInvoice: 1,
      },
    },
    reminders: {
      today: [
        { type: 'Llamada de seguimiento', clientName: 'Jose Rodriguez Perez', date: today },
      ],
      pending: [
        { type: 'Llamada de seguimiento', clientName: 'Jose Rodriguez Perez', date: today },
        { type: 'Revision de contrato', clientName: 'Laura Gomez Martinez', date: '2024-02-01' },
        { type: 'Enviar documentacion', clientName: 'Maria Garcia Lopez', date: '2024-02-05' },
      ],
    },
    referrals: {
      total: 2,
      pendingPayments: 1,
      totalRewardsPaid: 20,
      byStatus: {
        pending: 1,
        contacted: 0,
        signed: 1,
        rejected: 0,
      },
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key no configurada' },
        { status: 500 }
      );
    }

    // Obtener contexto del CRM (datos mock para demo)
    const crmContext = getCRMContext();

    // Construir el system prompt con el contexto
    const systemPrompt = `Eres CalidAI, el asistente inteligente de EnergyVoice AI Demo, una plataforma de demostracion para empresas de comercializacion de energia en España.

Tu rol es ayudar a los usuarios del CRM respondiendo preguntas sobre leads, clientes, estudios de energia, recordatorios y referidos.

NOTA: Estos son datos de demostracion, no datos reales.

DATOS ACTUALES DEL CRM (fecha: ${new Date().toLocaleDateString('es-ES')}):

📊 RESUMEN:
- Total leads: ${crmContext.summary.totalLeads}
- Total clientes: ${crmContext.summary.totalClients}
- Leads este mes: ${crmContext.summary.leadsThisMonth}
- Recordatorios hoy: ${crmContext.summary.todayRemindersCount}
- Recordatorios pendientes: ${crmContext.summary.pendingRemindersCount}
- Contratos por vencer (30 dias): ${crmContext.summary.expiringContractsCount}

👥 LEADS POR ESTADO:
- Rojo (no interesado): ${crmContext.leads.byStatus.red}
- Amarillo (pendiente): ${crmContext.leads.byStatus.yellow}
- Naranja (en proceso): ${crmContext.leads.byStatus.orange}
- Azul (interesado): ${crmContext.leads.byStatus.blue}
- Verde (convertido): ${crmContext.leads.byStatus.green}

LEADS RECIENTES:
${crmContext.leads.recent.map(l => `- ${l.name} (${l.phone}) - Estado: ${l.status} - Contacto: ${l.contactDate}`).join('\n')}

👤 CLIENTES POR ESTADO:
- Pendientes: ${crmContext.clients.byStatus.pending}
- Activos: ${crmContext.clients.byStatus.active}
- Firmados: ${crmContext.clients.byStatus.signed}
- Cancelados: ${crmContext.clients.byStatus.cancelled}

CONTRATOS POR VENCER:
${crmContext.clients.expiringContracts.length > 0 ? crmContext.clients.expiringContracts.map((c: { name: string; phone: string; provider?: string; contractEnd: string }) => `- ${c.name} (${c.phone}) - Vence: ${c.contractEnd} - Comercializadora: ${c.provider || 'N/A'}`).join('\n') : 'Ninguno en los proximos 30 dias'}

CLIENTES RECIENTES:
${crmContext.clients.recent.map(c => `- ${c.name} - Estado: ${c.status} - Comercializadora: ${c.provider || 'N/A'}`).join('\n')}

⚡ ESTUDIOS DE ENERGIA:
- Total estudios: ${crmContext.studies.total}
- Con factura: ${crmContext.studies.byType.withInvoice}
- Sin factura: ${crmContext.studies.byType.withoutInvoice}
- Ahorro anual promedio: ${crmContext.studies.avgAnnualSavings}€

🔔 RECORDATORIOS DE HOY:
${crmContext.reminders.today.map(r => `- ${r.type}: ${r.clientName}`).join('\n') || 'No hay recordatorios para hoy'}

PROXIMOS RECORDATORIOS PENDIENTES:
${crmContext.reminders.pending.map(r => `- ${r.date}: ${r.type} - ${r.clientName}`).join('\n') || 'No hay recordatorios pendientes'}

🎁 REFERIDOS:
- Total referidos: ${crmContext.referrals.total}
- Pendientes de pago: ${crmContext.referrals.pendingPayments}
- Total pagado en recompensas: ${crmContext.referrals.totalRewardsPaid}€
- Por estado: Pendientes: ${crmContext.referrals.byStatus.pending}, Contactados: ${crmContext.referrals.byStatus.contacted}, Firmados: ${crmContext.referrals.byStatus.signed}, Rechazados: ${crmContext.referrals.byStatus.rejected}

INSTRUCCIONES:
1. Responde siempre en español de España
2. Se conciso pero completo
3. Usa los datos del CRM para responder
4. Si te preguntan por algo que no esta en los datos, indica que no tienes esa informacion
5. Puedes dar recomendaciones basadas en los datos
6. Usa emojis moderadamente para hacer las respuestas mas visuales
7. Si detectas oportunidades de negocio o alertas, mencionalas proactivamente
8. Recuerda mencionar que es una demo si es relevante`;

    // Construir mensajes para OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: Message) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    // Llamar a OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI error:', errorData);
      throw new Error(errorData.error?.message || 'Error de OpenAI');
    }

    const data = await openaiResponse.json();
    const response = data.choices[0]?.message?.content || 'No pude generar una respuesta.';

    return NextResponse.json({ response });

  } catch (error) {
    console.error('[CalidAI] Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
