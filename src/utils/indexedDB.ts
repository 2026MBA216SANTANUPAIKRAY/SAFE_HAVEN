import { LocalIncidentRecord } from '../types';

const DB_NAME = 'safehaven_sovereign_db';
const DB_VERSION = 1;
const INCIDENTS_STORE = 'incidents';
const METADATA_STORE = 'metadata';

// In-memory fallback if IndexedDB is restricted in iframe/private browsing
const memoryStore: {
  incidents: Map<string, LocalIncidentRecord>;
  metadata: Map<string, any>;
} = {
  incidents: new Map(),
  metadata: new Map(),
};

const INITIAL_INCIDENTS: LocalIncidentRecord[] = [
  {
    id: 'FA-1048',
    title: 'Rapid Postural Drop Detected',
    type: 'fall_alert',
    timestamp: 'Today, 8:43:12 PM',
    rawTimestamp: Date.now() - 1000 * 60 * 35,
    status: 'Resolved',
    sensorZone: 'Parents Suite & Hallway (Pod 04)',
    peakImpact: '74G',
    acousticLevel: '82 dB',
    vitalsRate: '18 br/m (Stable)',
    notesCount: 2,
    syncStatus: 'local_indexeddb_only',
    description: 'mmWave radar unregistered velocity spike followed by 0.12m floor clearance drop. Physical assistance confirmed by Guard Ramesh. Zero optical frames captured.',
    encryptedVoxelHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'DB-2209',
    title: 'Front Gate Delivery Intercom Session',
    type: 'doorbell',
    timestamp: 'Today, 3:45:10 PM',
    rawTimestamp: Date.now() - 1000 * 60 * 60 * 5,
    status: 'Resolved',
    sensorZone: 'Front Gate (Voice-Mask Cam)',
    peakImpact: 'N/A',
    acousticLevel: '64 dB',
    vitalsRate: 'N/A',
    notesCount: 1,
    syncStatus: 'local_indexeddb_only',
    description: 'Blinkit courier drop verified. Baritone DSP pitch-shift applied (84 Hz output). Raw audio buffer shredded immediately after disconnection.',
    encryptedVoxelHash: 'sha256-7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    id: 'RAD-0914',
    title: 'Gait Asymmetry Diagnostic Cluster',
    type: 'radar_anomaly',
    timestamp: 'Yesterday, 11:20:00 PM',
    rawTimestamp: Date.now() - 1000 * 60 * 60 * 22,
    status: 'Resolved',
    sensorZone: 'Living Area to Restroom Corridor',
    peakImpact: 'N/A',
    acousticLevel: '34 dB',
    vitalsRate: '16 br/m',
    notesCount: 0,
    syncStatus: 'local_indexeddb_only',
    description: 'Minor hesitation pattern detected on night bathroom route. Automated floor nightlight relay triggered. No fall registered.',
    encryptedVoxelHash: 'sha256-ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
  }
];

