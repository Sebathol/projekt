# Werbelinks-Feature für API Master

## Ordnerstruktur

```
api-master/
├── werbe-links/              ← NEUER ORDNER
│   ├── README.md
│   ├── link-1.json
│   ├── link-2.json
│   ├── link-3.json
│   └── ... (bis zu 10 oder mehr)
└── backend/
    └── src/
        └── api/
            └── werbelinks.routes.js
```

## Werbelink-Format (JSON)

Jede Datei in `werbe-links/` ist ein Werbelink:

**Beispiel: werbe-links/link-1.json**
```json
{
  "id": 1,
  "active": true,
  "title": "Weather App Pro",
  "description": "Ihre professionelle Wetter-App",
  "image": "https://example.com/weather-app-banner.png",
  "link": "https://example.com/weather-app",
  "buttonText": "Jetzt testen",
  "position": "sidebar",
  "priority": 1,
  "languages": {
    "de": {
      "title": "Wetter App Pro",
      "description": "Ihre professionelle Wetter-App",
      "buttonText": "Jetzt testen"
    },
    "en": {
      "title": "Weather App Pro",
      "description": "Your professional weather app",
      "buttonText": "Try now"
    },
    "pl": {
      "title": "Aplikacja Pogodowa Pro",
      "description": "Twoja profesjonalna aplikacja pogodowa",
      "buttonText": "Wypróbuj teraz"
    },
    "fr": {
      "title": "Application Météo Pro",
      "description": "Votre application météo professionnelle",
      "buttonText": "Essayer maintenant"
    }
  }
}
```

## Position-Optionen

```javascript
{
  "position": "sidebar",      // Rechte Sidebar
  "position": "dashboard-top", // Oben im Dashboard
  "position": "footer",        // Footer
  "position": "modal",         // Popup-Modal (mit X zum Schließen)
  "position": "banner"         // Banner oben
}
```

## Backend-API (werbelinks.routes.js)

```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// GET alle aktiven Werbelinks
router.get('/', async (req, res) => {
  try {
    const werbeLinksDir = path.join(__dirname, '../../../werbe-links');
    const files = await fs.readdir(werbeLinksDir);

    const links = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(
          path.join(werbeLinksDir, file),
          'utf-8'
        );
        const link = JSON.parse(content);
        if (link.active) {
          links.push(link);
        }
      }
    }

    // Sortiere nach Priority
    links.sort((a, b) => (a.priority || 0) - (b.priority || 0));

    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Werbelinks nach Position
router.get('/position/:position', async (req, res) => {
  try {
    const { position } = req.params;
    const werbeLinksDir = path.join(__dirname, '../../../werbe-links');
    const files = await fs.readdir(werbeLinksDir);

    const links = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(
          path.join(werbeLinksDir, file),
          'utf-8'
        );
        const link = JSON.parse(content);
        if (link.active && link.position === position) {
          links.push(link);
        }
      }
    }

    links.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST neuer Werbelink (Admin)
router.post('/', async (req, res) => {
  try {
    const werbeLinksDir = path.join(__dirname, '../../../werbe-links');
    const files = await fs.readdir(werbeLinksDir);

    // Finde nächste freie Nummer
    let nextId = 1;
    for (const file of files) {
      if (file.startsWith('link-') && file.endsWith('.json')) {
        const num = parseInt(file.replace('link-', '').replace('.json', ''));
        if (num >= nextId) nextId = num + 1;
      }
    }

    const newLink = {
      id: nextId,
      active: true,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    await fs.writeFile(
      path.join(werbeLinksDir, `link-${nextId}.json`),
      JSON.stringify(newLink, null, 2)
    );

    res.json(newLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Update Werbelink
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const werbeLinksDir = path.join(__dirname, '../../../werbe-links');
    const filePath = path.join(werbeLinksDir, `link-${id}.json`);

    const content = await fs.readFile(filePath, 'utf-8');
    const link = JSON.parse(content);

    const updatedLink = {
      ...link,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(updatedLink, null, 2));
    res.json(updatedLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Werbelink
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const werbeLinksDir = path.join(__dirname, '../../../werbe-links');
    const filePath = path.join(werbeLinksDir, `link-${id}.json`);

    await fs.unlink(filePath);
    res.json({ message: 'Werbelink deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## Frontend-Komponenten

### 1. WerbelinkWidget.jsx (Sidebar)
```javascript
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WerbelinkWidget({ position = 'sidebar', language = 'de' }) {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetchLinks();
  }, [position]);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/werbelinks/position/${position}`
      );
      setLinks(response.data);
    } catch (error) {
      console.error('Error fetching werbelinks:', error);
    }
  };

  const trackClick = (linkId) => {
    // Optional: Track clicks
    axios.post(`${import.meta.env.VITE_API_URL}/api/analytics/werbelink-click`, {
      linkId,
      timestamp: new Date()
    }).catch(err => console.error(err));
  };

  if (links.length === 0) return null;

  return (
    <div className="werbelink-widget space-y-4">
      {links.map((link) => {
        const content = link.languages?.[language] || {
          title: link.title,
          description: link.description,
          buttonText: link.buttonText
        };

        return (
          <div
            key={link.id}
            className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 rounded-lg shadow-lg border border-blue-700"
          >
            {link.image && (
              <img
                src={link.image}
                alt={content.title}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            <h3 className="text-white font-bold text-lg mb-2">
              {content.title}
            </h3>
            <p className="text-blue-200 text-sm mb-3">
              {content.description}
            </p>
            <a
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(link.id)}
              className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded text-center transition"
            >
              {content.buttonText}
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default WerbelinkWidget;
```

