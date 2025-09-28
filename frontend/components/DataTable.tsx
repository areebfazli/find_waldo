'use client';
import { useEffect, useMemo, useState } from "react";
import ConnectionDrawer from "./ConnectionDrawer";
import { ArrowUpRight, ChevronDown, ChevronUp, FileDown, Sparkles } from "lucide-react";

// Updated Row type to match the backend's data structure
type Connection = {
  full_name: string;
  linkedin_url: string;
};

type Row = {
  _id: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  company?: string;
  linkedin_url?: string;
  connections_of?: Connection[]; // Updated to be an array of connections
  location?: string;
  industry?: string;
};

// This is the type expected by the ConnectionDrawer
type Person = {
  id: string;
  fullName: string;
  jobTitle: string;
  location: string;
  companyDomain: string;
  linkedin: string;
  industry: string;
  connectionOf: string; // This will be the name of the first connection
};


const headers: { key: keyof Row | "actions" | "fullName"; label: string }[] = [
  { key: "fullName", label: "Full Name" },
  { key: "position", label: "Job Title" },
  { key: "company", label: "Company" },
  { key: "linkedin_url", label: "LinkedIn Profile" },
  { key: "connections_of", label: "Connection Of" },
  { key: "actions", label: "" },
];

export default function DataTable({ query }: { query: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [sortKey, setSortKey] = useState<keyof Row | 'fullName'>("first_name");
  const [asc, setAsc] = useState(true);
  const [selected, setSelected] = useState<Person | null>(null);

  useEffect(() => {
    if (query) {
      fetch(`/api/results?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data: Row[]) => setRows(data))
        .catch(err => console.error("Failed to fetch results:", err));
    }
  }, [query]);

  const sorted: Row[] = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let va: string;
      let vb: string;

      if (sortKey === 'fullName') {
        va = `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim();
        vb = `${b.first_name ?? ''} ${b.last_name ?? ''}`.trim();
      } else if (sortKey === 'connections_of') {
        // Sort by the name of the first connection
        va = a.connections_of?.[0]?.full_name ?? '';
        vb = b.connections_of?.[0]?.full_name ?? '';
      } else {
        va = String(a[sortKey as keyof Row] ?? "");
        vb = String(b[sortKey as keyof Row] ?? "");
      }
      
      return asc ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return copy;
  }, [rows, sortKey, asc]);

  const exportCSV = () => {
    const header = [
      "Full Name",
      "Job Title",
      "Company",
      "LinkedIn Profile",
      "Connection Of",
    ].join(",");

    const esc = (val: unknown) => {
      const s = String(val ?? "");
      return /[\",\n]/.test(s) ? `"${s.replace(/\"/g, '""')}"` : s;
    };

    const records = sorted.map((r) =>
      [
        esc(`${r.first_name ?? ''} ${r.last_name ?? ''}`.trim()),
        esc(r.position),
        esc(r.company),
        esc(r.linkedin_url),
        // Join all connection names with a comma
        esc(r.connections_of?.map(c => c.full_name).join(", ") ?? ""),
      ].join(",")
    );

    const csv = [header, ...records].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "find-waldo-results.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Transform a Row into a Person for the drawer, using the first connection
  const transformRowToPerson = (row: Row): Person => ({
    id: row._id,
    fullName: `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim(),
    jobTitle: row.position ?? '',
    companyDomain: row.company ?? '',
    linkedin: row.linkedin_url ?? '',
    connectionOf: row.connections_of?.[0]?.full_name ?? 'N/A',
    location: row.location ?? 'N/A', 
    industry: row.industry ?? 'N/A',
  });


  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="mb-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={exportCSV}
          title="Export CSV"
          className="p-2 rounded-xl transition-colors hover:bg-primary/20"
          aria-label="Export CSV"
        >
          <FileDown className="w-5 h-5" />
        </button>
        <button
          type="button"
          title="AI Enrichment"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold bg-primary text-gray-900 shadow-soft hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <span>AI Enrichment</span>
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-note/80 backdrop-blur-md">
            <tr>
              {headers.map((h) => {
                const isSortable = h.key !== "actions";
                const isActive = isSortable && (sortKey === h.key || (h.key === 'fullName' && (sortKey === 'first_name' || sortKey === 'last_name')));
                return (
                  <th
                    key={String(h.key)}
                    className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap text-center"
                  >
                    {isSortable ? (
                      <button
                        className="inline-flex items-center gap-1 mx-auto select-none"
                        onClick={() => {
                          const newKey = h.key === 'fullName' ? 'first_name' : h.key as keyof Row;
                          if (sortKey === newKey) setAsc(!asc);
                          else {
                            setSortKey(newKey);
                            setAsc(true);
                          }
                        }}
                        aria-label={`Sort by ${h.label}`}
                      >
                        <span>{h.label}</span>
                        {isActive ? (
                          asc ? (
                            <ChevronDown className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <ChevronUp className="w-4 h-4" aria-hidden="true" />
                          )
                        ) : (
                          <ChevronDown className="w-4 h-4 opacity-60" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 mx-auto">
                        {h.label}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {sorted.map((row) => (
              <tr key={row._id} className="hover:bg-note/40">
                <td className="px-4 py-3 font-medium">{`${row.first_name ?? ''} ${row.last_name ?? ''}`.trim()}</td>
                <td className="px-4 py-3">{row.position}</td>
                <td className="px-4 py-3">
                  {row.company}
                </td>
                <td className="px-4 py-3">
                  {row.linkedin_url && (
                    <a className="text-accent underline" href={row.linkedin_url} target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                  )}
                </td>

                {/* Connection Of Links */}
                <td className="px-4 py-3">
                  <div className="flex flex-col items-center gap-1">
                    {row.connections_of?.map((conn, index) => (
                      <a
                        key={index}
                        // href={conn.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-gray-900 bg-primary/20 hover:bg-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        // onClick={(e) => e.stopPropagation()} // Prevent row selection when clicking the link
                        onClick={() => setSelected(transformRowToPerson(row))}
                      >
                        
                        <span>{conn.full_name}</span>
                        <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </td>

                <td className="px-4 py-3 text-right">
                  {/* Button to open the drawer, uses the first connection for simplicity */}
                  <button
                    onClick={() => setSelected(transformRowToPerson(row))}
                    className="p-2 rounded-lg hover:bg-black/5"
                    aria-label="Show connection details"
                  >
                    ➤
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <ConnectionDrawer person={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}