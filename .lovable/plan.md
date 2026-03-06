

## Plano: Reduzir código de recuperação para 4 dígitos

Alteração simples em 2 lugares:

### 1. Banco de dados — migration SQL
Recriar a função `generate_recovery_code` trocando o loop de `1..6` para `1..4`.

### 2. Frontend — `src/components/PasswordRecovery.tsx`
- Validação: `length !== 6` → `length !== 4`
- Mensagens: "código de 6 dígitos" → "código de 4 dígitos"
- Input: `maxLength={6}` → `maxLength={4}`, `slice(0, 6)` → `slice(0, 4)`, placeholder `"000000"` → `"0000"`

### 3. Edge Function — `supabase/functions/send-recovery-email/index.ts`
Nenhuma alteração necessária (já usa a variável `code` dinamicamente).

