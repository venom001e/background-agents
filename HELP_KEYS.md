# 🚀 CodInspect Setup Guide (Action Required)

I have prepared the following for you:
- [x] Installed Node dependencies (`npm install`)
- [x] Built shared packages (`@CodInspect/shared`)
- [x] Built backend workers (`control-plane`, `slack-bot`)
- [x] Generated security secrets and updated `terraform.tfvars`
- [x] Installed `wrangler` CLI
- [ ] Installing `modal` CLI (In progress...)

---

## 🔑 Your Next Steps (Where to get APIs)

Please open the file: `terraform/environments/production/terraform.tfvars` and paste your keys in the following order:

### 1. Anthropic (The Brain)
- **Key**: `anthropic_api_key`
- **Where**: [Anthropic Console](https://console.anthropic.com/settings/keys)

### 2. Cloudflare (The Controller)
- **Keys**: `cloudflare_api_token`, `cloudflare_account_id`
- **Where**: [Cloudflare Dashboard](https://dash.cloudflare.com/) 
  - Account ID is on the Home page.
  - Create Token with "Edit Workers", "KV", and "R2" permissions.
- **Subdomain**: `cloudflare_worker_subdomain`
  - Get it from 'Workers & Pages' -> 'Overview' (right side).

### 3. Modal (The Sandbox)
- **Keys**: `modal_token_id`, `modal_token_secret`
- **Where**: [Modal Settings](https://modal.com/settings)
- **Workspace**: `modal_workspace` (Your username in the URL)

### 4. GitHub App (The Access)
- **App ID, Client ID, Client Secret**: [GitHub Apps Dashboard](https://github.com/settings/apps)
- **Installation ID**: URL of the installed app page (e.g., `github.com/settings/installations/123456`)
- **Private Key**: Download the `.pem` file and paste the ENTIRE content into `github_app_private_key`.

---

## 🏁 How to Finish
Once you have filled the keys, just tell me: **"Deploy Phase 1"**.

I will handle the Terraform execution and let you know when the dashboard is fully functional with real repositories!
