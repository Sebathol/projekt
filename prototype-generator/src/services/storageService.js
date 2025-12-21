/**
 * Local Storage Service
 */
class StorageService {
  constructor() {
    this.prefix = 'pg_';
  }

  /**
   * Save data to localStorage
   */
  save(key, data) {
    try {
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, JSON.stringify(data));
      console.log(`✅ Saved to storage: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving to storage:`, error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   */
  load(key) {
    try {
      const fullKey = this.prefix + key;
      const data = localStorage.getItem(fullKey);
      if (data) {
        console.log(`✅ Loaded from storage: ${key}`);
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error(`❌ Error loading from storage:`, error);
      return null;
    }
  }

  /**
   * Delete from localStorage
   */
  delete(key) {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
      console.log(`✅ Deleted from storage: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting from storage:`, error);
      return false;
    }
  }

  /**
   * Clear all app data from localStorage
   */
  clearAll() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
      console.log('✅ All storage cleared');
      return true;
    } catch (error) {
      console.error(`❌ Error clearing storage:`, error);
      return false;
    }
  }

  /**
   * Get all keys
   */
  getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }
}

export default new StorageService();
