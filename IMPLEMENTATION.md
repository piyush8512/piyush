# Portfolio Chatbot - Implementation Guide

## Current Phase: PHASE 1 - Foundation Setup

**Status:** Starting Phase 1  
**Date Started:** March 20, 2026  
**Target Completion:** March 27, 2026

---

## 1. What We're Building

A production-grade AI chatbot for your portfolio website that:

- ✅ Answers visitor questions using your portfolio content
- ✅ Automatically books interviews from your calendar
- ✅ Sends automated confirmation emails
- ✅ Captures lead information and analytics
- ✅ Streams responses in real time
- ✅ Completely free (100% free tier)

---

## 2. Technology Stack (Final Decisions)

### AI & LLM

- **Model:** Google Gemini API (Free tier: 2M tokens/month)
- **SDK:** Vercel AI SDK for streaming
- **Why Gemini:** Free tier, fast, reliable for chatbots

### Database

- **Primary:** MongoDB Atlas (Free: 512 MB storage)
- **Cache:** Upstash Redis (Free: 10k commands/day)
- **CMS:** Sanity (Already configured)

### Calendar & Email

- **Calendar:** Google Calendar API (Free, your personal account)
- **Email:** Resend (Free: 100 emails/day)

### Hosting

- **Frontend:** Vercel (Free)
- **Rate Limiting:** Upstash Redis (Free)

### Real-Time

- **Streaming:** Server-Sent Events (SSE) via Next.js API Routes
- **Validation:** Zod schemas
- **Security:** Input sanitization + rate limiting

---

## 3. Target User Profile

- **Expected daily visitors:** 10 max
- **Monthly tokens needed:** ~150,000 (out of 2M free)
- **Estimated bookings:** 2-3 per month
- **Cost:** $0/month forever ✅

---

## 4. Project Structure (New/Modified)

```text
src/
  app/
    api/
      chat/
        route.ts                ← Chat endpoint
      embed/
        route.ts                ← Embedding pipeline trigger
      booking/
        availability/
          route.ts              ← Get available slots
        create/
          route.ts              ← Create booking

  lib/
    db/
      mongoose.ts               ← MongoDB connection
      models/
        Conversation.ts         ← Chat history
        Lead.ts                 ← Visitor leads
        Embedding.ts            ← Vector store
        Booking.ts              ← Interview bookings

    ai/
      intent-detector.ts        ← Classify user intent
      prompt-builder.ts         ← Build system prompt
      rag.ts                    ← Retrieve relevant context
      embedder.ts               ← Embedding logic
      booking-orchestrator.ts   ← Booking workflow

    calendar/
      provider.ts               ← Google Calendar integration

    email/
      booking-confirmation.ts   ← Email templates

    sanity/
      context-fetcher.ts        ← Pull portfolio data

  components/
    chat/
      ChatWidget.tsx            ← Floating launcher
      ChatWindow.tsx            ← Chat UI
      ChatMessage.tsx           ← Message bubble
      ChatInput.tsx             ← Input field
      TypingIndicator.tsx       ← Typing animation
      SuggestedQuestions.tsx    ← Starter prompts

scripts/
  embed-portfolio.ts            ← One-time embedding

.env.local                       ← Environment variables
```

---

## 5. Environment Variables Required

```bash
# MongoDB
MONGODB_URI=

# Sanity (Already have)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=

# OpenAI Embeddings
OPENAI_API_KEY=

# Google Calendar
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_CALENDAR_ID=
BOOKING_SLOT_DURATION_MINUTES=30

# Resend Email
RESEND_API_KEY=
BOOKING_FROM_EMAIL=

# Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. Dependencies to Install

```bash
# Core
npm install mongoose ai @ai-sdk/google openai

# Utilities
npm install zod date-fns nanoid googleapis resend

# Rate limiting
npm install @upstash/ratelimit @upstash/redis
```

**Total:** 11 packages

---

## 7. Phase 1 Breakdown (4 tasks)

### Task 1: Install Dependencies

- Run npm install with all required packages
- Verify no conflicts or warnings

### Task 2: Create `.env.local`

- Create environment file with all variable templates
- No secrets yet (just placeholders)

### Task 3: Build MongoDB Connection

- `lib/db/mongoose.ts` - singleton connection utility
- Connection pooling for reuse
- Error handling

### Task 4: Create Database Schemas

- `Conversation.ts` - chat history
- `Lead.ts` - visitor tracking
- `Embedding.ts` - vector storage
- `Booking.ts` - calendar bookings

**Expected time:** 2-4 hours

---

## 8. Success Criteria for Phase 1

✅ All dependencies installed without errors  
✅ `.env.local` created with template variables  
✅ MongoDB connection tested and working  
✅ All 4 schemas compile and validate  
✅ Can run `npm run dev` without errors

---

## 9. What Happens Next (Phase 2-7)

| Phase | Focus                                  | Days |
| ----- | -------------------------------------- | ---- |
| 1     | Foundation (Database)                  | 1-2  |
| 2     | Knowledge Base (Embeddings)            | 2-3  |
| 3     | Chat Core (API + Intent)               | 3-4  |
| 4     | Safety Layer (Rate limit + Validation) | 2    |
| 5     | Booking Automation (Calendar + Email)  | 2-3  |
| 6     | UI Components (Chat Widget)            | 3-4  |
| 7     | Testing & Deploy                       | 2-3  |

**Total timeline:** ~2-3 weeks for full feature

---

## 10. Quick Links

- **PRD Document:** [README.md](README.md)
- **Package.json:** [package.json](package.json)
- **Sanity Config:** [sanity.config.ts](sanity.config.ts)
- **Next.js Config:** [next.config.ts](next.config.ts)

---

## 11. Notes & Decisions

- ✅ Using Gemini (free) instead of Claude
- ✅ 100% free tier for all services
- ✅ MongoDB for conversations + embeddings
- ✅ Google Calendar for native integration
- ✅ Resend for transactional emails
- ✅ Upstash Redis for rate limiting
- ✅ Server-side streaming for real-time responses
- ✅ No voice, no 3rd party integrations in Phase 1

---

## 12. Getting Started

When ready, say **"start building"** and I will:

1. Generate `.env.local` template
2. Create MongoDB connection utility
3. Create all 4 database schemas
4. Provide next steps

**You're 1 step away from coding! Ready?** 🚀
