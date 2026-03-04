
# Plano: Adicionar campo de confirmação de telefone no cadastro

## Alterações em `src/components/order/StepRegister.tsx`

1. **Form state**: Adicionar campos `confirmDdd` e `confirmPhone` ao estado do formulário.

2. **Validação (Zod + lógica)**: Após validar o schema base, verificar se `ddd + phone === confirmDdd + confirmPhone`. Se não coincidirem, setar erro `confirmPhone: 'Os telefones não coincidem.'`.

3. **UI**: Logo abaixo do bloco de telefone atual (linha ~275), adicionar um bloco idêntico com label **"Confirmar Telefone *"** contendo os campos `confirmDdd` e `confirmPhone` com os mesmos placeholders e formatação.
