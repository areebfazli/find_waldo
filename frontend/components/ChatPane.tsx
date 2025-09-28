'use client';
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import axios from 'axios';

type Msg = { role: "user" | "assistant", content: string, id: string };

const API_URL = "http://127.0.0.1:8000/search";

export default function ChatPane({ initialUserQuery }: { initialUserQuery: string }) {
  // Start with an empty array of messages
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref to prevent the initial fetch from running more than once
  const initialFetchDone = useRef(false);

  const fetchResults = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(API_URL, { prompt, limit: 50 });
      const { summary } = response.data;
      const assistantMessage = summary || "Got it. I've updated the results on the right.";
      setMessages((m) => [...m, { role: "assistant", content: assistantMessage, id: crypto.randomUUID() }]);

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('q', prompt);
      currentUrl.searchParams.set('t', Date.now().toString());
      window.history.pushState({}, '', currentUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));

    } catch (error) {
      console.error("API call failed:", error);
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't process that request.", id: crypto.randomUUID() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // This useEffect handles the VERY FIRST load from the URL query
  useEffect(() => {
    if (initialUserQuery && !initialFetchDone.current) {
      // Mark that the initial fetch is done
      initialFetchDone.current = true;
      // Set the first user message and fetch the results
      setMessages([{ role: "user", content: initialUserQuery, id: "u1" }]);
      fetchResults(initialUserQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUserQuery]);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const autosize = () => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = '0px';
    const next = Math.min(ta.scrollHeight, 160);
    ta.style.height = next + 'px';
  };

  useEffect(autosize, [input]);

  // This function is now only for user-initiated sends
  const send = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const id = crypto.randomUUID();
    
    setMessages((m) => [...m, { role: "user", content: text, id }]);
    setInput("");
    fetchResults(text);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pr-2">
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={
                  (m.role === "user"
                    ? "bg-accent/10 border-accent/20"
                    : "bg-white/70 border-gray-200") +
                  " inline-block max-w-[92%] text-sm md:text-[0.95rem] px-4 py-3 rounded-2xl border shadow-soft"
                }
              >
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            </li>
          ))}
          {isLoading && (
            <li key="loading" className="text-left">
              <div className="bg-white/70 border-gray-200 inline-block max-w-[92%] text-sm md:text-[0.95rem] px-4 py-3 rounded-2xl border shadow-soft">
                <span className="whitespace-pre-wrap">Thinking...</span>
              </div>
            </li>
          )}
        </ul>
        <div ref={endRef} />
      </div>

      <div className="pt-2">
        <div className="relative">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Refine your search..."
            className="w-full bg-white/70 border border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent resize-none overflow-hidden"
            disabled={isLoading}
          />
          <button
            onClick={send}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md hover:opacity-90 active:scale-95 disabled:opacity-50"
            aria-label="Send"
            disabled={isLoading}
           >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
