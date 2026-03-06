

## Plano: Recuperação de Senha com Código de Verificação

### Mudança de fluxo
Atualmente o sistema gera uma senha temporária e envia diretamente. O novo fluxo será:

1. Usuário informa email/telefone → sistema localiza a conta
2. Escolhe receber código por **Email** ou **WhatsApp**
3. Sistema gera código de 6 dígitos, salva no banco com expiração, e envia
4. Usuário digita o código no site → sistema valida
5. Usuário define uma **nova senha** no site

### Alterações

**1. Banco de dados — nova tabela + funções RPC**
- Criar tabela `password_recovery_codes` com colunas: `id`, `customer_id`, `code` (6 dígitos), `expires_at` (now + 10 min), `used` (boolean)
- RLS: sem acesso direto (tudo via RPC security definer)
- Nova RPC `generate_recovery_code(p_login text)` — localiza cliente, gera código numérico de 6 dígitos, insere na tabela, retorna dados do cliente + código
- Nova RPC `verify_recovery_code(p_login text, p_code text)` — valida código não expirado e não usado, marca como usado, retorna `customer_id`
- Nova RPC `reset_customer_password(p_customer_id uuid, p_new_password text)` — atualiza `password_hash` (trigger existente faz o hash)
- Remover a RPC `recover_customer_password` antiga (ou mantê-la e substituir o uso)

**2. Edge Function `send-recovery-email`**
- Ajustar template para enviar "código de verificação" em vez de "senha temporária"
- Mudar o texto e a variável de `tempPassword` para `code`

**3. PasswordRecovery.tsx — novo fluxo com 4 etapas**
- `input` → digita email/telefone e busca conta
- `choose` → escolhe Email ou WhatsApp
- `code` → **NOVA ETAPA** — campo para digitar o código de 6 dígitos com botão de verificar
- `newPassword` → **NOVA ETAPA** — dois campos (nova senha + confirmar) e botão de salvar
- `done` → confirmação de sucesso, botão "Voltar ao login"

**4. Webhook n8n**
- Ajustar payload para enviar `code` em vez de `tempPassword`, mantendo evento `code_recovery`

### Arquivos modificados/criados
- **Nova migration SQL**: tabela `password_recovery_codes` + 3 RPCs
- **Editado**: `supabase/functions/send-recovery-email/index.ts` — template do email com código
- **Editado**: `src/components/PasswordRecovery.tsx` — novo fluxo com etapas code + newPassword

