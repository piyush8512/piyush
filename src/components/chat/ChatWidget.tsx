"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { Bot, Calendar, MessageCircle, Send, Sparkles, X } from "lucide-react";

type ChatRole = "user" | "assistant";
type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type Slot = {
  slotStart: string;
  slotEnd: string;
  duration: number;
};

const SESSION_KEY = "portfolio-chat-session-id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return nanoid();

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const created = nanoid();
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

function formatSlotRange(startISO: string, endISO: string): string {
  const start = new Date(startISO);
  const end = new Date(endISO);

  return `${start.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })} • ${start.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nanoid(),
      role: "assistant",
      content:
        "Hi, I am your portfolio assistant. Ask about projects, skills, or book a meeting.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [showBooking, setShowBooking] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPurpose, setBookingPurpose] = useState("");
  const [bookingPending, setBookingPending] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, showBooking]);

  const quickPrompts = useMemo(
    () => [
      "Show your best projects",
      "What are your strongest skills?",
      "Book a 30 minute call",
    ],
    [],
  );

  async function sendMessage(text: string) {
    if (!text.trim() || sending || !sessionId) return;

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: text.trim(),
    };

    const assistantId = nanoid();

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          name: bookingName || undefined,
          email: bookingEmail || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Chat request failed");
      }

      if (!response.body) {
        throw new Error("No response stream from server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let content = "";

      while (!done) {
        const result = await reader.read();
        done = result.done;

        if (result.value) {
          content += decoder.decode(result.value, { stream: true });
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content } : msg,
            ),
          );
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Message failed";
      setError(message);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: "I could not answer right now. Please try again.",
              }
            : msg,
        ),
      );
    } finally {
      setSending(false);
    }
  }

  async function fetchAvailability() {
    setLoadingSlots(true);
    setError("");

    try {
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 14);

      const params = new URLSearchParams({
        dateStart: start.toISOString(),
        dateEnd: end.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      });

      const res = await fetch(`/api/availability?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to load availability");
      }

      setSlots(data.data.slots || []);
      if (!showBooking) setShowBooking(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load slots";
      setError(message);
    } finally {
      setLoadingSlots(false);
    }
  }

  async function confirmBooking(e: FormEvent) {
    e.preventDefault();
    if (!selectedSlot || !bookingName || !bookingEmail || !bookingPurpose)
      return;

    setBookingPending(true);
    setError("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorName: bookingName,
          visitorEmail: bookingEmail,
          purpose: bookingPurpose,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          slotStart: selectedSlot.slotStart,
          slotEnd: selectedSlot.slotEnd,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Booking failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          role: "assistant",
          content: `Great. Your meeting is confirmed for ${formatSlotRange(
            selectedSlot.slotStart,
            selectedSlot.slotEnd,
          )}. Confirmation email has been sent.`,
        },
      ]);

      setShowBooking(false);
      setSelectedSlot(null);
      setBookingPurpose("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setBookingPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-primary bg-secondary text-primary shadow-lg transition hover:scale-105"
        aria-label="Open chat assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[min(80vh,680px)] w-[min(92vw,420px)] flex-col overflow-hidden rounded-2xl border border-primary bg-secondary shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-primary px-4 py-3">
              <div className="flex items-center gap-2 text-primary">
                <Bot size={18} />
                <p className="text-sm font-semibold">Portfolio Assistant</p>
              </div>
              <button
                type="button"
                onClick={fetchAvailability}
                className="inline-flex items-center gap-1 rounded-full border border-primary px-3 py-1 text-xs text-primary"
              >
                <Calendar size={13} />
                Book
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
            >
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    className="rounded-full border border-primary px-3 py-1 text-xs text-primary"
                    onClick={() => sendMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "ml-auto bg-primary text-secondary"
                      : "bg-background text-primary"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {message.content ||
                      (message.role === "assistant" ? "..." : "")}
                  </p>
                </div>
              ))}

              {showBooking && (
                <div className="rounded-xl border border-primary p-3">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles size={14} />
                    Book a meeting
                  </p>

                  {loadingSlots && (
                    <p className="text-xs text-primary">
                      Loading availability...
                    </p>
                  )}

                  {!loadingSlots && slots.length > 0 && (
                    <div className="mb-3 grid max-h-36 gap-2 overflow-y-auto">
                      {slots.slice(0, 8).map((slot) => (
                        <button
                          key={`${slot.slotStart}-${slot.slotEnd}`}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg border px-2 py-2 text-left text-xs ${
                            selectedSlot?.slotStart === slot.slotStart
                              ? "border-primary bg-primary text-secondary"
                              : "border-primary text-primary"
                          }`}
                        >
                          {formatSlotRange(slot.slotStart, slot.slotEnd)}
                        </button>
                      ))}
                    </div>
                  )}

                  {!loadingSlots && slots.length === 0 && (
                    <p className="mb-2 text-xs text-primary">
                      No slots found in the next 14 days.
                    </p>
                  )}

                  <form className="space-y-2" onSubmit={confirmBooking}>
                    <input
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-md border border-primary bg-transparent px-2 py-1 text-sm text-primary outline-none"
                      required
                    />
                    <input
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      placeholder="Your email"
                      type="email"
                      className="w-full rounded-md border border-primary bg-transparent px-2 py-1 text-sm text-primary outline-none"
                      required
                    />
                    <textarea
                      value={bookingPurpose}
                      onChange={(e) => setBookingPurpose(e.target.value)}
                      placeholder="What should we discuss?"
                      className="h-20 w-full rounded-md border border-primary bg-transparent px-2 py-1 text-sm text-primary outline-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={!selectedSlot || bookingPending}
                      className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-secondary disabled:opacity-50"
                    >
                      {bookingPending ? "Confirming..." : "Confirm Booking"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {error && <p className="px-3 pb-1 text-xs text-red-500">{error}</p>}

            <form
              className="flex items-center gap-2 border-t border-primary p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, or booking..."
                className="flex-1 rounded-lg border border-primary bg-transparent px-3 py-2 text-sm text-primary outline-none"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="rounded-lg bg-primary p-2 text-secondary disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
