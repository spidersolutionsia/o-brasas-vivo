

# Plano: Login com Email/Telefone + Senha (substituir código de cliente)

## Resumo
Substituir o sistema de autenticação por código (ABC123) por login com **email, telefone ou nome de usuário** + **senha**, com confirmação de senha no cadastro. A senha será hasheada no servidor usando `pgcrypto`.

## Alterações

### 1. Migração no banco de dados
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Coluna de senha
ALTER TABLE public.customers ADD COLUMN password_hash text;

-- Função de autenticação (busca por email OU telefone)
CREATE OR REPLACE FUNCTION public.authenticate_customer(p_login text, p_password text)
RETURNS TABLE(id uuid, name text, code text, email text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.code, c.email
  FROM public.customers c
  WHERE (c.email = p_login OR c.phone = p_login)
    AND c.password_hash = crypt(p_password, c.password_hash);
END;
$$;

-- Trigger para hashear senha no insert (recebe via coluna password_hash como texto plano)
CREATE OR REPLACE FUNCTION public.hash_customer_password()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.password_hash IS NOT NULL THEN
    NEW.password_hash := crypt(NEW.password_hash, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_hash_customer_password
BEFORE INSERT ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.hash_customer_password();
```

### 2. `src/components/order/StepRegister.tsx`
- Adicionar campos **Senha** (mín. 6 caracteres) e **Confirmar Senha**
- Validar que as senhas coincidem
- Enviar `password_hash` (texto plano) no insert — o trigger faz o hash
- Manter todo o resto (PF/PJ, CNPJ, endereço, webhook)

### 3. `src/components/order/StepIdentify.tsx`
- Trocar campo "Código do Cliente" por **Email ou Telefone** + **Senha**
- Chamar RPC `authenticate_customer(login, password)` para validar
- Substituir modo "Recuperar código" por "Esqueci minha senha" (placeholder simples por enquanto)

### 4. `src/components/CustomerLogin.tsx`
- Trocar campo de código por **Email ou Telefone** + **Senha**
- Chamar RPC `authenticate_customer` para login

### 5. `src/contexts/CustomerSessionContext.tsx`
- Trocar chaves localStorage de `customer_code` para `customer_email`
- Login passa a receber `email` em vez de `code` (manter `code` internamente para pedidos)
- Busca de nome usa email em vez de code

### 6. `src/pages/MeusPedidos.tsx`
- Buscar customer por email em vez de code