### 2. Dashboard mit Werbelinks
```javascript
import React from 'react';
import WerbelinkWidget from '../components/WerbelinkWidget';

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Werbelinks Banner oben */}
        <div className="mb-8">
          <WerbelinkWidget position="dashboard-top" language="de" />
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-4 gap-4">
          {/* ... Stats ... */}
        </div>
      </div>

      {/* Sidebar mit Werbelinks */}
      <aside className="w-80 bg-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4">Weitere Apps</h2>
        <WerbelinkWidget position="sidebar" language="de" />
      </aside>
    </div>
  );
}

export default Dashboard;
```

### 3. Admin-Seite: Werbelinks verwalten
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WerbelinksAdmin() {
  const [links, setLinks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    buttonText: 'Jetzt testen',
    position: 'sidebar',
    priority: 1,
    active: true
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/werbelinks`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLinks(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editing) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/werbelinks/${editing}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/werbelinks`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setForm({
        title: '',
        description: '',
        image: '',
        link: '',
        buttonText: 'Jetzt testen',
        position: 'sidebar',
        priority: 1,
        active: true
      });
      setEditing(null);
      fetchLinks();
    } catch (error) {
      alert('Fehler: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Wirklich löschen?')) return;

    const token = localStorage.getItem('token');
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/werbelinks/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchLinks();
  };

  const handleEdit = (link) => {
    setForm(link);
    setEditing(link.id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Werbelinks Verwalten</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* Formular */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            {editing ? 'Bearbeiten' : 'Neuer Werbelink'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Titel</label>
              <input
                type="text"
                className="w-full bg-gray-700 p-2 rounded"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block mb-2">Beschreibung</label>
              <textarea
                className="w-full bg-gray-700 p-2 rounded"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block mb-2">Bild-URL</label>
              <input
                type="url"
                className="w-full bg-gray-700 p-2 rounded"
                value={form.image}
                onChange={(e) => setForm({...form, image: e.target.value})}
              />
            </div>

            <div>
              <label className="block mb-2">Link-URL</label>
              <input
                type="url"
                className="w-full bg-gray-700 p-2 rounded"
                value={form.link}
                onChange={(e) => setForm({...form, link: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block mb-2">Button-Text</label>
              <input
                type="text"
                className="w-full bg-gray-700 p-2 rounded"
                value={form.buttonText}
                onChange={(e) => setForm({...form, buttonText: e.target.value})}
              />
            </div>

            <div>
              <label className="block mb-2">Position</label>
              <select
                className="w-full bg-gray-700 p-2 rounded"
                value={form.position}
                onChange={(e) => setForm({...form, position: e.target.value})}
              >
                <option value="sidebar">Sidebar</option>
                <option value="dashboard-top">Dashboard Oben</option>
                <option value="footer">Footer</option>
                <option value="banner">Banner</option>
                <option value="modal">Modal</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Priorität (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full bg-gray-700 p-2 rounded"
                value={form.priority}
                onChange={(e) => setForm({...form, priority: parseInt(e.target.value)})}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({...form, active: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="active">Aktiv</label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
              >
                {editing ? 'Aktualisieren' : 'Erstellen'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      title: '',
                      description: '',
                      image: '',
                      link: '',
                      buttonText: 'Jetzt testen',
                      position: 'sidebar',
                      priority: 1,
                      active: true
                    });
                  }}
                  className="bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded"
                >
                  Abbrechen
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Liste */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Vorhandene Werbelinks</h2>
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="bg-gray-700 p-4 rounded flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="font-bold">{link.title}</h3>
                  <p className="text-sm text-gray-400">{link.description}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="bg-blue-900 px-2 py-1 rounded">
                      {link.position}
                    </span>
                    <span className="bg-green-900 px-2 py-1 rounded">
                      Priorität: {link.priority}
                    </span>
                    <span className={`px-2 py-1 rounded ${link.active ? 'bg-green-700' : 'bg-red-700'}`}>
                      {link.active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WerbelinksAdmin;
```

## Beispiel-Werbelinks erstellen

Erstellen Sie diese Dateien in `werbe-links/`:

**link-1.json** (Wetter-App)
**link-2.json** (Andere App)
**link-3.json** (Noch eine App)
... bis zu 10 oder mehr!

## Analytics (Optional)

Track Klicks auf Werbelinks:

```javascript
// Backend: src/api/analytics.routes.js
router.post('/werbelink-click', async (req, res) => {
  const { linkId, timestamp } = req.body;

  // Speichere in Datenbank oder Log-Datei
  await WerbelinkClick.create({
    link_id: linkId,
    clicked_at: timestamp,
    user_agent: req.headers['user-agent'],
    ip: req.ip
  });

  res.json({ success: true });
});

// Statistiken abrufen
router.get('/werbelink-stats', async (req, res) => {
  const stats = await WerbelinkClick.findAll({
    attributes: [
      'link_id',
      [sequelize.fn('COUNT', sequelize.col('id')), 'clicks']
    ],
    group: ['link_id']
  });

  res.json(stats);
});
```

## README für werbe-links Ordner
```markdown
# Werbelinks für API Master

## So fügen Sie einen neuen Werbelink hinzu:

1. Erstellen Sie eine neue JSON-Datei: `link-X.json` (X = nächste Nummer)
2. Fügen Sie folgende Struktur ein:

\`\`\`json
{
  "id": X,
  "active": true,
  "title": "Meine App",
  "description": "Kurze Beschreibung",
  "image": "https://example.com/banner.png",
  "link": "https://example.com/meine-app",
  "buttonText": "Jetzt testen",
  "position": "sidebar",
  "priority": 1
}
\`\`\`

3. Speichern Sie die Datei
4. Der Link erscheint automatisch in der App!

## Positionen:
- `sidebar`: Rechte Sidebar
- `dashboard-top`: Oben im Dashboard
- `footer`: Footer
- `banner`: Banner oben
- `modal`: Popup

## Priorität:
Niedrigere Zahlen = höhere Priorität (1 = ganz oben)

## Aktiv/Inaktiv:
- `"active": true` → Link wird angezeigt
- `"active": false` → Link versteckt
```

---

**Das System ist jetzt fertig!**

Sie können:
✅ Einfach JSON-Dateien in `werbe-links/` kopieren
✅ Bis zu 10+ Werbelinks haben
✅ Links über Admin-Interface verwalten
✅ Mehrsprachige Unterstützung
✅ Verschiedene Positionen wählen
✅ Klicks tracken (optional)

Soll ich das jetzt ins Projekt integrieren?
