import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerName, customerEmail, tempPassword } = await req.json();

    if (!customerName || !customerEmail || !tempPassword) {
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
    .greeting { color: #ffffff; font-size: 18px; margin-bottom: 20px; }
    .message { color: #d4d4d4; font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
    .password-box { background-color: #1a1a1a; border: 2px solid #f97316; border-radius: 8px; padding: 16px; margin: 20px auto; display: inline-block; }
    .password-text { color: #f97316; font-size: 28px; font-weight: bold; letter-spacing: 6px; font-family: monospace; }
    .warning { color: #a3a3a3; font-size: 12px; line-height: 1.5; margin-top: 20px; }
    .footer { color: #737373; font-size: 11px; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo-text">MASCATE</div>
      <div class="subtitle">Carvão Artesanal</div>
      <div class="greeting">Olá, ${customerName}! 🔑</div>
      <div class="message">
        Recebemos sua solicitação de recuperação de senha.<br>
        Sua nova senha temporária é:
      </div>
      <div class="password-box">
        <span class="password-text">${tempPassword}</span>
      </div>
      <div class="warning">
        Use esta senha para fazer login no site.<br>
        Recomendamos que você a memorize ou anote em local seguro.
      </div>
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
      subject: "Recuperação de Senha - Mascate Carvão",
      content: "auto",
      html: htmlBody,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending recovery email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
