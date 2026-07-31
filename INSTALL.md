# Instalação — Migration Engine 1.1

1. Feche o servidor Vite com `Ctrl + C`.
2. Copie o conteúdo de `modified/` para a raiz do projeto `portfolio-CMS`, permitindo substituir os arquivos existentes.
3. Não apague outras pastas nesta atualização.
4. Execute:

```powershell
npm run build
npm run dev
```

5. Abra:

```text
http://localhost:5173/settings/migration
```

## Uso

- **Exportar backup:** clique em `Baixar backup JSON`.
- **Restaurar:** escolha um JSON, confira o resumo e confirme a restauração.
- **Migrar Supabase antigo:** informe URL, chave pública, e-mail e senha do projeto antigo, clique em `Analisar dados antigos`, escolha as tabelas e clique em `Migrar selecionadas`.

## Limitação desta etapa

A migração copia os registros das tabelas, mas não transfere os arquivos físicos dos buckets do Supabase Storage. Os campos de URL são preservados. Não apague o projeto antigo antes de migrarmos os arquivos de Storage.
