# Publicação do portfolio-CMS no GitHub Pages

O projeto já está preparado para ser publicado em:

`https://gabrielnt0.github.io/portfolio-CMS/`

## Configuração única no GitHub

1. Abra o repositório `portfolio-CMS`.
2. Vá em **Settings → Secrets and variables → Actions**.
3. Cadastre estes Repository secrets usando os mesmos valores do seu arquivo `.env` local:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PORTFOLIO_PREVIEW_URL`
4. Vá em **Settings → Pages**.
5. Em **Build and deployment → Source**, escolha **GitHub Actions**.
6. Envie estas alterações para a branch `main`.
7. Acompanhe a publicação pela aba **Actions**.

## Supabase Auth

No Supabase, abra **Authentication → URL Configuration** e adicione esta URL em **Redirect URLs**:

`https://gabrielnt0.github.io/portfolio-CMS/reset-password`

Mantenha também a URL local caso ainda use desenvolvimento local:

`http://localhost:5173/reset-password`

## Desenvolvimento local

O projeto continua funcionando normalmente com:

```bash
npm run dev
```

A configuração `/portfolio-CMS/` só é aplicada automaticamente durante o build executado pelo GitHub Actions.