// Open native IndexedDB with safe fallback
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(INCIDENTS_STORE)) {
          const incidentStore = db.createObjectStore(INCIDENTS_STORE, { keyPath: 'id' });
          incidentStore.createIndex('timestamp', 'rawTimestamp', { unique: false });
          incidentStore.createIndex('type', 'type', { unique: false });
          incidentStore.createIndex('status', 'status', { unique: false });
        }
        if (!db.objectStoreNames.contains(METADATA_STORE)) {
          db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Initialize local database and seed with initial incidents if empty
 */
export async function initLocalDatabase(): Promise<boolean> {
  try {
    const db = await openDB();
    const tx = db.transaction([INCIDENTS_STORE, METADATA_STORE], 'readwrite');
    const store = tx.objectStore(INCIDENTS_STORE);

    const countReq = store.count();
    countReq.onsuccess = () => {
      if (countReq.result === 0) {
        for (const inc of INITIAL_INCIDENTS) {
          store.add(inc);
        }
      }
    };

    const metaStore = tx.objectStore(METADATA_STORE);
    metaStore.put({ key: 'lastInitialized', value: Date.now() });

    return true;
  } catch (err) {
    console.warn('IndexedDB unavailable, utilizing secure in-memory browser store:', err);
    if (memoryStore.incidents.size === 0) {
      for (const inc of INITIAL_INCIDENTS) {
        memoryStore.incidents.set(inc.id, inc);
      }
    }
    return false;
  }
}

/**
 * Fetch all incidents from IndexedDB
 */
export async function getLocalIncidents(): Promise<LocalIncidentRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(INCIDENTS_STORE, 'readonly');
      const store = tx.objectStore(INCIDENTS_STORE);
      const req = store.getAll();

      req.onsuccess = () => {
        const results: LocalIncidentRecord[] = req.result || [];
        if (results.length === 0) {
          // Seed in memory if store was empty
          resolve([...INITIAL_INCIDENTS]);
        } else {
          // Sort descending by rawTimestamp
          results.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
          resolve(results);
        }
      };

      req.onerror = () => {
        resolve(Array.from(memoryStore.incidents.values()));
      };
    });
  } catch {
    if (memoryStore.incidents.size === 0) {
      for (const inc of INITIAL_INCIDENTS) {
        memoryStore.incidents.set(inc.id, inc);
      }
    }
    return Array.from(memoryStore.incidents.values()).sort(
      (a, b) => b.rawTimestamp - a.rawTimestamp
    );
  }
}

/**
 * Add or update an incident in IndexedDB
 */
export async function saveLocalIncident(incident: LocalIncidentRecord): Promise<void> {
  memoryStore.incidents.set(incident.id, incident);

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(INCIDENTS_STORE, 'readwrite');
      const store = tx.objectStore(INCIDENTS_STORE);
      const req = store.put(incident);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Saved to memory fallback:', err);
  }
}

/**
 * Delete an incident by ID from IndexedDB
 */
export async function deleteLocalIncident(id: string): Promise<void> {
  memoryStore.incidents.delete(id);

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(INCIDENTS_STORE, 'readwrite');
      const store = tx.objectStore(INCIDENTS_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Deleted from memory fallback:', err);
  }
}

/**
 * Clear all incidents from IndexedDB
 */
export async function clearLocalIncidents(): Promise<void> {
  memoryStore.incidents.clear();

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(INCIDENTS_STORE, 'readwrite');
      const store = tx.objectStore(INCIDENTS_STORE);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Cleared memory fallback:', err);
  }
}

/**
 * Get storage metadata and estimated bytes
 */
export async function getLocalVaultStats(): Promise<{
  isIndexedDB: boolean;
  dbName: string;
  storeName: string;
  incidentCount: number;
  estimatedBytes: number;
  lastWrite: string;
}> {
  const incidents = await getLocalIncidents();
  const serialized = JSON.stringify(incidents);
  const estimatedBytes = new Blob([serialized]).size;

  let isIndexedDB = false;
  try {
    if (typeof window !== 'undefined' && window.indexedDB) {
      isIndexedDB = true;
    }
  } catch {
    isIndexedDB = false;
  }

  return {
    isIndexedDB,
    dbName: DB_NAME,
    storeName: INCIDENTS_STORE,
    incidentCount: incidents.length,
    estimatedBytes,
    lastWrite: incidents.length > 0 ? incidents[0].timestamp : 'No records'
  };
}

/**
 * Export full local IndexedDB database as a formatted cryptographic JSON string
 */
export async function exportLocalVaultJSON(): Promise<string> {
  const incidents = await getLocalIncidents();
  const payload = {
    schema: 'SafeHaven Sovereign Local-Only Audit Archive',
    version: '1.0.0',
    compliance: 'DPDP Act 2023 Statutory Exemption · Zero Cloud Synchronization',
    database: DB_NAME,
    exportedAt: new Date().toISOString(),
    recordCount: incidents.length,
    records: incidents
  };
  return JSON.stringify(payload, null, 2);
}
