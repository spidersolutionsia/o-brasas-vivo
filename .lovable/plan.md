
# Plano: Webhook de novo cadastro de cliente

## Resumo
Adicionar um webhook separado que dispara quando um novo cliente se cadastra, enviando os dados do cadastro para o mesmo endpoint do n8n, porem com o evento `customer_created`.

## Alteracao

### Arquivo: `src/components/order/StepRegister.tsx`

Apos o insert do cliente no banco (e antes/junto do envio do email), adicionar uma chamada POST para o webhook do n8n com os dados do cadastro:

- **URL**: `https://n8n.spidersolutions.com.br/webhook/carvaomascatesite` (mesmo endpoint usado nos pedidos)
- **Evento**: `customer_created`
- **Dados enviados**:
  - `event`: "customer_created"
  - `customer_code`: codigo gerado
  - `customer_name`: nome
  - `customer_email`: email
  - `customer_phone`: telefone completo (DDD + numero)
  - `customer_address`: endereco formatado (rua, numero, complemento, bairro, cidade, CEP)
  - `created_at`: data/hora atual

- A chamada sera "fire and forget" (nao bloqueia o fluxo de cadastro se falhar)

## Fluxo atualizado
```text
Cliente preenche formulario
        |
        v
Gera codigo + Salva no banco
        |
        v
  (em paralelo, sem bloquear)
  - Envia email com codigo
  - Envia webhook customer_created para n8n
        |
        v
Cliente segue para confirmacao
```
