# Support Memory Reliability Layer

## Scenario

**Your stakeholder:** Lina Farouk, Head of Customer Operations at Aster Support

**The problem:** Aster Support is building an AI assistant for account managers. The assistant should remember customer history, active tickets, account policies, preferences, contradictions, and stale facts over time. Today the team has raw event exports from multiple systems, but no reliable memory layer. Lina needs a small service that can ingest events, preserve evidence, extract useful facts, keep facts scoped to the right account/contact/ticket, and return compact context for a support rep question.

You are not expected to build a full production service. Build the smallest credible version that proves your architecture, reliability thinking, and product judgment.

## AI Tooling Policy

For this first work sample, use any AI tools available to you: free ChatGPT, Claude, Copilot, Cursor, Codex, or similar. We are not evaluating which subscription you already have. We are evaluating how you think with AI: how you decompose the task, give context, verify outputs, catch errors, and communicate tradeoffs.

Candidates who advance may receive company-provided access to a frontier AI coding model for a finalist assessment, with an expected budget of 100,000 tokens.

Include an exported or shareable AI chat log when you submit if your tool allows it. If your free tool cannot export a clean link, describe how you used it in your notes.

## Business Questions

1. What does the system currently believe about a specific account or contact, and what source events support those beliefs?
2. Which facts are contradicted, stale, ambiguous, or unsafe to use without human review?
3. Can duplicate retries be replayed without creating duplicate facts or inflating confidence?
4. Can a rep ask for context on an account or ticket and receive a compact, evidence-linked answer?

## Core Requirements

Build a small local memory service or CLI that can:

- ingest the provided events and preserve the raw event records
- derive useful facts/claims from the event text and payloads
- link every derived fact back to its source event IDs
- keep memory scoped by entity type and entity ID
- detect or surface duplicates, contradictions, stale facts, and ambiguous identity matches
- return compact context for a question such as `What should the support rep know before calling Helios?`
- expose an explain view for a fact or belief, showing why the system believes it
- handle duplicate retries with an idempotency key or document the exact design you would implement next

## Data Model

You have **20 Memory Event records**. Each record has these fields:

| Field | Type |
|-------|------|
| `event_id` | string |
| `idempotency_key` | string |
| `occurred_at` | datetime |
| `source` | One of: crm,contract,chat,email,agent_note,system |
| `actor` | string |
| `entity_type` | One of: account,contact,ticket,policy |
| `entity_id` | string |
| `related_entity_ids` | Array of strings |
| `reliability` | One of: high,medium,low |
| `text` | text |
| `payload` | JSON object |

## What We Are Evaluating

We are evaluating how you think and ship with AI, not whether you can guess our preferred implementation. A strong submission is clear, testable, honest about tradeoffs, and grounded in the evidence.

Specifically, we are looking for:

1. **Architecture judgment** - clean separation between raw events, derived facts, entity-scoped memory, and runtime context.
2. **Reliability thinking** - duplicate retry, idempotency, partial failure, and replay behavior are handled or precisely specified.
3. **Traceability** - important answers cite the source events that support them.
4. **Conflict handling** - conflicting, stale, and ambiguous facts are not silently flattened.
5. **AI-native workflow** - you use AI as a thinking/coding partner, then verify its output.
6. **Communication** - your repo should make it easy for a reviewer to understand what shipped, what is incomplete, and what you would do next.

## Deliverables

Push everything to a GitHub repo and submit the link. Your repo should contain:

- `README.md` - setup, run instructions, design summary, and tradeoffs
- `ARCHITECTURE.md` - event/fact/entity/context model, reliability assumptions, and what you intentionally did not build
- working code - a CLI, REST API, or small local app is fine
- tests or a runnable verification script
- sample outputs for at least one account-level context request and one fact/belief explanation
- `DAILY_UPDATE.md` - the update you would post at the end of the day: branch, commit range, files changed, what shipped, tests/results, blockers, next step
- optional: `NEXT.md` - what you would build next if this became production

## Rules

