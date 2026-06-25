# Déploiement sur VPS Hostinger (nginx + Next.js)

Guide pas-à-pas pour mettre `shift-academie.fr` en ligne sur votre VPS.
Toutes les commandes se lancent **en SSH sur le VPS** (utilisateur `root`).

> Le domaine pointe déjà vers le VPS (vous voyez « Welcome to nginx! »).
> Il reste à : installer le site, configurer nginx, activer le HTTPS.

---

## 0. Se connecter au VPS

Récupérez l'IP du VPS dans le panneau Hostinger (hPanel → VPS).

```bash
ssh root@VOTRE_IP_VPS
```

---

## 1. Installer Node.js 22, Git et pm2

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs git
npm install -g pm2
node -v   # doit afficher v22.x
```

---

## 2. Récupérer le code (clé de déploiement GitHub)

Le dépôt est privé : on crée une clé SSH sur le VPS et on l'autorise sur GitHub.

```bash
ssh-keygen -t ed25519 -C "vps-shift-academie" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Copiez la clé affichée, puis sur GitHub :
**Dépôt `shift-academie` → Settings → Deploy keys → Add deploy key**
→ collez la clé, cochez éventuellement « Allow write access » (pas nécessaire), validez.

Ensuite, sur le VPS :

```bash
cd /var/www 2>/dev/null || mkdir -p /var/www && cd /var/www
git clone git@github.com:joachouri-stack/shift-academie.git
cd shift-academie
git checkout main
```

---

## 3. Installer et construire le site

```bash
npm install
npm run build
```

---

## 4. Lancer le site avec pm2 (port 3000)

```bash
pm2 start npm --name shift-academie -- start
pm2 save
pm2 startup systemd -u root --hp /root   # démarrage auto au reboot
```

Vérification (doit renvoyer du HTML) :

```bash
curl -I http://localhost:3000
```

---

## 5. Configurer nginx (reverse proxy)

```bash
# Copier la config fournie dans le dépôt
cp /var/www/shift-academie/deploy/nginx.conf /etc/nginx/sites-available/shift-academie

# Activer le site et désactiver la page par défaut
ln -sf /etc/nginx/sites-available/shift-academie /etc/nginx/sites-enabled/shift-academie
rm -f /etc/nginx/sites-enabled/default

# Tester puis recharger
nginx -t
systemctl reload nginx
```

➡️ À ce stade, `http://shift-academie.fr` affiche votre site (en HTTP).

---

## 6. Activer le HTTPS (cadenas 🔒, gratuit)

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d shift-academie.fr -d www.shift-academie.fr
```

Répondez aux questions (email, accepter les conditions, choisir la
redirection HTTP → HTTPS). certbot configure tout et renouvelle
automatiquement le certificat.

➡️ `https://shift-academie.fr` est en ligne et sécurisé. ✅

---

## 7. Vérifier le sous-domaine www (DNS Hostinger)

Si `www.shift-academie.fr` ne fonctionne pas, ajoutez l'enregistrement DNS
dans Hostinger (hPanel → Domaines → DNS / Zone DNS) :

| Type  | Nom | Valeur            |
|-------|-----|-------------------|
| A     | `@` | `VOTRE_IP_VPS`    |
| A     | `www` | `VOTRE_IP_VPS`  |

(Le `@` existe déjà puisque le domaine pointe vers le VPS.)

---

## 8. Pare-feu (si activé)

Assurez-vous que les ports 80 et 443 sont ouverts :

```bash
ufw allow 'Nginx Full' 2>/dev/null || true
ufw allow OpenSSH 2>/dev/null || true
```

---

## Mettre à jour le site plus tard

À chaque nouvelle modification du code (après un `git push`) :

```bash
cd /var/www/shift-academie
bash deploy/update.sh
```

(Le script fait `git pull`, réinstalle, rebuild et redémarre l'app.)

---

## En cas de souci

```bash
pm2 logs shift-academie     # voir les logs de l'application
pm2 status                  # état de l'app
systemctl status nginx      # état de nginx
nginx -t                    # tester la config nginx
```
