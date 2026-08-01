# Sprint A2 — Site Builder pessoal

## Ordem de instalação

1. No SQL Editor do Supabase, execute:

`modified/supabase/migrations/20260731_05_personal_portfolio_site_builder.sql`

2. Copie o conteúdo de `modified/` para a raiz do projeto, substituindo os arquivos.

3. Execute:

```powershell
npm run lint
npm run build
npm run dev
```

## Funcionalidades incluídas

- presets Moderno, Minimalista, Criativo e Trajetória;
- ativar e ocultar seções;
- drag and drop para ordenar seções;
- hero dividido, centralizado ou tela cheia;
- controles do avatar, currículo, contato e redes;
- largura, espaçamento e alinhamento;
- cards, botões e navbar;
- grid e paginação de projetos;
- exibição de filtros, tecnologias, cliente e data;
- layouts de habilidades;
- configurações do rodapé;
- preview estrutural em tempo real;
- RPC pública `get_public_portfolio_builder`.

O pacote não inclui workspaces, multiusuário ou qualquer identidade do ONRONT.
