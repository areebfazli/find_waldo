'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Send } from "lucide-react"; // paper-plane icon
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function Home(){
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = q.trim();
    if(!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 pt-10 md:pt-12 bg-note/40">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          {/* Logo above headline, centered */}
          <Image
            src="/waldo_transparent.png"  // ensure this exists in /public
            alt="Waldo logo"
            width={120}
            height={120}
            className="mx-auto mb-3"
            priority
          />

          <h1 className="text-4xl font-bold">It's Waldo</h1>
          <p className="text-gray-600 mt-2">
            Find warm intro&apos;s within your VC&apos;s ecosystem.
          </p>
        </div>

        <Card className="p-3 md:p-4 glass rounded-3xl"> {/* thinner padding + softer corners */}
          <form onSubmit={submit} className="flex gap-2 items-stretch">
            {/* Animated outline wrapper */}
            <div className="relative flex-1">
              <div className="animated-border rounded-2xl"> {/* gradient border */}
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="I'm looking for a head of sales… "
                  className="w-full bg-white/70 rounded-2xl px-4 py-4 text-lg
                            border border-transparent focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <Button
              aria-label="Search"
              className="bg-primary text-gray-900 px-6 py-4 rounded-2xl"
              type="submit"
            >
              <Send className="w-6 h-6" />
            </Button>
          </form>
        </Card>

      </div>
    </main>
  );
}
