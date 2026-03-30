import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WHATSAPP_NUMBER = "5522992525529";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerName, customerEmail, orderNumber, items } = await req.json();

    if (!customerName || !customerEmail || !orderNumber || !items) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailUser || !gmailPass) {
      console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD secrets");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: gmailUser,
          password: gmailPass,
        },
      },
    });

    const typedItems = items as { brand: string; weight: string; quantity: number; price?: number }[];

    const formatBRL = (v: number) => v.toFixed(2).replace('.', ',');

    const totalValue = typedItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

    const itemsRows = typedItems
      .map(
        (i) =>
          `<tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #3a3a3a; color: #d4d4d4; font-size: 14px;">${i.brand}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #3a3a3a; color: #d4d4d4; font-size: 14px;">${i.weight}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #3a3a3a; color: #d4d4d4; font-size: 14px; text-align: center;">R$ ${i.price ? formatBRL(i.price) : '-'}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #3a3a3a; color: #f97316; font-size: 14px; font-weight: bold; text-align: center;">${i.quantity}x</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #3a3a3a; color: #d4d4d4; font-size: 14px; text-align: right;">R$ ${i.price ? formatBRL(i.price * i.quantity) : '-'}</td>
          </tr>`
      )
      .join("");

    const itemsText = typedItems
      .map((i) => `• ${i.quantity}x ${i.brand} ${i.weight} - R$ ${i.price ? formatBRL(i.price * i.quantity) : '-'}`)
      .join("\n");

    const whatsappMsg = encodeURIComponent(
      `*Pedido ${orderNumber} - Carvão Mascate*\n\nCliente: ${customerName}\n\n${itemsText}\n\nOlá! Gostaria de confirmar este pedido.`
    );

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #1a1a1a; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background-color: #2a2a2a; border-radius: 12px; padding: 40px 30px; text-align: center; }
    .logo-text { color: #f97316; font-size: 28px; font-weight: bold; margin-bottom: 8px; letter-spacing: 2px; }
    .subtitle { color: #a3a3a3; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 30px; }
    .greeting { color: #ffffff; font-size: 18px; margin-bottom: 10px; }
    .order-number { color: #f97316; font-size: 22px; font-weight: bold; margin-bottom: 25px; }
    .message { color: #d4d4d4; font-size: 14px; line-height: 1.6; margin-bottom: 25px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { padding: 10px 12px; text-align: left; color: #a3a3a3; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f97316; }
    .btn-whatsapp { display: inline-block; background-color: #25D366; color: #ffffff !important; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 32px; border-radius: 8px; }
    .btn-note { color: #a3a3a3; font-size: 12px; margin-top: 15px; }
    .footer { color: #737373; font-size: 11px; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo-text">MASCATE</div>
      <div class="subtitle">Carvão Artesanal</div>
      <div class="greeting">Olá, ${customerName}!</div>
      <div class="order-number">Pedido #${orderNumber}</div>
      <div class="message">Seu pedido foi registrado com sucesso! Confira o resumo abaixo:</div>
      <table>
        <thead>
          <tr>
            <th>Marca</th>
            <th>Peso</th>
            <th style="text-align: center;">Qtd</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
      <div class="message">Para confirmar seu pedido, envie a mensagem pelo WhatsApp clicando no botão abaixo:</div>
      <a href="${whatsappLink}" class="btn-whatsapp" target="_blank">✅ Confirmar Pedido via WhatsApp</a>
      <div class="btn-note">Caso já tenha confirmado pelo WhatsApp, desconsidere este botão.</div>
    </div>
    <div class="footer">
      Mascate Carvão Artesanal<br>
      Este é um email automático, não responda.
    </div>
  </div>
</body>
</html>`;

    await client.send({
      from: gmailUser,
      to: customerEmail,
      subject: `Pedido #${orderNumber} - Mascate Carvão`,
      content: "auto",
      html: htmlBody,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending order email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
