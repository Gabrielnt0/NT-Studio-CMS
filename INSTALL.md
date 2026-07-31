# Correção do lint — Portfolio CMS

1. Copie o conteúdo da pasta `modified/` para a raiz do projeto, substituindo os quatro arquivos existentes.
2. Execute:

```powershell
npm run lint
npm run build
```

A correção preserva o `useAuth` no mesmo arquivo para não quebrar imports existentes.
