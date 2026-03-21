# Portfolio Chatbot PRD

## 1. Document Info

- Project: AI Chatbot for portfolio website
- Product type: Embedded website assistant
- Stack baseline: Next.js 15 App Router + Sanity CMS
- Status: Planning approved, implementation not started
- Current phase: PRD finalized

## 2. Product Vision

Build a production-grade chatbot that represents the portfolio owner with high quality responses, retrieves factual context from portfolio data, streams replies in real time, stores conversations for insights, and safely handles abuse.

## 3. Goals

- Provide fast, natural visitor support about projects, skills, contact, resume, and availability.
- Improve conversion by routing visitors to meaningful actions.
- Let qualified visitors book interview meetings automatically from available time slots.
- Send automated email confirmations after successful booking.
- Maintain factual correctness using retrieval-augmented generation (RAG).
- Capture conversation analytics and lead intent.
- Keep operational risk and AI cost controlled with strict guardrails.

## 4. Non-Goals (Phase 1)

- No voice assistant.
- No autonomous tool execution by the AI.
- No multi-language localization.
- No custom dashboard UI in first release (can start with DB-driven reporting queries).

## 5. Target Users

- Recruiters checking profile fit.
- Potential clients evaluating services and portfolio quality.
- Collaborators exploring technical capabilities.

## 6. Key User Outcomes

- Visitors get relevant answers in under a few seconds with visible streaming.
- Visitors can quickly discover projects, resume, and contact options.
- Owner gets structured data on what visitors ask most.

## 7. Success Metrics

- Chat start rate: percentage of sessions that open chatbot.
- Engagement depth: average turns per conversation.
- Resolution proxy: percentage of conversations with clear CTA click or lead captured.
- Response latency:
  - Time to first token (TTFT) under 1.2s target.
  - Full response under 6s target for normal prompts.
- Safety:
  - Rate-limit violation handling at 100%.
  - Prompt-injection bypass rate under defined threshold in testing.

## 8. Final Architecture

```text
Visitor Message
			↓
Next.js Frontend (Tailwind + Framer Motion)
			↓
/api/chat (Next.js API Route)
			↓
Rate Limiter (Upstash) → reject if abused
			↓
Intent Detector → classify visitor need
			↓
MongoDB Vector Search → retrieve relevant context
			↓
Prompt Builder → compose constrained prompt
			↓
Google Gemini API (via Vercel AI SDK) → streaming response
			↓
Booking Orchestrator (for BOOKING intent)
			↓
Calendar Provider API → check availability + create event
			↓
Email Provider (Resend) → send booking confirmation
			↓
Persist conversation + analytics to MongoDB
			↓
Stream tokens to visitor UI
```

## 9. System Components

### 9.1 Frontend

- Floating chat launcher.
- Expandable chat window with mobile-first behavior.
- Streaming message renderer.
- Suggested question chips on first load.
- Typing indicator and failure state handling.

### 9.2 API Layer

- `POST /api/chat`: validate, limit, classify intent, retrieve context, stream response, persist logs.
- `POST /api/embed`: trigger embedding pipeline manually or via secure automation.
- `POST /api/booking/availability`: return available interview slots.
- `POST /api/booking/create`: reserve slot, create event, trigger confirmation email.

### 9.3 Intelligence Layer

- Intent detector with deterministic fallback to `GENERAL`.
- Prompt builder with four sections: identity, rules, context, intent instructions.
- RAG retriever using top-k vector search and metadata filtering.

### 9.4 Data Layer

- Sanity as source of truth for portfolio content.
- MongoDB for conversations, embeddings, analytics, and leads.

## 10. Intent Taxonomy (Phase 1)

- `AVAILABILITY`
- `BOOKING`
- `PROJECTS`
- `CONTACT`
- `RESUME`
- `ABOUT`
- `GENERAL`

### 10.1 Intent Handling Rules

- Each intent maps to intent-specific response constraints.
- If confidence is low, fallback to `GENERAL` with safe guidance.
- For `BOOKING`, assistant should collect minimum required details and call booking workflow.
- If booking fails, assistant should provide fallback contact options and retry guidance.

## 11. Data Model Plan

### 11.1 Sanity Content Scope

- Projects
- Skills
- About/Bio
- FAQs
- Work experience
- Testimonials

### 11.2 MongoDB Collections

- `conversations`
- `leads`
- `embeddings`
- `analytics`
- `bookings`

### 11.3 Suggested Field Design

