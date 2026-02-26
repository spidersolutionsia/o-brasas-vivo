
# Plano: Remover tela intermediaria de "Cadastro Realizado" e ir direto para confirmacao

## Problema
Apos o cadastro, aparece uma tela "Cadastro Realizado" com botao "Continuar para o Pedido". O usuario quer que, ao finalizar o cadastro, va **direto para a tela de confirmacao** mostrando o codigo do cliente junto com o resumo do pedido e o botao de enviar. Alem disso, o scroll nao esta subindo corretamente ao mudar de etapa em alguns casos.

## Alteracoes

### 1. `src/components/order/StepRegister.tsx`
- Remover toda a tela intermediaria "Cadastro Realizado" (o bloco `if (generatedCode)` que renderiza o CheckCircle, codigo e botao "Continuar").
- Remover o estado `generatedCode` e o uso de `window.__registeredCustomer`.
- Apos o insert no banco ser bem-sucedido, chamar diretamente `onRegistered(insertData.id, customerCode, form.name)` sem parar numa tela intermediaria.

### 2. `src/components/order/StepConfirmation.tsx`
- Adicionar uma secao no topo da confirmacao mostrando o codigo do cliente de forma destacada (similar ao card laranja da imagem de referencia), para que o cliente saiba qual eh seu codigo ao ver o resumo do pedido.
- Manter o botao principal "Finalizar e Enviar Pedido" e o botao secundario "Voltar ao Pedido".

### 3. `src/pages/Pedido.tsx`
- Garantir que o `useEffect` de scroll to top com `window.scrollTo(0, 0)` funcione corretamente — ja existe, mas verificar se o `scrollTo` esta sendo chamado no container correto (pode ser necessario usar `{ top: 0, behavior: 'instant' }`).

## Resumo do fluxo apos as alteracoes

```text
Cadastro (preenche formulario) 
  -> Salva no banco 
  -> Vai DIRETO para Confirmacao (mostra codigo + resumo + botao enviar)
  -> Finalizar abre WhatsApp e envia webhook
```
