

## Problema

A coluna `disparo` está em `LOCAL_ONLY_COLUMNS` no `crm-sync`, o que faz ela ser removida do payload antes de enviar ao Supabase externo. Por isso o update vai vazio e retorna `{"data":[]}`.

O erro anterior (400/PGRST204) aconteceu porque a coluna `disparo` **não existia** no banco externo. A solução correta é:

## Plano

**1. Criar a coluna `disparo` no Supabase externo**
- Você precisa adicionar manualmente a coluna `disparo` (boolean, default false) na tabela `crm_carvaomascate` do seu projeto Supabase externo. Isso pode ser feito via SQL Editor no dashboard do Supabase externo:
  ```sql
  ALTER TABLE crm_carvaomascate ADD COLUMN IF NOT EXISTS disparo boolean DEFAULT false;
  ```

**2. Remover `disparo` de `LOCAL_ONLY_COLUMNS` no `crm-sync`**
- Em `supabase/functions/crm-sync/index.ts`, remover `"disparo"` da lista de `crm_carvaomascate` em `LOCAL_ONLY_COLUMNS`, permitindo que o valor seja sincronizado.

**3. Re-deploy da edge function `crm-sync`**

### Pré-requisito
Antes de eu implementar o passo 2, você precisa confirmar que adicionou a coluna `disparo` no banco externo. Caso contrário, o erro 400 voltará.

