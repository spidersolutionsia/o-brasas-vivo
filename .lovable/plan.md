

# Plano: Auto-preencher identificacao para cliente logado

## Problema
Quando o cliente ja esta logado (codigo salvo no localStorage via `useCustomerSession`), ao clicar "Continuar" na etapa de produtos, ele ainda precisa digitar o codigo manualmente na tela de identificacao. O ideal eh pular essa etapa e ir direto para a confirmacao.

## Alteracoes

### `src/pages/Pedido.tsx`
- Importar `useCustomerSession` e o client Supabase.
- Ao clicar "Continuar" na etapa de produtos (`onNext`):
  - Se o cliente estiver logado (`isLoggedIn`), buscar automaticamente os dados do cliente no banco pelo codigo salvo.
  - Se encontrar, setar `customerId`, `customerCode` e `customerName` e ir direto para `step = 'confirmation'`, pulando a etapa de identificacao.
  - Se nao encontrar (codigo invalido/removido), ir para `step = 'identify'` normalmente.
- Se o cliente nao estiver logado, seguir o fluxo normal para `step = 'identify'`.

### `src/components/order/StepIdentify.tsx`
- Apos o cliente ser encontrado com sucesso (`onCustomerFound`), salvar o codigo na sessao chamando `login(code)` do `useCustomerSession` — para que nas proximas vezes ele ja esteja logado.
- Passar o `login` como prop ou fazer o save direto no `Pedido.tsx` no `handleCustomerFound`.

### `src/components/order/StepRegister.tsx`
- Da mesma forma, apos cadastro bem-sucedido, salvar o codigo na sessao para que o cliente fique logado automaticamente.

## Fluxo resultante

```text
Cliente LOGADO:
  Produtos -> (auto-busca no banco) -> Confirmacao (direto)

Cliente NAO logado:
  Produtos -> Identificacao (digita codigo) -> Confirmacao
  Produtos -> Identificacao -> Cadastro -> Confirmacao
```

## Detalhes tecnicos

No `Pedido.tsx`, a funcao `handleNextFromProducts` ficara assim:

```text
async handleNextFromProducts() {
  if (isLoggedIn && customerCode from session) {
    const customer = await supabase.from('customers').select('id, code, name').eq('code', sessionCode).maybeSingle()
    if (customer.data) {
      setCustomerId / setCustomerCode / setCustomerName
      setStep('confirmation')
      return
    }
  }
  setStep('identify')
}
```

Tambem salvar o codigo na sessao (`login(code)`) no `handleCustomerFound` e `handleRegistered` para manter o cliente logado para pedidos futuros.

