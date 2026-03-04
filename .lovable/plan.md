

# Plano: Logout com reload da página

## Problema
Ao clicar em "Sair", o logout limpa o estado do contexto mas a página não recarrega, deixando dados antigos visíveis.

## Solução
No `handleLogout` do `CustomerLogin.tsx`, adicionar `window.location.reload()` após chamar `logout()` para forçar o recarregamento da página.

## Alteração

### Arquivo: `src/components/CustomerLogin.tsx`
Atualizar o `handleLogout`:
```typescript
const handleLogout = () => {
  logout();
  setOpen(false);
  window.location.href = '/';
};
```
Usar `window.location.href = '/'` em vez de `reload()` para garantir que o usuário volte à home e a página recarregue completamente.

