

# Plano: Adicionar CNPJ e tipo de pessoa ao cadastro

## Resumo
Adicionar toggle "Pessoa Física / Pessoa Jurídica" no formulário. Quando PJ, exibir campo CNPJ e trocar label do nome para **"Razão Social ou Nome Fantasia"**.

## Alterações

### 1. Migração no banco de dados
```sql
ALTER TABLE public.customers ADD COLUMN cnpj text;
ALTER TABLE public.customers ADD CONSTRAINT customers_cnpj_unique UNIQUE (cnpj);
```

### 2. Arquivo: `src/components/order/StepRegister.tsx`
- Adicionar estado `personType` (`'pf'` | `'pj'`), default `'pf'`
- Adicionar campo `cnpj` ao form state
- Renderizar dois botões estilizados "Pessoa Física" / "Pessoa Jurídica" no topo
- Quando `pj`:
  - Label do nome muda para **"Razão Social ou Nome Fantasia *"**
  - Mostrar campo CNPJ com máscara (`XX.XXX.XXX/XXXX-XX`)
  - Validar CNPJ (14 dígitos) via Zod
- Incluir `cnpj` no insert do banco e no webhook
- Tratar erro `customers_cnpj_unique`: "Já existe um cadastro com esse CNPJ."

