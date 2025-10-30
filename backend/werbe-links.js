/**
 * Werbe-Links Module
 * Loads and serves advertising links from the werbe-links/ directory
 */

const fs = require('fs');
const path = require('path');

// Paths
const WERBE_LINKS_DIR = path.join(__dirname, '..', 'werbe-links');
const CONFIG_PATH = path.join(__dirname, '..', 'config', 'werbe-links-config.json');

// Cache
let cachedLinks = null;
let lastLoadTime = 0;

/**
 * Load werbe-links configuration
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(configData);
    }
  } catch (error) {
    console.error('Error loading werbe-links config:', error);
  }

  // Default config
  return {
    maxLinks: 10,
    displayLocations: ['sidebar', 'footer'],
    refreshInterval: 3600000, // 1 hour
    enableRotation: false,
    rotationInterval: 5000,
    showOnlyForFreePlans: false,
    hideForPremium: false,
    allowExternalImages: true
  };
}

/**
 * Load all werbe-links from directory
 */
function loadWerbeLinks() {
  const now = Date.now();
  const config = loadConfig();

  // Use cache if fresh enough
  if (cachedLinks && (now - lastLoadTime) < config.refreshInterval) {
    return cachedLinks;
  }

  const links = [];

  try {
    // Check if directory exists
    if (!fs.existsSync(WERBE_LINKS_DIR)) {
      console.warn('Werbe-links directory not found:', WERBE_LINKS_DIR);
      return [];
    }

    // Read all JSON files
    const files = fs.readdirSync(WERBE_LINKS_DIR);

    for (const file of files) {
      // Skip non-JSON files
      if (!file.endsWith('.json')) {
        continue;
      }

      try {
        const filePath = path.join(WERBE_LINKS_DIR, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        const linkData = JSON.parse(fileData);

        // Validate required fields
        if (!linkData.id || !linkData.title || !linkData.url) {
          console.warn(`Skipping invalid werbe-link: ${file} (missing required fields)`);
          continue;
        }

        // Only add active links
        if (linkData.active !== false) {
          links.push({
            id: linkData.id,
            title: linkData.title,
            description: linkData.description || '',
            url: linkData.url,
            image: linkData.image || null,
            priority: linkData.priority || 10,
            target: linkData.target || '_blank',
            active: linkData.active !== false
          });
        }
      } catch (error) {
        console.error(`Error loading werbe-link ${file}:`, error.message);
      }
    }

    // Sort by priority (lower number = higher priority)
    links.sort((a, b) => a.priority - b.priority);

    // Limit to maxLinks
    const limitedLinks = links.slice(0, config.maxLinks);

    // Update cache
    cachedLinks = limitedLinks;
    lastLoadTime = now;

    console.log(`Loaded ${limitedLinks.length} werbe-links (from ${links.length} total)`);

    return limitedLinks;

  } catch (error) {
    console.error('Error loading werbe-links:', error);
    return [];
  }
}

/**
 * Get werbe-links by location
 */
function getLinksByLocation(location) {
  const config = loadConfig();
  const allLinks = loadWerbeLinks();

  // Check if this location is enabled
  if (!config.displayLocations.includes(location)) {
    return [];
  }

  return allLinks;
}

/**
 * Initialize werbe-links module
 */
function init(app) {
  console.log('Initializing werbe-links module...');

  // API endpoint to get all werbe-links
  app.get('/api/werbe-links', (req, res) => {
    try {
      const links = loadWerbeLinks();
      const config = loadConfig();

      res.json({
        links,
        config: {
          maxLinks: config.maxLinks,
          displayLocations: config.displayLocations,
          enableRotation: config.enableRotation,
          rotationInterval: config.rotationInterval
        }
      });
    } catch (error) {
      console.error('Error fetching werbe-links:', error);
      res.status(500).json({ error: 'Fehler beim Laden der Werbe-Links' });
    }
  });

  // API endpoint to get werbe-links by location
  app.get('/api/werbe-links/:location', (req, res) => {
    try {
      const { location } = req.params;
      const links = getLinksByLocation(location);

      res.json({
        location,
        links
      });
    } catch (error) {
      console.error('Error fetching werbe-links by location:', error);
      res.status(500).json({ error: 'Fehler beim Laden der Werbe-Links' });
    }
  });

  // API endpoint to reload werbe-links (clear cache)
  app.post('/api/werbe-links/reload', (req, res) => {
    try {
      cachedLinks = null;
      lastLoadTime = 0;
      const links = loadWerbeLinks();

      res.json({
        message: 'Werbe-Links neu geladen',
        count: links.length
      });
    } catch (error) {
      console.error('Error reloading werbe-links:', error);
      res.status(500).json({ error: 'Fehler beim Neuladen der Werbe-Links' });
    }
  });

  // Serve werbe-links directory as static files
  app.use('/werbe-links', require('express').static(path.join(__dirname, '..', 'werbe-links')));

  // Load initial links
  loadWerbeLinks();

  console.log('Werbe-links module initialized');
}

module.exports = {
  init,
  loadWerbeLinks,
  getLinksByLocation,
  loadConfig
};
