# Sprint 9.2 — Projetos completos

## Ordem obrigatória

1. No Supabase, abra **SQL Editor**.
2. Execute o arquivo:
   `supabase/migrations/20260731_03_portfolio_projects_complete.sql`
3. Somente depois copie `modified/` para a raiz do projeto, substituindo os arquivos.
4. Execute:

```powershell
npm run lint
npm run build
npm run dev
```

## Novos campos

- slug
- descrição completa
- cliente
- data do projeto
- tecnologias
- publicação independente do status
- ordem de exibição
- galeria de slides

## Observação

Este pacote não altera a RPC pública `get_public_portfolio_content`, porque o SQL atual dela não foi fornecido. O CMS e o banco ficam preparados; a RPC será auditada na etapa seguinte.