- You may use any AI tools: Claude, ChatGPT, Cursor, Codex, Copilot, or similar.
- Include a link to your AI chat log when you submit. We are not penalizing AI use; we are evaluating how you use it.
- Use any stack you like, but keep it easy to run locally.
- Time limit: 3 hours from when you receive this brief, with a 15-minute grace period.
- Prefer a focused, well-tested slice over a large unfinished system.
- Do not silently guess when the data is ambiguous. Surface uncertainty.

## Starter Questions To Prove

- What should a support rep know before calling Helios Apps?
- Which facts about Helios changed over time, and which source should win?
- Which account-specific policy should not leak to other accounts?
- Which records look like duplicate retries or idempotency conflicts?
- Which contacts should not be merged without human review?

## Mid-Test Scope Change

At some point, imagine Lina asks: "Can you also show what changed since the last context build?" If you can implement it, do. If not, describe the digest/diff design you would use.

## Seed Data

```json
[
  {
    "event_id": "evt-1001",
    "idempotency_key": "idem-1001",
    "occurred_at": "2026-04-01T09:00:00Z",
    "source": "crm",
    "actor": "system",
    "entity_type": "account",
    "entity_id": "acct_helios_289",
    "related_entity_ids": [],
    "reliability": "medium",
    "text": "Account created: Helios Apps. Segment: mid-market. Region: Cairo. Current plan recorded as Starter.",
    "payload": {
      "account_name": "Helios Apps",
      "plan": "Starter",
      "region": "Cairo"
    }
  },
  {
    "event_id": "evt-1002",
    "idempotency_key": "idem-1002",
    "occurred_at": "2026-04-01T09:07:00Z",
    "source": "agent_note",
    "actor": "Yara",
    "entity_type": "contact",
    "entity_id": "contact_mona_289",
    "related_entity_ids": [
      "acct_helios_289"
    ],
    "reliability": "medium",
    "text": "Mona Salem is the main contact for Helios. She prefers WhatsApp for urgent support and usually answers after 4pm Cairo time.",
    "payload": {
      "contact_name": "Mona Salem",
      "preference": "WhatsApp",
      "account_id": "acct_helios_289"
    }
  },
  {
    "event_id": "evt-1003",
    "idempotency_key": "idem-1003",
    "occurred_at": "2026-04-02T13:12:00Z",
    "source": "contract",
    "actor": "contract_importer",
    "entity_type": "account",
    "entity_id": "acct_helios_289",
    "related_entity_ids": [],
    "reliability": "high",
    "text": "Signed addendum says Helios upgraded to Enterprise Support effective 2026-04-02. P1 response target is 2 hours. Phone escalation is included.",
    "payload": {
      "plan": "Enterprise Support",
      "p1_response_hours": 2,
      "phone_escalation": true
    }
  },
  {
    "event_id": "evt-1004",
    "idempotency_key": "idem-1004",
    "occurred_at": "2026-04-04T10:00:00Z",
    "source": "chat",
    "actor": "Mona Salem",
    "entity_type": "ticket",
    "entity_id": "ticket_h_289_p1",
    "related_entity_ids": [
      "acct_helios_289",
      "contact_mona_289"
    ],
    "reliability": "medium",
    "text": "Production dashboard is down for Helios. Mona asks for immediate phone escalation and says the finance team is blocked.",
    "payload": {
      "priority": "P1",
      "symptom": "dashboard_down"
    }
  },
  {
    "event_id": "evt-1005",
    "idempotency_key": "idem-1005",
    "occurred_at": "2026-04-04T10:01:00Z",
    "source": "chat",
    "actor": "M. Salem",
    "entity_type": "ticket",
    "entity_id": "ticket_h_289_p1",
    "related_entity_ids": [
      "acct_helios_289",
      "contact_m_salem_289"
    ],
    "reliability": "medium",
    "text": "M. Salem repeats: dashboard outage is blocking finance. This appears to be the same incident as the prior message.",
    "payload": {
      "priority": "P1",
      "possible_duplicate_of": "evt-1004"
    }
  },
  {
    "event_id": "evt-1006",
    "idempotency_key": "idem-1006",
    "occurred_at": "2026-04-04T10:20:00Z",
    "source": "agent_note",
    "actor": "Yara",
    "entity_type": "ticket",
    "entity_id": "ticket_h_289_p1",
    "related_entity_ids": [
      "acct_helios_289"
    ],
    "reliability": "medium",
    "text": "Agent note: Helios has 42 affected seats according to the first incident screen share.",
    "payload": {
      "affected_seats": 42
    }
  },
  {
    "event_id": "evt-1007",
    "idempotency_key": "idem-1007",
    "occurred_at": "2026-04-04T10:32:00Z",
    "source": "email",
    "actor": "Mona Salem",
    "entity_type": "ticket",
    "entity_id": "ticket_h_289_p1",
    "related_entity_ids": [
      "acct_helios_289"
    ],
    "reliability": "medium",
    "text": "Follow-up from Mona: the affected user count is 48, not 42. She says the first number was from an old dashboard.",
    "payload": {
      "affected_seats": 48,
      "correction": true
    }
  },
  {
    "event_id": "evt-1008",
    "idempotency_key": "idem-1008",
    "occurred_at": "2026-04-04T11:00:00Z",
    "source": "system",
    "actor": "retry_worker",
    "entity_type": "ticket",
    "entity_id": "ticket_h_289_p1",
    "related_entity_ids": [
      "acct_helios_289"
    ],
    "reliability": "medium",
    "text": "Retry of evt-1004 with the same idempotency key and same body. This should not create a new logical event.",
    "payload": {
      "retry_of": "evt-1004",
      "same_body": true
    }
  },
  {
    "event_id": "evt-1009",
    "idempotency_key": "idem-1008",
    "occurred_at": "2026-04-04T11:01:00Z",
    "source": "system",
    "actor": "retry_worker",
    "entity_type": "ticket",
    "entity_id": "ticket_h_289_billing",
    "related_entity_ids": [
      "acct_helios_289"
    ],
    "reliability": "medium",
    "text": "BUG SIMULATION: same idempotency key as evt-1008 but different body and different ticket. This should be treated as a conflict.",
    "payload": {
      "retry_bug": true,
      "different_body": true
    }
  },
  {
    "event_id": "evt-1010",
    "idempotency_key": "idem-1010",
    "occurred_at": "2026-04-05T08:30:00Z",
    "source": "agent_note",
    "actor": "Omar",
    "entity_type": "account",
    "entity_id": "acct_nova_289",
    "related_entity_ids": [],
    "reliability": "medium",
    "text": "Nova Clinic is a healthcare customer. Their admin contact says support must never use customer data for model training.",
    "payload": {
      "account_name": "Nova Clinic",
      "policy_hint": "no_training"
    }
  },
  {
    "event_id": "evt-1011",
    "idempotency_key": "idem-1011",
    "occurred_at": "2026-04-05T09:20:00Z",
    "source": "contract",
    "actor": "contract_importer",
    "entity_type": "policy",
    "entity_id": "policy_nova_289_privacy",
    "related_entity_ids": [
      "acct_nova_289"
    ],
    "reliability": "high",
    "text": "Data Processing Addendum for Nova Clinic: no customer data may be used for training, demos, or analytics outside the Nova account.",
    "payload": {
      "scope_account_id": "acct_nova_289",
      "no_training": true,
      "no_cross_account_analytics": true
    }
  },
  {
    "event_id": "evt-1012",
    "idempotency_key": "idem-1012",
    "occurred_at": "2026-04-05T10:05:00Z",
    "source": "chat",
    "actor": "Support Rep",
    "entity_type": "account",
    "entity_id": "acct_delta_289",
    "related_entity_ids": [],
    "reliability": "low",
    "text": "Rep says maybe Delta Stores has the same privacy restriction as Nova, but no contract is attached.",
    "payload": {
      "account_name": "Delta Stores",
      "unverified_policy_guess": true
    }
  },
  {
    "event_id": "evt-1013",
    "idempotency_key": "idem-1013",
    "occurred_at": "2026-04-06T12:40:00Z",
    "source": "email",
    "actor": "Mona Salem",
    "entity_type": "contact",
    "entity_id": "contact_mona_289",
    "related_entity_ids": [
      "acct_helios_289"
    ],
    "reliability": "medium",
    "text": "Mona asks the team to stop using WhatsApp for Helios support. New compliance rule: email only unless there is a P1 outage.",
    "payload": {
      "preference": "email_only_except_p1",
      "supersedes": "WhatsApp preference"
    }
  },
  {
    "event_id": "evt-1014",
    "idempotency_key": "idem-1014",
    "occurred_at": "2026-04-06T13:10:00Z",
    "source": "crm",
    "actor": "system",
    "entity_type": "contact",
    "entity_id": "contact_m_salem_289",
    "related_entity_ids": [
      "acct_helios_289"
    ],
    "reliability": "medium",
    "text": "CRM import created M. Salem with the same phone number as Mona Salem but a different email. It may be the same person or an assistant account.",
    "payload": {
      "phone": "+20 10 5555 0142",
      "email": "m.salem-assistant@example.test"
    }
  },
  {
    "event_id": "evt-1015",
    "idempotency_key": "idem-1015",
    "occurred_at": "2026-04-07T15:55:00Z",
    "source": "email",
    "actor": "Omar Adel",
    "entity_type": "contact",
    "entity_id": "contact_omar_289",
    "related_entity_ids": [
      "acct_nova_289"
    ],
    "reliability": "medium",
    "text": "Omar Adel shares phone +20 10 5555 0142 with Mona Salem in one email footer. He signs as Nova Clinic procurement. Do not merge contacts without more evidence.",
    "payload": {
      "phone": "+20 10 5555 0142",
      "warning": "shared_phone_ambiguous"
    }
  },
  {
    "event_id": "evt-1016",
    "idempotency_key": "idem-1016",
    "occurred_at": "2026-04-08T09:00:00Z",
    "source": "agent_note",
    "actor": "Yara",
    "entity_type": "ticket",
    "entity_id": "ticket_n_289_security",
    "related_entity_ids": [
      "acct_nova_289",
      "contact_omar_289"
    ],
    "reliability": "medium",
    "text": "Nova security ticket: Omar asks whether exports include patient names. Needs written answer before renewal call.",
    "payload": {
      "priority": "P2",
      "topic": "patient_data_exports"
    }
  },
  {
    "event_id": "evt-1017",
    "idempotency_key": "idem-1017",
    "occurred_at": "2026-04-08T10:30:00Z",
    "source": "contract",
    "actor": "contract_importer",
    "entity_type": "account",
    "entity_id": "acct_nova_289",
    "related_entity_ids": [],
    "reliability": "high",
    "text": "Nova renewal order: plan is Business, not Enterprise. Standard response target is next business day except security incidents.",
    "payload": {
      "plan": "Business",
      "standard_response": "next_business_day"
    }
  },
  {
    "event_id": "evt-1018",
    "idempotency_key": "idem-1018",
    "occurred_at": "2026-04-09T16:20:00Z",
    "source": "agent_note",
    "actor": "Yara",
    "entity_type": "account",
    "entity_id": "acct_helios_289",
    "related_entity_ids": [],
    "reliability": "low",
    "text": "Old note from March says Helios was on Starter and had email-only support. This may now be stale because of the April addendum.",
    "payload": {
      "old_fact": true,
      "plan": "Starter"
    }
  },
  {
    "event_id": "evt-1019",
    "idempotency_key": "idem-1019",
    "occurred_at": "2026-04-10T11:00:00Z",
    "source": "system",
    "actor": "status_sync",
    "entity_type": "ticket",
    "entity_id": "ticket_h_289_p1",
    "related_entity_ids": [
      "acct_helios_289"
    ],
    "reliability": "high",
    "text": "Ticket status changed to resolved. Resolution: cache invalidation bug fixed. Customer confirmed dashboard restored.",
    "payload": {
      "status": "resolved",
      "root_cause": "cache_invalidation"
    }
  },
  {
    "event_id": "evt-1020",
    "idempotency_key": "idem-1020",
    "occurred_at": "2026-04-10T11:10:00Z",
    "source": "email",
    "actor": "Mona Salem",
    "entity_type": "account",
    "entity_id": "acct_helios_289",
    "related_entity_ids": [],
    "reliability": "medium",
    "text": "Mona asks for a postmortem by Monday and wants the assistant to remember that Helios cares most about finance dashboard uptime.",
    "payload": {
      "preference": "finance_dashboard_uptime",
      "requested_artifact": "postmortem"
    }
  }
]
```