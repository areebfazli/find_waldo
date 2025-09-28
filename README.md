# Waldo — Project Write-Up

Waldo creates value for Venture Capital funds by helping their portfolio startups achieve commercial success through warm introductions.

---

## The problem we tackled

Warm intros outperform cold outreach, but who-knows-who data lives in silos (LinkedIn, inboxes, CRMs).

Funds lack a simple, privacy-respectful way for partners to contribute networks and search “who can intro me to X at Y?” in real time.

---

## The solution & how it works

- Describe your target on the home screen.  
- Waldo shows a candidate list (domain, title, LinkedIn, industry) with a “Connection Of” label indicating the most promising introducer.  
- Partners visit /admin to upload LinkedIn connections (CSV); the backend parses & validates, then merges them into the fund’s connection graph.  
- Users can sort, export CSV, and open a drawer to see the path/evidence.  
- In this repo, the UI is fully functional with mock data and a stub POST /admin/upload. Swap in your DB later without changing the UI.

---

## Core features & technical choices

- *Frontend:* Next.js App Router + TypeScript for modern routing & type safety.  
- *Styling:* TailwindCSS with glassmorphic cards, rounded corners, and high-contrast orange buttons (AA-friendly).  
- *Search Page:* independent scrolling per pane, sticky table header, sort chevrons, CSV export.  
- *Admin Panel:* drag-and-drop CSV upload with file validation (type/size), a “How to?” modal, and a collapsible (demo) sidebar.  
- *APIs:* REST endpoints (mocked in Next for demo) with response shapes mirrored to FastAPI for a smooth swap.  
- *State Management:* no global state libs — local component state + URL params.

---

## Why it matters & possible impact

- Higher response rates via warm intros; fewer wasted cold emails.  
- Operational leverage: partners reliably contribute networks; teams search and act in seconds.  
- Extendable to enrichment providers and LLM reranking; deployable across funds with clear privacy boundaries.

---

## External APIs, datasets, or tools

- *Icons:* [lucide-react](https://lucide.dev/)  
- *CSV Parsing (optional):* PapaParse / csv-parse (client/server validation)  
- *Enrichment (optional):* Clearbit, People Data Labs (PDL), Apollo  
- *Dataset:* Jorge, Nacho, and Areeb’s LinkedIn connections CSV  
- *LLM:* OpenAI  
- *Deployment:* Vercel (frontend), Render / Fly / Railway / Docker (backend)

## Loom Video Link
- *Link:* https://www.loom.com/share/5e1dffd6b3f5415bb81cb655e0514660?sid=7de4e41a-1eb5-474f-b39d-107b5c5283d1

## Team Details
- *Areeb Fazli:* https://www.linkedin.com/in/areebfazli/
- *Nacho Pujol:* https://www.linkedin.com/in/nacho-pujol/
- *Allen Abishek:* https://www.linkedin.com/in/allenabishek/