- `conversations`: sessionId, userMessage, assistantMessage, intent, contextChunkIds, timestamps, tokenUsage.
- `leads`: sessionId, optional name/email, inferred interest, consent flags, timestamps.
- `embeddings`: sourceType, sourceId, chunkText, embeddingVector, metadata tags, updatedAt.
- `analytics`: eventType, intent, latency, status, route, timestamp, sessionId.
- `bookings`: sessionId, visitorName, visitorEmail, timezone, slotStart, slotEnd, calendarEventId, status, createdAt.

## 12. RAG and Embedding Pipeline

### 12.1 Pipeline Steps

1. Pull content from Sanity.
2. Normalize and chunk text with metadata.
3. Generate embeddings.
4. Upsert vectors into MongoDB.
5. Track version/hash for change detection.

### 12.2 Re-Embed Triggers

- New or updated project.
- Bio updates.
- Skills changes.
- FAQ or experience changes.

### 12.3 Retrieval Strategy

- Retrieve top 3 to 5 chunks.
- Prefer recency and type-aware weighting.
- Inject only relevant snippets to keep prompts lean.

## 13. Prompt Design Standard

### 13.1 Static Sections

- Identity/persona.
- Safety and factuality rules.

### 13.2 Dynamic Sections

- Retrieved context snippets.
- Intent-specific instruction block.
- Last 6 message turns only.

### 13.3 Hard Constraints

- No fabrication of skills/projects.
- If uncertain, request user clarification or direct to contact.
- Keep answers concise and useful.

## 14. Security and Abuse Controls

1. Upstash rate limiting by IP and session.
2. Input schema validation with Zod.
3. Input sanitization and max length enforcement.
4. Prompt-injection resistant prompt boundaries.
5. API keys server-side only.
6. Sensitive logging controls (no plaintext secrets).
7. Booking validation to prevent overlapping or invalid slots.
8. Email verification and consent check before sending confirmations.

## 15. UX Requirements

- Floating launcher with subtle motion.
- Open animation around 400ms.
- Desktop: compact widget panel.
- Mobile: near full-screen chat view.
- First-load greeting plus 3 suggested prompts.
- Timestamps and typing indicator.
- Graceful error and retry state.

## 16. API Contracts (Planning-Level)

### 16.1 `POST /api/chat`

- Input:
  - sessionId (string)
  - message (string, max 500)
  - history (array, optional)
- Output:
  - streaming text response
  - metadata trailer/logging fields server-side
- Errors:
  - 400 invalid input
  - 429 rate-limited
  - 500 internal provider/retrieval failure

### 16.2 `POST /api/embed`

- Input:
  - secure token or internal trigger
  - optional content scope
- Output:
  - embedded count, failed count, run duration

### 16.3 `POST /api/booking/availability`

- Input:
  - timezone (string)
  - date range (start, end)
- Output:
  - available slots array
  - slot duration and booking constraints
- Errors:
  - 400 invalid request
  - 429 abuse protection
  - 500 provider failure

### 16.4 `POST /api/booking/create`

- Input:
  - visitorName (string)
  - visitorEmail (string)
  - timezone (string)
  - selectedSlot (start, end)
  - purpose (string, optional)
- Output:
  - booking id
  - calendar event id
  - email notification status
- Errors:
  - 400 invalid or stale slot
  - 409 slot already taken
  - 500 booking/email failure

## 17. Observability and Analytics

- Total conversations
- Most common intents
- Most asked queries (clustered)
- TTFT and full response latency
- Error rate by stage
- Lead events and conversion proxies
- Booking funnel metrics: slot viewed, slot selected, booking completed, email delivered

## 18. Dependencies Plan

```bash
npm install mongoose ai @ai-sdk/google openai @upstash/ratelimit @upstash/redis zod date-fns nanoid googleapis
```

Booking and calendar integration additions:

```bash
npm install googleapis
```

## 19. Environment Variables

```bash
# Database
MONGODB_URI=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# AI
OPENAI_API_KEY=

# Gemini
GOOGLE_GENERATIVE_AI_API_KEY=

# Rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=

# Booking and calendar
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_CALENDAR_ID=
BOOKING_SLOT_DURATION_MINUTES=

# Email notifications
RESEND_API_KEY=
BOOKING_FROM_EMAIL=
```

## 20. Proposed Project Structure Additions

