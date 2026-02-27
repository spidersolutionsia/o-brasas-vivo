

# Plano: Restrição de email e telefone únicos no cadastro

## Resumo
Adicionar restrições de unicidade (UNIQUE) nos campos `email` e `phone` da tabela `customers` no banco de dados, e tratar os erros no frontend para exibir mensagens claras quando alguém tentar cadastrar com um email ou telefone já existente.

## Alterações

### 1. Migração no banco de dados
Adicionar constraints UNIQUE nos campos `email` e `phone` da tabela `customers`:

```sql
ALTER TABLE public.customers ADD CONSTRAINT customers_email_unique UNIQUE (email);
ALTER TABLE public.customers ADD CONSTRAINT customers_phone_unique UNIQUE (phone);
```

### 2. Arquivo: `src/components/order/StepRegister.tsx`
Atualizar o tratamento de erro do insert para detectar violações de unicidade e exibir mensagens específicas:

- Se o erro contiver `customers_email_unique`, exibir: **"Já existe um cadastro com esse email."**
- Se o erro contiver `customers_phone_unique`, exibir: **"Já existe um cadastro com esse telefone."**
- Caso contrário, manter a mensagem genérica atual.

O erro será mostrado no campo correspondente (email ou telefone) para facilitar a identificação pelo usuário.

## Detalhes técnicos

- As constraints UNIQUE no Postgres retornam um erro com o nome da constraint violada no campo `message` do erro do Supabase
- O código no `handleSubmit` verificara `insertErr.message` para identificar qual constraint foi violada e posicionar o erro no campo correto
- Nenhuma consulta extra ao banco antes do insert -- a validação acontece naturalmente pela constraint, mantendo a simplicidade

