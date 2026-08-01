# Deploy - Villa Plaza Restaurante

**Atualizado:** 2026-08-01

## 🌐 Produção
- **URL Pública:** `https://villaplaza.suporteide.digital/`
- **Subdomínio:** `villaplaza.suporteide.digital`
- **VPS Host:** `161.97.108.92`
- **Diretório VPS:** `/opt/villaplaza-site/app`
- **Container Docker:** `villaplaza-web`

## 🔄 Fluxo de CI/CD
- **Gatilho:** Push na branch `main` no GitHub.
- **Workflow:** `.github/workflows/deploy-vps.yml`
- **Roteamento & SSL:** Traefik + Let's Encrypt automático via Cloudflare Proxy.
