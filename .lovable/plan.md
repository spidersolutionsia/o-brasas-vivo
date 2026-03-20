

## Simplificar o campo "Semana de referência"

O campo atual pede um código ISO como "2026-W12" que é técnico e confuso. Vou substituir por uma abordagem intuitiva.

### Mudança

**Substituir o input de texto por uma pergunta simples:**

Em vez de pedir "2026-W12", mostrar:

> **"Esta semana a rota está ativa?"**
> [ Sim, esta semana é ativa ] [ Não, começa na próxima ]

Quando o usuário escolher, o sistema calcula automaticamente o `semana_referencia` correto nos bastidores:
- "Sim" → salva a semana atual como referência
- "Não" → salva a semana seguinte como referência

O indicador "✓ Ativa esta semana / ✗ Inativa esta semana" continua aparecendo para confirmar visualmente.

### Arquivo modificado
- `src/components/admin/RouteModal.tsx` — trocar Input por dois botões/toggle tanto na criação quanto na edição

### Detalhes técnicos
- Remover o `<Input>` de semana de referência
- Adicionar dois botões estilo toggle: "Ativa esta semana" / "Inativa esta semana"
- Ao clicar, setar `semanaRef = getISOWeek(new Date())` ou `getISOWeek(nextWeek)`
- Manter a lógica de `rotaUtils.ts` intacta — só muda a UI

