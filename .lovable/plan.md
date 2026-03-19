

## Plano: Renomear rotas para combinar com CSV

### O que será feito
Atualizar os nomes das 2 rotas na tabela `rotas_carvao`:
- `"Rota 1"` → `"Rota1"`
- `"Rota 2"` → `"Rota2"`

Isso fará com que os nomes correspondam aos valores da coluna `rota` nos contatos do `crm_carvaomascate`, corrigindo o filtro por rota no painel.

### Detalhes técnicos
Executar 2 UPDATEs via insert tool:
```sql
UPDATE rotas_carvao SET nome = 'Rota1' WHERE id = 'd970dcda-0af9-43fc-bc9b-c346487285f4';
UPDATE rotas_carvao SET nome = 'Rota2' WHERE id = '4a4488d6-55bc-4968-b38c-d2a736de4373';
```

Também sincronizar com o banco externo via `crm-proxy` (update por nome antigo).

Nenhuma alteração de código é necessária — o frontend já lê os nomes dinamicamente da tabela `rotas_carvao`.

