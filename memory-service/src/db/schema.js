const db = require("./database");

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      event_id TEXT PRIMARY KEY,
      idempotency_key TEXT,
      occurred_at TEXT,
      source TEXT,
      actor TEXT,
      entity_type TEXT,
      entity_id TEXT,
      reliability TEXT,
      text TEXT,
      payload TEXT
    )
  `);

});

db.run(`
CREATE TABLE IF NOT EXISTS facts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT,
    entity_id TEXT,
    fact_type TEXT,
    fact_value TEXT,
    status TEXT DEFAULT 'active',
    confidence REAL DEFAULT 1.0,
    created_at TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS fact_evidence (
    fact_id INTEGER,
    event_id TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS idempotency_conflicts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idempotency_key TEXT,
    original_event TEXT,
    conflicting_event TEXT
)
`);