# 📦 Transfer-Anleitung: Linux → Windows

## Problem
Das Git-Repository liegt auf einem Linux-Server unter:
```
/home/user/projekt/
```

Sie benötigen die Dateien auf Ihrem Windows 11 System unter:
```
D:\claudeapps\multi api management plattform\
```

---

## ✅ Lösung je nach Setup

### Option 1: SSH/SCP Transfer (falls Sie SSH-Zugriff haben)

**Auf Ihrem Windows PC (PowerShell):**

```powershell
# 1. Verzeichnis erstellen
New-Item -Path "D:\claudeapps\multi api management plattform" -ItemType Directory -Force

# 2. Dateien via SCP kopieren (ersetzen Sie USERNAME und SERVER)
scp -r USERNAME@SERVER:/home/user/projekt/api-master "D:\claudeapps\multi api management plattform\"
```

**Oder mit WinSCP (GUI-Tool):**
1. Download: https://winscp.net/
2. Verbinden Sie sich mit Ihrem Server
3. Links: Navigieren Sie zu `/home/user/projekt/api-master`
4. Rechts: Navigieren Sie zu `D:\claudeapps\multi api management plattform`
5. Drag & Drop den gesamten `api-master` Ordner

---

### Option 2: ZIP-Download

**Auf dem Linux-Server (hier ausführen):**

```bash
cd /home/user/projekt
zip -r api-master-complete.zip api-master/ COPY_TO_CLAUDEAPPS.bat QUICK_COPY.bat
```

**Dann:**
1. Laden Sie `api-master-complete.zip` auf Ihr Windows-System
2. Entpacken Sie nach `D:\claudeapps\multi api management plattform\`

---

### Option 3: GitHub als Zwischenspeicher

**Auf dem Linux-Server:**

```bash
cd /home/user/projekt
git remote add github https://github.com/IHR_GITHUB_USERNAME/api-master.git
git push github claude/api-implementation-tool-011CUKJdSoH8ivHhoZMa5NA7:main
```

**Auf Ihrem Windows PC:**

```cmd
D:
cd D:\
git clone https://github.com/IHR_GITHUB_USERNAME/api-master.git "claudeapps\multi api management plattform"
```

---

### Option 4: Manuell via Dateifreigabe

Falls Sie **direkten Zugriff** auf das Linux-Dateisystem haben (z.B. Netzlaufwerk, VM-Shared-Folder):

1. Öffnen Sie den Pfad zu `/home/user/projekt/api-master`
2. Kopieren Sie den gesamten Ordner
3. Fügen Sie ihn ein nach `D:\claudeapps\multi api management plattform\`

---

## 🎯 Was kopiert werden muss

```
api-master/
├── backend/          ✅ Complete Node.js Backend
├── frontend/         ✅ Complete React Frontend
├── desktop/          ✅ Electron Desktop App
├── mobile/           ✅ React Native Mobile
├── templates/        ✅ Invoice Templates
├── store-assets/     ✅ Google Play, Microsoft Store, GitHub Marketplace
├── README.md
├── USER_GUIDE.md
├── DEPLOYMENT.md
├── COMPLIANCE_GUIDE.md
├── LAUNCH_PLAN_4_PLATFORMS.md
└── ... (alle anderen .md Dateien)

COPY_TO_CLAUDEAPPS.bat   ✅ Windows Copy Script
QUICK_COPY.bat           ✅ Quick Setup Script
```

---

## ⚡ Nach dem Transfer

**Auf Ihrem Windows PC (CMD):**

```cmd
D:
cd "D:\claudeapps\multi api management plattform"
dir
```

Sie sollten sehen:
```
api-master/
COPY_TO_CLAUDEAPPS.bat
QUICK_COPY.bat
```

**Dann:**

```cmd
cd api-master\backend
npm install

cd ..\frontend
npm install
```

---

## ❓ Welche Option passt zu Ihnen?

**Beantworten Sie diese Fragen:**

1. **Wie greifen Sie auf dieses Linux-System zu?**
   - [ ] SSH (Terminal)
   - [ ] Webinterface
   - [ ] Shared Folder / Netzlaufwerk
   - [ ] Virtualisierung (VM / Docker)
   - [ ] Cloud-Service (welcher?)

2. **Haben Sie Zugriff auf:**
   - [ ] GitHub / GitLab Account
   - [ ] FTP / SFTP
   - [ ] Shared Network Drive
   - [ ] Nur Konsole (SSH)

3. **Wo läuft dieser Linux-Server?**
   - [ ] Lokaler PC (WSL / VM)
   - [ ] Remote-Server (Cloud / VPS)
   - [ ] Docker Container
   - [ ] Anderes: ___________

---

## 📞 Hilfe benötigt?

Antworten Sie mit der Option, die zu Ihrer Situation passt, und ich helfe Ihnen mit den genauen Befehlen!

**Beispiel-Antwort:**
"Ich habe SSH-Zugriff auf den Server und einen GitHub-Account."

Dann kann ich die exakten Befehle für Ihre Situation geben!
