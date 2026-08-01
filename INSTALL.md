# Correção do lint — Editor Visual

Copie o conteúdo da pasta `modified/` para a raiz do Portfolio CMS,
substituindo o arquivo existente.

Depois execute:

```powershell
npm run lint
npm run build
npm run dev
```

A correção separa o `iframeRef` dos valores de estado retornados pelo hook,
evitando que a regra `react-hooks/refs` trate todo o objeto como uma referência.
