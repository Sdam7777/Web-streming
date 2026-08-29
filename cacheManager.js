/**
 * CacheManager - High-Performance Intelligent Client Caching
 * Handles TTL expiration, localStorage/sessionStorage fallback, and memory cache.
 */
class CacheManager {
  constructor(namespace = "tariaki_v1") {
    this.namespace = namespace;
    this.memoryCache = new Map();
  }

  set(key, data, ttlSeconds = 1800) {
    const fullKey = `${this.namespace}:${key}`;
    const expiresAt = Date.now() + ttlSeconds * 1000;
    const item = { value: data, expiresAt };

    // Set Memory Cache
    this.memoryCache.set(fullKey, item);

    // Set Persistent Local Storage Cache
    try {
      localStorage.setItem(fullKey, JSON.stringify(item));
    } catch (e) {
      console.warn("CacheManager storage quota exceeded, using memory fallback.", e);
    }
  }

  get(key) {
    const fullKey = `${this.namespace}:${key}`;

    // Check Memory Cache first (Instant sub-millisecond return)
    if (this.memoryCache.has(fullKey)) {
      const memItem = this.memoryCache.get(fullKey);
      if (Date.now() < memItem.expiresAt) {
        return memItem.value;
      }
      this.memoryCache.delete(fullKey);
    }

    // Check Persistent Storage Cache
    try {
      const raw = localStorage.getItem(fullKey);
      if (!raw) return null;

      const item = JSON.parse(raw);
      if (Date.now() > item.expiresAt) {
        localStorage.removeItem(fullKey);
        return null;
      }

      // Restore to memory cache
      this.memoryCache.set(fullKey, item);
      return item.value;
    } catch (e) {
      return null;
    }
  }

  remove(key) {
    const fullKey = `${this.namespace}:${key}`;
    this.memoryCache.delete(fullKey);
    try {
      localStorage.removeItem(fullKey);
    } catch (e) {}
  }

  clearExpired() {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(this.namespace)) {
          try {
            const item = JSON.parse(localStorage.getItem(k));
            if (item && item.expiresAt && Date.now() > item.expiresAt) {
              localStorage.removeItem(k);
            }
          } catch (e) {}
        }
      });
    } catch (e) {}
  }
}

const appCache = new CacheManager();
appCache.clearExpired();
