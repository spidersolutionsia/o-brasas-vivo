
# Plano: Separar campo Cidade e Estado (UF)

## Problema
O ViaCEP retorna `localidade/UF` no campo `city`. Precisamos separar em dois campos: **Cidade** (texto) e **Estado** (select com as 27 UFs do Brasil).

## Alterações

### 1. `src/hooks/useViaCep.ts`
- Retornar `state` (UF) separado de `city` no resultado, em vez de concatenar `localidade/uf`.

### 2. `src/components/order/StepRegister.tsx`
- Adicionar `state` ao form state (inicialmente `''`).
- Adicionar validação Zod: `state: z.string().min(1, 'Estado obrigatório')`.
- No `handleCepChange`, preencher `state` com a UF retornada pelo ViaCEP.
- Na UI, trocar o grid de "Cidade + Bairro" para "Cidade + Estado + Bairro" (3 colunas), onde Estado é um `<Select>` com as 27 UFs brasileiras (AC, AL, AM, ..., TO).
- Incluir `state` no payload de insert e no webhook.

### 3. Layout
```
[  Cidade (input)  ] [ Estado (select) ] [ Bairro (input) ]
```
O select terá todas as UFs ordenadas alfabeticamente.
