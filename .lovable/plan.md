

## Exportar lista filtrada do CRM (Excel)

### O que será feito
Adicionar um botão "Exportar" ao lado dos botões de ação existentes (Rotas, Novo Cliente, Refresh). Ao clicar, exporta em Excel (.xlsx) exatamente os clientes visíveis na tela — respeitando busca, filtro de rota, filtro por dia e aba ativa (Ativos/Inativos/Falta Dados).

### Mudanças

**1. Instalar dependência `xlsx`** (SheetJS) para gerar Excel no browser.

**2. Arquivo: `src/components/admin/AdminCRM.tsx`**

- Importar `xlsx` (utils + writeFile)
- Adicionar função `handleExport()` que:
  - Pega `tabClients` (já filtrado pela busca, rota, dia e aba)
  - Mapeia para colunas: Nome, Telefone, Cidade, Rota(s), Status, Disparo, Observações
  - Converte array de rotas em string separada por vírgula
  - Gera e baixa arquivo `.xlsx` com nome tipo `CRM_Ativos_2026-03-20.xlsx`
- Adicionar botão com ícone de download na área de ações (linha ~292-302)

### Resultado
O usuário filtra por "bomjardim" na busca, aba "Ativos", e ao clicar "Exportar" baixa um Excel só com esses 14 clientes visíveis.

