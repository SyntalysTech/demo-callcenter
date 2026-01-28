import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, message, leadName } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Se requiere número de destino y mensaje' },
        { status: 400 }
      );
    }

    // Obtener credenciales
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

    if (!accountSid || !authToken) {
      console.error('Faltan credenciales de Twilio:', { accountSid: !!accountSid, authToken: !!authToken });
      return NextResponse.json(
        { error: 'Credenciales de Twilio no configuradas' },
        { status: 500 }
      );
    }

    // Importar y crear cliente Twilio dentro del handler
    const twilio = (await import('twilio')).default;
    const client = twilio(accountSid, authToken);

    // Formatear número para WhatsApp - asegurar formato E.164
    let formattedTo = to.replace(/\s/g, '').replace(/-/g, '').replace(/[()]/g, '');

    // Si no tiene código de país, asumir España
    if (!formattedTo.startsWith('+') && !formattedTo.startsWith('whatsapp:')) {
      formattedTo = '+34' + formattedTo;
    }

    // Agregar prefijo whatsapp:
    if (!formattedTo.startsWith('whatsapp:')) {
      formattedTo = `whatsapp:${formattedTo}`;
    }

    console.log('Enviando WhatsApp:', {
      from: twilioWhatsAppNumber,
      to: formattedTo,
      messageLength: message.length,
    });

    // Enviar mensaje de WhatsApp via Twilio
    const twilioMessage = await client.messages.create({
      body: message,
      from: twilioWhatsAppNumber,
      to: formattedTo,
    });

    console.log('WhatsApp enviado:', {
      sid: twilioMessage.sid,
      to: formattedTo,
      status: twilioMessage.status,
    });

    return NextResponse.json({
      success: true,
      messageSid: twilioMessage.sid,
      status: twilioMessage.status,
      to: formattedTo,
      leadName,
    });

  } catch (error: any) {
    console.error('Error enviando WhatsApp:', error);

    // Mensajes de error más descriptivos para errores comunes de Twilio
    let errorMessage = error.message || 'Error al enviar WhatsApp';

    if (error.code === 21608 || error.message?.includes('not a valid WhatsApp')) {
      errorMessage = 'El número de destino no está registrado en WhatsApp o no ha aceptado el sandbox. El destinatario debe enviar "join <palabra>" al +14155238886';
    } else if (error.code === 21211) {
      errorMessage = 'Número de teléfono inválido. Verifica el formato (+34XXXXXXXXX)';
    } else if (error.code === 21614) {
      errorMessage = 'Número de destino no es válido para WhatsApp';
    } else if (error.code === 63007) {
      errorMessage = 'El destinatario no ha aceptado los mensajes del sandbox de Twilio. Debe enviar "join <palabra>" a WhatsApp: +14155238886';
    } else if (error.message?.includes('not match')) {
      errorMessage = 'Formato de número inválido. Asegúrate de incluir el código de país (+34 para España)';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        code: error.code,
        details: error.moreInfo,
        originalError: error.message
      },
      { status: 500 }
    );
  }
}

// Webhook para recibir actualizaciones de estado
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Verificación del webhook de Twilio
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ status: 'WhatsApp API ready' });
}
