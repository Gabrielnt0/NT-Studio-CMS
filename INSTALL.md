# Portfolio CMS — Refatoração do Dashboard

Este pacote reorganiza o Dashboard para funcionar como um orquestrador das features existentes.

## Arquivos alterados

- `src/features/dashboard/services/dashboard.service.js`
- `src/features/portfolio/services/portfolioProjects.service.js`

## O que mudou

- O Dashboard não consulta mais tabelas do Supabase diretamente.
- O Dashboard reutiliza os serviços de:
  - Portfólio
  - Habilidades
  - Mídia
  - Analytics
  - Perfil
- As datas ISO dos projetos são preservadas para ordenação entre features.
- Falhas em uma fonte não derrubam todo o Dashboard.
- Os dados disponíveis continuam sendo exibidos mesmo que uma feature falhe.

## Instalação

Copie o conteúdo da pasta `modified/` para a raiz do projeto, substituindo os arquivos existentes.

Depois execute:

```powershell
npm run lint
npm run build
npm run dev
```

## Validação

Confira no Dashboard:

- nome do perfil;
- quantidade de projetos;
- quantidade de habilidades;
- quantidade de arquivos;
- visualizações;
- projetos recentes;
- atividades recentes.
