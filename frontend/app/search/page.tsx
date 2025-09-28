'use client';

import { useSearchParams } from "next/navigation";
import ChatPane from "@/components/ChatPane";
import DataTable from "@/components/DataTable";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";



export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  return (
    <main className="h-screen overflow-hidden p-4 md:p-6 bg-note/20 relative">
      {/* Top-right logo */}

      {/* Grid */}
      <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
        {/* Left: Chat */}
        <section className="md:col-span-1 glass rounded-2xl p-4 flex flex-col overflow-hidden">
          <div className="pb-3 border-b border-white/60 shrink-0">
            <div className="flex items-center gap-3">
              {/* Back button */}
              <Link
                href="/"
                aria-label="Back to home"
                className="p-2 rounded-lg hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              {/* Logo + title */}
              <Image src="/waldo_transparent.png" alt="Logo" width={50} height={25} />
              <h2 className="font-semibold">Your chat</h2>
            </div>

            
          </div>


          <div className="flex-1 mt-3 min-h-0">
            <ChatPane initialUserQuery={q} />
          </div>
        </section>

        {/* Right: Results */}
        <section className="md:col-span-3 overflow-hidden">
          <div className="h-full min-h-0">
            <DataTable query={q} />
          </div>
        </section>
      </div>
    </main>
  );
}

