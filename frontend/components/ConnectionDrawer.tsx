
'use client';
import { useState } from "react";
import { X, Copy } from "lucide-react";

export default function ConnectionDrawer({
  person,
  onClose,
}: {
  person: any;
  onClose: () => void;
}) {
  if (!person) return null;

  const introText = `Hi ${person.connectionOf}, is it much to ask for a warm intro with ${person.fullName}? Thank you so much in advanced!`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(introText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Connection details</h3>
          <button className="p-2 rounded hover:bg-gray-100" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          {/* Header */}
          <div>
            <h4 className="font-semibold">{person.fullName}</h4>
            <p className="text-sm text-gray-600">
              {person.jobTitle} · {person.location}
            </p>
          </div>

          {/* Strongest path */}
          <div className="glass rounded-2xl p-4">
            <h5 className="font-semibold mb-2">Strongest path</h5>
            <ol className="list-decimal pl-4 space-y-1 text-sm">
              <li>
                {person.connectionOf} → {person.fullName}
              </li>
              <li>
                Evidence:{" "}
                {person.evidence ||
                  "Team page (2025-06-10), Press (2025-05-02)"}
              </li>
            </ol>
          </div>

          {/* Intro Request (NEW) */}
          <div className="glass rounded-2xl p-4 relative">
            <h5 className="font-semibold mb-2">Intro Request</h5>

            {/* Copy icon */}
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 rounded-lg hover:bg-black/5 active:scale-95"
              aria-label="Copy intro request"
              title={copied ? "Copied!" : "Copy"}
            >
              <Copy className="w-4 h-4" />
            </button>

            <p className="text-sm leading-relaxed pr-10">{introText}</p>

            {copied && (
              <span className="absolute top-3 right-12 text-xs text-gray-600">
                Copied!
              </span>
            )}
          </div>

          {/* Links */}
          <div className="glass rounded-2xl p-4">
            <h5 className="font-semibold mb-2">Links</h5>
            <ul className="list-disc pl-4 text-sm">
              <li>
                <a
                  className="text-accent underline"
                  href={`https://${person.companyDomain}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Company
                </a>
              </li>
              <li>
                <a
                  className="text-accent underline"
                  href={person.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

