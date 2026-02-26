

# Plano: Enviar email com codigo de cadastro via Gmail SMTP

## Resumo
Quando um novo cliente se cadastrar, o sistema enviara automaticamente um email para o endereco informado pelo cliente contendo o codigo de acesso gerado. O email sera enviado usando o Gmail do Mascate (mascatecarvao@gmail.com) via SMTP com a Senha de App do Google.

## Segredos necessarios
Antes de implementar, dois segredos precisam ser configurados no backend:
- **GMAIL_USER**: `mascatecarvao@gmail.com`
- **GMAIL_APP_PASSWORD**: a senha de app de 16 digitos gerada no Google

## Alteracoes

### 1. Criar Edge Function `send-welcome-email`
Arquivo: `supabase/functions/send-welcome-email/index.ts`

- Recebe via POST: `customerName`, `customerEmail`, `customerCode`
- Usa os segredos `GMAIL_USER` e `GMAIL_APP_PASSWORD` para autenticar no SMTP do Gmail
- Envia um email formatado para o cliente com:
  - Assunto: "Seu codigo de acesso - Mascate Carvao"
  - Corpo: boas-vindas + codigo de acesso em destaque
- Utiliza a biblioteca `nodemailer` via npm specifier do Deno para conexao SMTP

### 2. Configurar `supabase/config.toml`
- Adicionar configuracao da funcao com `verify_jwt = false` para permitir chamadas internas

### 3. Atualizar `StepRegister.tsx`
- Apos o cadastro bem-sucedido (insert no banco), chamar a edge function `send-welcome-email` passando nome, email e codigo do cliente
- O envio do email nao bloqueia o fluxo — se falhar, o cadastro continua normalmente (o codigo ja foi salvo no banco)

## Fluxo final
```text
Cliente preenche formulario
        |
        v
Gera codigo (ex: ABC123)
        |
        v
Salva no banco de dados
        |
        v
Chama edge function send-welcome-email
        |
        v
Gmail do Mascate envia email ao cliente
com o codigo ABC123
        |
        v
Cliente segue para tela de confirmacao
```

## Email enviado ao cliente
- **De**: mascatecarvao@gmail.com
- **Para**: email informado pelo cliente no cadastro
- **Assunto**: Seu codigo de acesso - Mascate Carvao
- **Corpo**: mensagem de boas-vindas com o codigo em destaque

