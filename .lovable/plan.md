
# Plano: Ajustar cards de produtos

## Alterações em `src/components/ProductsSection.tsx`

### 1. Cards Diamante Negro — mesmo tamanho e fundo preto
- Manter o grid Diamante Negro com `md:grid-cols-2` mas usar `max-w-5xl` (igual ao Mascate) para que os cards fiquem maiores.
- Trocar o fundo da área de imagem de `bg-background` para `bg-black` nos cards Diamante Negro (ou em todos, para consistência).

### 2. Overlay de peso nos cards Mascate
- Como a imagem do saco mostra "5kg" em todos, adicionar um overlay com o peso correto (`2,5kg`, `9kg`) posicionado sobre a imagem.
- Usar `position: relative` no container da imagem + `position: absolute` no badge de peso.
- Para o saco de 5kg (que já está correto), não mostrar overlay ou mostrar igual para consistência visual.

### Layout do card de imagem:
```text
┌─────────────────────┐
│  bg-black            │
│                      │
│    [imagem saco]     │
│         ┌──────┐     │
│         │ 2,5kg│ ◄── overlay badge
│         └──────┘     │
└─────────────────────┘
```
