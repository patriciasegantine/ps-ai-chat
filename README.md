# AI Chat

A streaming AI chat app built with Next.js and the [Vercel AI SDK](https://ai-sdk.dev). It talks to GPT-4o through [OpenRouter](https://openrouter.ai) and uses tool calling, so the model can fetch live data and the UI can render the results as components.

## Features

- **Streaming responses** via `streamText` and `useChat`.
- **Tool calling** with up to 5 steps per request:
  - `githubProfile` fetches a GitHub user's profile through Octokit and renders it as a profile card.
  - `fetchHTTP` fetches the raw text of a URL (truncated to 5,000 characters) so the model can read and summarise it.
- **Markdown rendering** with GitHub Flavoured Markdown. Content is split into memoised blocks, so only the block that changes re-renders while streaming.
- **Tool feedback** shows a loading indicator while a tool runs and an inline message if it fails.
- **Chat UX**: auto-scroll while streaming, a "Scroll down" button and <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> to send.
- **Error handling**: the user sees a generic message and the details are logged on the server.

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| AI | AI SDK v6 (`ai`, `@ai-sdk/react`), `@openrouter/ai-sdk-provider` |
| Integrations | `@octokit/rest` (GitHub API) |
| Validation | Zod |
| Styling | Tailwind CSS v4, `@tailwindcss/typography`, `tailwind-scrollbar`, `lucide-react` |
| Markdown | `react-markdown`, `remark-gfm`, `marked` |

## Getting started

### Prerequisites

- Node.js 20.9 or later
- An [OpenRouter API key](https://openrouter.ai/keys)

### Setup

```bash
npm install
cp .env.sample .env.local
```

Add your key to `.env.local`:

```env
OPENROUTER_API_KEY=your-key-here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try prompts such as:

- "Show me the GitHub profile of `vercel`"
- "Summarise the content of https://example.com"

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── ai/
│   ├── open-router.ts          # OpenRouter provider instance
│   └── tools/
│       ├── index.ts            # Tool registry and shared types
│       ├── github_profile.ts   # githubProfile tool
│       └── http_fetch.ts       # fetchHTTP tool
├── app/
│   ├── api/ai/route.ts         # POST endpoint: streamText + tools
│   ├── components/             # Chat UI components
│   ├── layout.tsx
│   └── page.tsx
└── lib/
    └── octokit.ts              # GitHub API client
```

## How it works

1. `Chat` uses `useChat` with a `DefaultChatTransport` pointed at `/api/ai`.
2. The route converts the UI messages to model messages and calls `streamText` with the registered tools. It stops after 5 steps.
3. The response is streamed back with `toUIMessageStreamResponse`.
4. The client renders each message part: text goes through `Markdown`, and tool parts show a loading state, an error or a custom component (such as `GithubProfile`).

### Adding a tool

1. Create the tool in `src/ai/tools/` using `tool()` with a Zod `inputSchema`.
2. Register it in `src/ai/tools/index.ts`.
3. Optionally, add a loading label to `toolLabels` and a custom renderer in `chat.tsx`.

## Known limitations

- Conversations are not saved yet, so they are lost on reload. The sidebar, chat history and header components are UI mock-ups that haven't been wired up yet.
- `fetchHTTP` accepts any URL and has no SSRF protection. Don't deploy it publicly as it stands.
- Octokit runs unauthenticated, so GitHub limits it to 60 requests per hour.

## Further reading

[AI-CONCEPTS.md](AI-CONCEPTS.md) compares fine-tuning, embeddings/RAG, vector stores and tool calling.
