# Fine-Tuning, Embedding/Search, Vector Stores and Tool Calling

## Quick summary

- **Fine-Tuning**: adjusts the model's behaviour for a specific style/task.
- **Embedding + Search-based (RAG)**: retrieves relevant passages from a knowledge base and sends them as context in the prompt.
- **Vector Store**: a database optimised for storing embeddings and searching by similarity.
- **Tool Calling**: allows the model to call functions/APIs to carry out real actions.

## How the concepts differ

### 1) Fine-Tuning

**What it is**
Additional training of the model on examples from your domain to change its behaviour, response format or performance on specific tasks.

**When to use it**
- When you need consistent style/output.
- When prompt engineering is not enough.
- When the task is repetitive and well defined.

**Things to watch out for**
- Upfront training cost.
- Requires a high-quality dataset.
- Not the best approach for knowledge that changes all the time.

---

### 2) Embedding + Search-based

**What it is**
You convert documents into vectors (embeddings), retrieve the passages closest to the question and inject that context into the prompt (RAG).

**When to use it**
- Internal knowledge bases (docs, manuals, policies).
- Content that changes frequently.
- When answers need to be grounded in sources.

**Things to watch out for**
- Quality depends on chunking, ranking and the prompt.
- Requires an indexing and update pipeline.

---

### 3) Vector Store

**What it is**
A storage and vector search layer for embeddings.

**What it is for**
- Storing embeddings at scale.
- Running fast similarity searches.
- Applying filters (metadata) by user, date, document type, etc.

**Important**
- A Vector Store does not replace the LLM.
- It supports the RAG flow, but does not "answer" on its own.

---

### 4) Tool Calling

**What it is**
A mechanism that allows the model to call external tools (APIs/functions/systems) during the conversation.

**When to use it**
- Real-time operations (exchange rates, weather, order status).
- Transactional actions (opening a ticket, sending an email, updating a CRM).
- Structured database queries.

**Things to watch out for**
- Requires parameter validation and security.
- Needs handling for timeouts, retries and observability.

## Side-by-side comparison

| Topic | Fine-Tuning | Embedding/Search | Vector Store | Tool Calling |
|---|---|---|---|---|
| Changes model weights | Yes | No | No | No |
| Updates knowledge quickly | Low | High | High (infra) | High (via external systems) |
| Performs external actions | No | No | No | Yes |
| Best for | Behaviour/style | Contextual knowledge | Scaling semantic search | Automation and integration |
| Main cost | Training and maintenance | Indexing and queries | Search infrastructure | Integration and operations |

## Rule of thumb (modern architecture)

In most cases, the best results come from combining:

1. **Embedding + Vector Store** for memory/knowledge.
2. **Tool Calling** for carrying out actions.
3. **Fine-Tuning** only when you need behavioural consistency beyond what prompt + RAG can deliver.

## Quick decision examples

- "I want to answer based on my internal PDF" -> **Embedding + Vector Store**.
- "I want the assistant to open tickets in Jira" -> **Tool Calling**.
- "I always want to answer in my standard legal format" -> **Fine-Tuning**.
- "I want all of the above" -> **RAG + Tool Calling**, and consider **Fine-Tuning** later.