```text
src/
	app/
		api/
			chat/
				route.ts
			embed/
				route.ts
			booking/
				availability/
					route.ts
				create/
					route.ts
	lib/
		db/
			mongoose.ts
			models/
				Conversation.ts
				Lead.ts
				Embedding.ts
				Booking.ts
		ai/
			prompt-builder.ts
			intent-detector.ts
			rag.ts
			embedder.ts
			booking-orchestrator.ts
		calendar/
			provider.ts
		email/
			booking-confirmation.ts
		sanity/
			context-fetcher.ts
	components/
		chat/
			ChatWidget.tsx
			ChatWindow.tsx
			ChatMessage.tsx
			ChatInput.tsx
			TypingIndicator.tsx
			SuggestedQuestions.tsx
scripts/
	embed-portfolio.ts
```

## 21. Implementation Roadmap

### Phase 1: Foundation

1. Configure MongoDB and base models.
2. Add server utilities for DB connection reuse.
3. Validate env management and secure defaults.

### Phase 2: Knowledge Base

1. Build Sanity context fetcher.
2. Build embedding pipeline script.
3. Store vectors and verify retrieval quality.

### Phase 3: Chat Core

1. Build `POST /api/chat` streaming route.
2. Add intent detection and prompt builder.
3. Add RAG retrieval and response post-processing.

### Phase 4: Safety + Persistence

1. Add Upstash rate limits.
2. Add Zod validation and sanitization.
3. Persist conversation, booking, and analytics events.

### Phase 5: UI Integration

1. Build chat widget and message components.
2. Integrate streaming endpoint.
3. Add mobile responsiveness and motion polish.

### Phase 6: Booking Automation

1. Implement availability endpoint and calendar provider integration.
2. Implement booking create endpoint with race-condition safe slot checks.
3. Add confirmation email workflow and retry-safe delivery logs.

### Phase 7: QA + Launch

1. End-to-end test critical flows.
2. Load and abuse testing for route stability.
3. Production deploy and monitoring checks.

## 22. Risks and Mitigations

- Hallucination risk: strict context-only policy and refusal fallback.
- Cost spikes: Gemini free tier covers up to 2M tokens/month, rate limited at 60 req/min.
- Retrieval irrelevance: chunking quality checks and metadata tuning.
- Latency drift: cache stable context and cap history window.
- Abuse traffic: layered rate limits and bot detection heuristics.

## 23. Definition of Done (Phase 1 Release)

- Chat widget is usable on desktop and mobile.
- Answers stream in real time.
- Responses are grounded in portfolio content.
- Conversation logs are stored with basic analytics.
- Rate limit and validation protections are active.
- Key flows pass QA checklist.

## 24. Definition of Done (Booking Automation Release)

- Visitor can view available slots from live calendar availability.
- Visitor can complete interview booking from chat flow.
- Event is created in calendar with correct timezone conversion.
- Confirmation email is sent to visitor and owner.
- Failed booking or email states are logged and recoverable.
- Duplicate booking conflicts are safely rejected.

## 25. Immediate Next Step (No Coding Yet)

In the next step, we will start implementation from Phase 1 only:

1. Finalize environment variables.
2. Install required dependencies.
3. Add MongoDB connection utility.
4. Add MongoDB schemas.

No code is implemented in this PRD update. This document is now the execution blueprint.

## 26. Cost Breakdown (100% FREE TIER)

| Service           | Tier         | Cost         | Usage                         |
| ----------------- | ------------ | ------------ | ----------------------------- |
| Google Gemini API | Free         | $0           | 2M tokens/month (60 req/min)  |
| OpenAI Embeddings | Free         | $0           | Embed once, re-run on updates |
| MongoDB Atlas     | Free         | $0           | 512 MB storage                |
| Upstash Redis     | Free         | $0           | 10k commands/day              |
| Resend Email      | Free         | $0           | 100 emails/day                |
| Google Calendar   | Free         | $0           | Your personal account         |
| Vercel            | Free         | $0           | Deployed site                 |
| Sanity CMS        | Free         | $0           | Portfolio content             |
| **TOTAL**         | **ALL FREE** | **$0/month** | ✅                            |

With Gemini free tier: **2,000,000 tokens per month free**

- 10 visitors/day × 500 tokens/chat = 5,000 tokens/day = 150,000/month (✅ well under limit)
- 100 visitors/day = 1.5M tokens/month (✅ still free)
- 200 visitors/day = 3M tokens/month (❌ exceeds Gemini free tier, would need paid plan)

**Recommendation:** Start free, monitor token usage. If you exceed 2M tokens/month, Gemini pro pricing is ~$0.075 per 1M input tokens (still cheaper than Claude).
