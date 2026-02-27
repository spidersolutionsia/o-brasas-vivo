
# Plano: Botão "Não lembro meu código" com recuperação via email/telefone

## Resumo
Adicionar um link "Não lembro meu código" na tela de identificação (StepIdentify). Ao clicar, o cliente informa o email ou telefone de cadastro. O sistema busca o cliente no banco e reenvia o código por email usando a Edge Function já existente.

## Alterações

### 1. Arquivo: `src/components/order/StepIdentify.tsx`

Adicionar um estado para alternar entre a tela de login normal e a tela de recuperação. Na tela de recuperação:

- Campo de input para email ou telefone
- Botão "Enviar meu código"
- Link "Voltar ao login com código"

**Fluxo de recuperação:**
1. Cliente digita email ou telefone
2. Sistema busca na tabela `customers` por `email` ou `phone` correspondente
3. Se encontrar, chama a Edge Function `send-welcome-email` para reenviar o código por email
4. Exibe mensagem de sucesso: "Código enviado para seu email!"
5. Se não encontrar, exibe erro: "Nenhum cadastro encontrado com esse dado"

### 2. Nenhuma alteração no banco de dados
A tabela `customers` já possui os campos `email` e `phone`, então a busca funcionará diretamente.

### 3. Nenhuma alteração na Edge Function
A função `send-welcome-email` já aceita `customerName`, `customerEmail` e `customerCode` -- será reutilizada para reenviar o código.

## Layout da tela de recuperação

```text
  Recuperar meu código
  --------------------
  [ Email ou Telefone  ]
  
  [   Enviar meu código   ]
  
  <- Voltar ao login com código
```

## Detalhes técnicos

- A busca será feita com OR: `email.eq(valor)` ou `phone.eq(valor)` dependendo se o input contém "@" (email) ou apenas números (telefone)
- O envio do código será sempre por email (usando o email cadastrado do cliente), mesmo que a busca tenha sido por telefone
- Mensagem genérica de sucesso para não expor se o email/telefone existe no sistema: "Se houver um cadastro com esse dado, enviaremos o código por email"
- Loading state durante busca e envio
