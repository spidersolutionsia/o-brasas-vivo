

# Plano: Sistema Completo de Pedidos com Cadastro de Clientes

## Resumo

Transformar a seção de atacado em uma pagina dedicada `/pedido` com fluxo multi-etapas, cadastro de clientes com integração ViaCEP, geração de código único, login por código, histórico de pedidos, e envio via WhatsApp + webhook.

---

## 1. Banco de Dados (Lovable Cloud / Supabase)

Criar duas tabelas:

### Tabela `customers`
| Coluna | Tipo | Notas |
|--------|------|-------|
| id | uuid (PK) | auto |
| code | text (unique) | 3 letras + 3 números (ex: ABC123) |
| name | text | obrigatório |
| email | text | obrigatório |
| phone | text | DDD + número |
| cep | text | |
| city | text | |
| neighborhood | text | |
| street | text | |
| number | text | |
| complement | text | opcional |
| created_at | timestamptz | auto |

### Tabela `orders`
| Coluna | Tipo | Notas |
|--------|------|-------|
| id | uuid (PK) | auto |
| order_number | text (unique) | gerado sequencialmente |
| customer_id | uuid (FK -> customers) | |
| items | jsonb | array de produtos e quantidades |
| status | text | pending, processing, shipped, delivered |
| created_at | timestamptz | auto |

RLS: leitura pública filtrada por código do cliente (sem auth tradicional).

---

## 2. Produtos Atualizados

Duas marcas no seletor de produtos:

**Carvão Mascate**: 2,5kg, 5kg, 9kg
**Diamante Negro**: 2kg, 4kg

Produtos agrupados por marca com visual diferenciado (badge/tag da marca).

---

## 3. Fluxo da Página `/pedido` (Multi-Etapas)

```text
Etapa 1: Selecionar Produtos
  - Cards por marca (Mascate / Diamante Negro)
  - Controles +/- de quantidade
  - Resumo e botão "Continuar"

Etapa 2: Identificação do Cliente
  - Campo "Código do Cliente" + botão "Confirmar"
  - OU botão "Sou novo, quero me cadastrar"

Etapa 2b (se novo): Formulário de Cadastro
  - Nome, Email, Telefone (DDD + número)
  - Checkbox marcado: "Enviar código também via WhatsApp"
  - CEP -> integração ViaCEP (auto-preenche cidade, bairro, rua)
  - Número, Complemento (opcional)
  - Ao salvar: gera código único (3 letras + 3 números)
  - Exibe código na tela + mensagem "enviado por email e WhatsApp"
  - Botão "Voltar ao Pedido" -> retorna à Etapa 2

Etapa 3: Confirmação
  - Resumo do pedido com dados do cliente
  - Botão "Finalizar Pedido via WhatsApp"
  - Abre WhatsApp com resumo formatado
  - Envia webhook POST para n8n com dados completos
  - Salva pedido no banco com número gerado
```

---

## 4. Login por Código no Header

- Adicionar ícone de login no Header (desktop e mobile)
- Modal/dropdown simples: campo "Código do Cliente" + botão entrar
- Ao logar: redireciona para `/meus-pedidos` com histórico filtrado pelo código
- Estado do login mantido via localStorage (código do cliente)

---

## 5. Página `/meus-pedidos` (atualizar a existente)

- Se logado (código no localStorage): busca pedidos do cliente
- Lista de pedidos com número, data, itens, status
- Timeline de status (já existente, reutilizar)

---

## 6. Integração ViaCEP

- Ao digitar CEP com 8 dígitos, fazer fetch em `https://viacep.com.br/ws/{cep}/json/`
- Auto-preencher: cidade (localidade), bairro, rua (logradouro)
- Campos ficam editáveis após preenchimento

---

## 7. Webhook n8n

Ao confirmar pedido, enviar POST para:
`https://n8n.spidersolutions.com.br/webhook/carvaomascatesite`

Payload:
```text
{
  order_number, customer_code, customer_name,
  customer_phone, customer_email, customer_address,
  items: [{brand, weight, quantity}],
  created_at
}
```

---

## 8. Alterações na Home

- Remover `WholesaleSection` da página Index
- Substituir por um CTA simples direcionando para `/pedido`
- Atualizar link "Comprar" no Header para ir a `/pedido`
- Atualizar link "Atacado" na nav para ir a `/pedido`

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| Migrations (2 tabelas) | Criar |
| `src/pages/Pedido.tsx` | Criar - página multi-etapas |
| `src/components/order/StepProducts.tsx` | Criar |
| `src/components/order/StepIdentify.tsx` | Criar |
| `src/components/order/StepRegister.tsx` | Criar |
| `src/components/order/StepConfirmation.tsx` | Criar |
| `src/components/CustomerLogin.tsx` | Criar - modal login por código |
| `src/hooks/useViaCep.ts` | Criar |
| `src/pages/MeuPedido.tsx` | Refatorar para usar banco |
| `src/pages/Index.tsx` | Remover WholesaleSection, adicionar CTA |
| `src/components/Header.tsx` | Adicionar login + link /pedido |
| `src/App.tsx` | Adicionar rota /pedido |
| `src/components/WholesaleSection.tsx` | Substituir por CTA simples |

