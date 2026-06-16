# Architecture

src/
│
├── modules/
│   ├── events/
│   ├── facts/
│   ├── context/
│   ├── explain/
│   └── reliability/
│
├── services/
│   ├── ingestion.service.ts
│   ├── fact-extractor.service.ts
│   ├── context-builder.service.ts
│   └── explain.service.ts
│
├── db/
│   ├── schema.sql
│   └── seed.ts
│
├── routes/
│   ├── ingest.route.ts
│   ├── context.route.ts
│   └── explain.route.ts
│
└── tests/


memory-service/
│
├── data/
│   └── seed-events.json
│
├── src/
│   ├── db/
│   │   ├── database.js
│   │   ├── schema.js
│   │   └── seed.js
│   │
│   ├── services/
│   │   ├── ingestion.service.js
│   │   ├── factExtractor.service.js
│   │   ├── context.service.js
│   │   └── explain.service.js
│   │
│   ├── routes/
│   │   ├── context.routes.js
│   │   └── explain.routes.js
│   │
│   └── server.js
│
├── README.md
├── ARCHITECTURE.md
├── DAILY_UPDATE.md
│
└── package.json