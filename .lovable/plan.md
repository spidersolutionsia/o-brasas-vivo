

# Plano: Mostrar primeiro nome do cliente no header

## Problema
O cliente fez login antes da funcionalidade de salvar o nome ser adicionada, entao o `customer_name` nao existe no localStorage. O codigo mostra "Ola, ZTV681" em vez de "Ola, FELIPE".

## Solucao

### `src/hooks/useCustomerSession.ts`
- No `useEffect` de inicializacao, se existir `customer_code` no localStorage mas NAO existir `customer_name`, buscar o nome do cliente no banco de dados automaticamente e salvar no localStorage.
- Importar o client do Supabase no hook para fazer essa busca.

### Logica atualizada do useEffect:
```text
useEffect:
  storedCode = localStorage.get('customer_code')
  storedName = localStorage.get('customer_name')
  
  if (storedCode) setCustomerCode(storedCode)
  if (storedName) setCustomerName(storedName)
  
  // Se tem codigo mas nao tem nome, buscar no banco
  if (storedCode && !storedName) {
    supabase.from('customers').select('name').eq('code', storedCode).maybeSingle()
    -> se encontrar, salvar no localStorage e no state
  }
```

Isso resolve tanto para usuarios que ja estavam logados antes da feature, quanto para qualquer caso futuro onde o nome nao tenha sido salvo.
