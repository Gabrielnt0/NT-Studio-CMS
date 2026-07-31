# Sprint A1 — Aparência do Portfolio CMS

Este pacote transfere o motor de temas do ONRONT Studio para o Portfolio CMS pessoal, removendo workspaces e arquitetura SaaS.

## Ordem obrigatória

### 1. Execute o SQL

Abra no pacote:

`modified/supabase/migrations/20260731_04_personal_portfolio_theme_engine.sql`

Copie o conteúdo para o SQL Editor do Supabase e execute.

### 2. Copie os arquivos

Copie todo o conteúdo de `modified/` para a raiz do projeto `portfolio-CMS`, substituindo os arquivos existentes.

### 3. Valide

```powershell
npm run lint
npm run build
npm run dev
```

## Nova rota

`/appearance`

## Funcionalidades

- presets Midnight, Emerald, Violet e Light;
- cores principais e de superfície;
- tipografia;
- bordas;
- sombras;
- animações;
- pré-visualização;
- publicação no Supabase;
- RPC pública `get_public_portfolio_theme` compatível com o site.

## Segurança

Não foram incluídos workspaces, membros, tenants, credenciais ou identidade ONRONT.
