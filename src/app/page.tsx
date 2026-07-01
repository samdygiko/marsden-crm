"use client";

import { useState } from "react";

/* ─── Fake data ──────────────────────────────────────────────────────────── */

type LeadStatus = "New enquiry" | "Site visit booked" | "Quoted" | "Won" | "Lost";

interface Lead {
  id: string;
  name: string;
  phone: string;
  postcode: string;
  jobType: string;
  enquiredOn: string; // ISO date
  status: LeadStatus;
  value?: number;
  source: string;
  notes: string;
}

const LEADS: Lead[] = [
  { id: "L-2410", name: "Mrs Helen Foster", phone: "07700 900421", postcode: "M20 4DG", jobType: "Kitchen extension (single-storey rear)", enquiredOn: "2026-04-28", status: "Won", value: 42000, source: "Google", notes: "Plans approved by neighbours. Wants to start Mon 12 May." },
  { id: "L-2412", name: "Mr David Rai", phone: "07700 900118", postcode: "SK7 1AB", jobType: "Loft conversion + dormer", enquiredOn: "2026-05-02", status: "Site visit booked", value: undefined, source: "Word of mouth", notes: "Site visit Tue 12 May 14:00. Wife works from home — back to discuss after." },
  { id: "L-2413", name: "Maria Costa", phone: "07700 900592", postcode: "M16 9PB", jobType: "Bathroom renovation (master)", enquiredOn: "2026-05-04", status: "Quoted", value: 12800, source: "Google", notes: "Quote sent 06/05. Following up Friday." },
  { id: "L-2415", name: "Mr Tony Wilson", phone: "07700 900330", postcode: "BL4 7TG", jobType: "Garage conversion to home office", enquiredOn: "2026-04-22", status: "Won", value: 18500, source: "Returning customer", notes: "Tony's a regular — repeat customer from 2023 patio job. Start scheduled 19 May." },
  { id: "L-2417", name: "Rev. James Perkins", phone: "07700 900880", postcode: "WA15 7DH", jobType: "Roof repair + new guttering", enquiredOn: "2026-05-05", status: "Quoted", value: 8500, source: "Local directory", notes: "Quoted 05/05. Said he'd \"sleep on it\". Ring back Wed if no response." },
  { id: "L-2418", name: "Sarah Brennan", phone: "07700 900274", postcode: "OL11 1RX", jobType: "Driveway resurfacing (block paving)", enquiredOn: "2026-05-06", status: "Site visit booked", source: "Google", notes: "Site visit Thu 14 May 10:00. Pulling onto a B-road, needs a temp dropped kerb." },
  { id: "L-2419", name: "Mr Faisal Aziz", phone: "07700 900611", postcode: "M22 4HR", jobType: "Side-return extension", enquiredOn: "2026-05-07", status: "New enquiry", source: "Instagram", notes: "Just called in — wants a callback this week to chat through options." },
  { id: "L-2420", name: "Mrs Caroline Hughes", phone: "07700 900945", postcode: "WN1 2HP", jobType: "Kitchen refit (existing footprint)", enquiredOn: "2026-05-07", status: "New enquiry", source: "Google", notes: "Got our number from Mr Wilson. Wants to know if we do kitchens too." },
  { id: "L-2407", name: "Mr Dean Walker", phone: "07700 900155", postcode: "SK4 3GE", jobType: "Patio + decking", enquiredOn: "2026-04-15", status: "Lost", value: 9200, source: "Google", notes: "Went with cheaper local quote (£6.4k). Shame — would've been a quick one." },
  { id: "L-2408", name: "Mr & Mrs Patterson", phone: "07700 900713", postcode: "M14 5SX", jobType: "Bathroom + ensuite (both)", enquiredOn: "2026-04-18", status: "Quoted", value: 24600, source: "Returning customer", notes: "Quote sent 24/04. Mr Patterson said yes pending wife's approval. Chase Monday." },
];

interface Job {
  id: string;
  customer: string;
  type: string;
  postcode: string;
  start: string; // ISO date
  end: string;
  team: string;
  value: number;
  status: "Scheduled" | "In progress" | "Completed";
  notes?: string;
}

const JOBS: Job[] = [
  { id: "J-220", customer: "Mr Tony Wilson", type: "Garage conversion to home office", postcode: "BL4 7TG", start: "2026-05-19", end: "2026-06-13", team: "Crew A — Marko, Jay, Dean", value: 18500, status: "Scheduled" },
  { id: "J-219", customer: "Mrs Helen Foster", type: "Kitchen extension (single-storey rear)", postcode: "M20 4DG", start: "2026-05-12", end: "2026-07-04", team: "Crew B — Sean, Kris, Liam, Owen", value: 42000, status: "Scheduled", notes: "Building Control inspection booked 14 May." },
  { id: "J-218", customer: "Mr Andrew Sutton", type: "Bathroom renovation", postcode: "M19 2QT", start: "2026-05-05", end: "2026-05-15", team: "Crew C — Daz, Pawel", value: 11800, status: "In progress", notes: "Tiling started Monday. Plumber Phil booked Wed." },
  { id: "J-217", customer: "Bramley Holdings Ltd", type: "Office fit-out — partition walls + flooring", postcode: "M3 4FN", start: "2026-04-28", end: "2026-05-09", team: "Crew A — Marko, Jay, Dean", value: 28400, status: "In progress", notes: "On track for Friday handover." },
  { id: "J-216", customer: "Mr Sanjay Singh", type: "Front porch + new entrance door", postcode: "OL2 6BD", start: "2026-04-22", end: "2026-04-30", team: "Crew B — Sean, Kris, Liam", value: 7800, status: "Completed", notes: "Snag list cleared 02/05. Final invoice raised." },
  { id: "J-215", customer: "Mrs Joan Aldridge", type: "Roof repair + chimney pointing", postcode: "WN5 9AE", start: "2026-04-15", end: "2026-04-18", team: "Crew C — Daz, Pawel", value: 4200, status: "Completed" },
  { id: "J-214", customer: "Cherrywood Care Home", type: "External decoration (full property)", postcode: "M33 5BH", start: "2026-03-31", end: "2026-04-25", team: "Subbie — Ace Decorators", value: 16500, status: "Completed", notes: "Long delays due to weather. All sorted now." },
];

interface Customer {
  id: string;
  name: string;
  phone: string;
  postcode: string;
  jobsCompleted: number;
  totalSpent: number;
  firstJob: string;
  lastJob: string;
  notes?: string;
}

const CUSTOMERS: Customer[] = [
  { id: "C-103", name: "Mr Tony Wilson", phone: "07700 900330", postcode: "BL4 7TG", jobsCompleted: 2, totalSpent: 14200, firstJob: "2023-08-14", lastJob: "2024-11-02", notes: "Always pays within 7 days. Recommended us to two friends." },
  { id: "C-088", name: "Cherrywood Care Home", phone: "0161 902 1144", postcode: "M33 5BH", jobsCompleted: 4, totalSpent: 62300, firstJob: "2022-05-09", lastJob: "2026-04-25", notes: "Annual maintenance contract. Speak to Linda in admin." },
  { id: "C-101", name: "Mr Sanjay Singh", phone: "07700 900762", postcode: "OL2 6BD", jobsCompleted: 1, totalSpent: 7800, firstJob: "2026-04-22", lastJob: "2026-04-30" },
  { id: "C-099", name: "Bramley Holdings Ltd", phone: "0161 833 4022", postcode: "M3 4FN", jobsCompleted: 2, totalSpent: 51900, firstJob: "2024-09-17", lastJob: "2026-05-09", notes: "Office fit-outs across their portfolio. Speak to Henry Bramley directly." },
  { id: "C-076", name: "Mrs Joan Aldridge", phone: "07700 900841", postcode: "WN5 9AE", jobsCompleted: 3, totalSpent: 12700, firstJob: "2021-06-23", lastJob: "2026-04-18", notes: "Loyal customer. Ring her every 6 months — usually has something." },
  { id: "C-095", name: "Mr Andrew Sutton", phone: "07700 900502", postcode: "M19 2QT", jobsCompleted: 1, totalSpent: 11800, firstJob: "2026-05-05", lastJob: "2026-05-05" },
  { id: "C-064", name: "Mr & Mrs Hartley", phone: "07700 900119", postcode: "SK6 4QT", jobsCompleted: 5, totalSpent: 84200, firstJob: "2019-04-12", lastJob: "2025-09-30", notes: "Best customers we've ever had. Whole-house renovation over 6 years. Christmas card list." },
];

interface Quote {
  id: string;
  customer: string;
  job: string;
  amount: number;
  sentOn: string;
  status: "Pending" | "Accepted" | "Declined" | "Expired";
}

const QUOTES: Quote[] = [
  { id: "Q-1147", customer: "Maria Costa", job: "Bathroom renovation (master)", amount: 12800, sentOn: "2026-05-06", status: "Pending" },
  { id: "Q-1146", customer: "Rev. James Perkins", job: "Roof repair + new guttering", amount: 8500, sentOn: "2026-05-05", status: "Pending" },
  { id: "Q-1145", customer: "Mr & Mrs Patterson", job: "Bathroom + ensuite (both)", amount: 24600, sentOn: "2026-04-24", status: "Pending" },
  { id: "Q-1144", customer: "Mrs Helen Foster", job: "Kitchen extension (single-storey rear)", amount: 42000, sentOn: "2026-04-29", status: "Accepted" },
  { id: "Q-1143", customer: "Mr Tony Wilson", job: "Garage conversion to home office", amount: 18500, sentOn: "2026-04-26", status: "Accepted" },
  { id: "Q-1142", customer: "Mr Dean Walker", job: "Patio + decking", amount: 9200, sentOn: "2026-04-19", status: "Declined" },
  { id: "Q-1141", customer: "Mr Andrew Sutton", job: "Bathroom renovation", amount: 11800, sentOn: "2026-04-12", status: "Accepted" },
  { id: "Q-1140", customer: "Bramley Holdings Ltd", job: "Office fit-out — partition walls + flooring", amount: 28400, sentOn: "2026-04-09", status: "Accepted" },
  { id: "Q-1138", customer: "Mr Glenn Marshall", job: "Loft insulation + access ladder", amount: 2400, sentOn: "2026-03-28", status: "Expired" },
];

interface Invoice {
  id: string;
  customer: string;
  job: string;
  amount: number;
  raisedOn: string;
  dueOn: string;
  status: "Paid" | "Unpaid" | "Overdue";
}

const INVOICES: Invoice[] = [
  { id: "INV-2026-074", customer: "Bramley Holdings Ltd", job: "Office fit-out — partition walls + flooring", amount: 28400, raisedOn: "2026-05-09", dueOn: "2026-05-23", status: "Unpaid" },
  { id: "INV-2026-073", customer: "Mr Andrew Sutton", job: "Bathroom renovation — stage 1", amount: 5900, raisedOn: "2026-05-06", dueOn: "2026-05-20", status: "Unpaid" },
  { id: "INV-2026-072", customer: "Mr Sanjay Singh", job: "Front porch + new entrance door", amount: 7800, raisedOn: "2026-05-02", dueOn: "2026-05-16", status: "Paid" },
  { id: "INV-2026-071", customer: "Mrs Joan Aldridge", job: "Roof repair + chimney pointing", amount: 4200, raisedOn: "2026-04-19", dueOn: "2026-05-03", status: "Paid" },
  { id: "INV-2026-070", customer: "Cherrywood Care Home", job: "External decoration (full property)", amount: 16500, raisedOn: "2026-04-26", dueOn: "2026-05-10", status: "Unpaid" },
  { id: "INV-2026-069", customer: "Mrs Linda Whitlow", job: "Garden patio relay", amount: 3450, raisedOn: "2026-04-08", dueOn: "2026-04-22", status: "Overdue", },
  { id: "INV-2026-068", customer: "Mr Glenn Marshall", job: "Garage door replacement", amount: 1850, raisedOn: "2026-03-30", dueOn: "2026-04-13", status: "Paid" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const fmtMoney = (n?: number) => (n === undefined ? "—" : "£" + n.toLocaleString("en-GB"));
const fmtDate = (d: string) => {
  const x = new Date(d);
  return x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const fmtDateShort = (d: string) => {
  const x = new Date(d);
  return x.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  "New enquiry":       { bg: "rgba(94,160,255,0.12)",  color: "#8DB8FF" },
  "Site visit booked": { bg: "rgba(245,197,66,0.15)",  color: "#F5C542" },
  "Quoted":            { bg: "rgba(255,122,26,0.15)",  color: "#FF9A4D" },
  "Won":               { bg: "rgba(74,222,128,0.15)",  color: "#7FECA1" },
  "Lost":              { bg: "rgba(255,255,255,0.04)", color: "rgba(230,234,238,0.35)" },
  "Scheduled":         { bg: "rgba(94,160,255,0.12)",  color: "#8DB8FF" },
  "In progress":       { bg: "rgba(255,122,26,0.15)",  color: "#FF9A4D" },
  "Completed":         { bg: "rgba(74,222,128,0.15)",  color: "#7FECA1" },
  "Pending":           { bg: "rgba(245,197,66,0.15)",  color: "#F5C542" },
  "Accepted":          { bg: "rgba(74,222,128,0.15)",  color: "#7FECA1" },
  "Declined":          { bg: "rgba(255,255,255,0.04)", color: "rgba(230,234,238,0.35)" },
  "Expired":           { bg: "rgba(255,255,255,0.04)", color: "rgba(230,234,238,0.35)" },
  "Paid":              { bg: "rgba(74,222,128,0.15)",  color: "#7FECA1" },
  "Unpaid":            { bg: "rgba(245,197,66,0.15)",  color: "#F5C542" },
  "Overdue":           { bg: "rgba(239,68,68,0.18)",   color: "#FF8888" },
};

function StatusPill({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: "rgba(255,255,255,0.06)", color: "rgba(230,234,238,0.5)" };
  return (
    <span style={{ background: c.bg, color: c.color, padding: "2px 8px", borderRadius: 3, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

type Tab = "Pipeline" | "Jobs" | "Customers" | "Quotes" | "Invoices";
const TABS: Tab[] = ["Pipeline", "Jobs", "Customers", "Quotes", "Invoices"];

export default function MarsdenCRM() {
  const [tab, setTab] = useState<Tab>("Pipeline");

  const totalOutstanding = INVOICES.filter(i => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const activeJobsCount = JOBS.filter(j => j.status !== "Completed").length;
  const openLeadsCount = LEADS.filter(l => l.status !== "Won" && l.status !== "Lost").length;
  const customersCount = CUSTOMERS.length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--panel)" }}>
        <div className="flex items-center gap-4 sm:gap-8 px-4 sm:px-6 lg:px-24 py-4">
          <div className="flex items-center gap-3">
            <div style={{ width: 30, height: 30, background: "var(--accent)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#0E1217", fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>
              M
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold tracking-tight" style={{ fontSize: 16 }}>MARSDEN</span>
              <span style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-faint)" }}>Construction · Manchester</span>
            </div>
          </div>

          <div className="flex-1" />
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Mark Marsden</span>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,122,26,0.15)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, border: "1px solid rgba(255,122,26,0.3)" }}>
              MM
            </div>
          </div>
        </div>

        {/* Tab nav — separate row, more space */}
        <div className="px-4 sm:px-6 lg:px-24 overflow-x-auto">
          <nav className="flex items-center gap-2 min-w-max">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="font-medium transition-colors"
                style={{
                  fontSize: 14,
                  padding: "14px 22px",
                  background: "transparent",
                  color: tab === t ? "var(--text)" : "var(--text-muted)",
                  borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
                  marginBottom: -1,
                  letterSpacing: "0.01em",
                }}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Stats — inside main content width, with breathing room */}
      <div className="w-full px-4 sm:px-6 lg:px-24 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {[
            { label: "Open leads", value: openLeadsCount },
            { label: "Active jobs", value: activeJobsCount },
            { label: "Customers", value: customersCount },
            { label: "Outstanding £", value: fmtMoney(totalOutstanding) },
          ].map((s) => (
            <div key={s.label} className="px-6 py-6 rounded-md flex flex-col gap-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-faint)" }}>{s.label}</span>
              <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab content — constrained width, generous padding */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-24 py-8 sm:py-12">
        {tab === "Pipeline" && <PipelineTab />}
        {tab === "Jobs" && <JobsTab />}
        {tab === "Customers" && <CustomersTab />}
        {tab === "Quotes" && <QuotesTab />}
        {tab === "Invoices" && <InvoicesTab />}
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", color: "var(--text-faint)" }}>
        <div className="text-xs flex items-center justify-between flex-wrap gap-2 px-4 sm:px-6 lg:px-24 py-4">
          <span>Marsden Construction Ltd · Reg. England 09483771 · VAT GB 224 8852 14</span>
          <span>Built by Dygiko · v2.4.1</span>
        </div>
      </footer>
    </div>
  );
}

/* ─── Pipeline ───────────────────────────────────────────────────────────── */

function PipelineTab() {
  const [filter, setFilter] = useState<"All" | LeadStatus>("All");
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ name: "", phone: "", postcode: "", jobType: "", source: "Google" });

  const filtered = leads.filter(l => {
    if (filter !== "All" && l.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.jobType.toLowerCase().includes(q) || l.postcode.toLowerCase().includes(q);
    }
    return true;
  });

  function addLead() {
    if (!draft.name.trim()) return;
    const nextId = "L-" + (Math.max(...leads.map(l => parseInt(l.id.replace("L-", ""), 10))) + 1).toString();
    const today = new Date().toISOString().split("T")[0];
    setLeads([{ id: nextId, name: draft.name, phone: draft.phone, postcode: draft.postcode.toUpperCase(), jobType: draft.jobType, enquiredOn: today, status: "New enquiry", source: draft.source, notes: "" }, ...leads]);
    setDraft({ name: "", phone: "", postcode: "", jobType: "", source: "Google" });
    setShowAdd(false);
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold tracking-tight">Lead pipeline</h2>
        <span style={{ fontSize: 12, color: "var(--text-faint)" }}>· {filtered.length} of {LEADS.length}</span>
        <div className="flex-1" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, job type, postcode…"
          className="text-sm px-3 py-1.5 rounded-sm outline-none"
          style={{ background: "var(--panel-2)", border: "1px solid var(--border)", minWidth: 240 }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="text-sm px-3 py-1.5 rounded-sm outline-none"
          style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }}
        >
          <option>All</option>
          <option>New enquiry</option>
          <option>Site visit booked</option>
          <option>Quoted</option>
          <option>Won</option>
          <option>Lost</option>
        </select>
        <button onClick={() => setShowAdd(true)} className="text-xs font-semibold px-4 py-2 rounded-sm transition-opacity hover:opacity-90" style={{ background: "var(--accent)", color: "#0E1217" }}>
          + Add lead
        </button>
      </div>

      <div className="rounded-md overflow-x-auto" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
        <table className="w-full min-w-[760px]" style={{ fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)" }}>
              {["Customer", "Job type", "Postcode", "Enquired", "Status", "Quote £", "Source"].map((h) => (
                <th key={h} className="text-left py-4 px-6" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-faint)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-[rgba(255,255,255,0.025)] transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="py-6 px-6">
                  <div className="font-semibold">{l.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{l.phone} · {l.id}</div>
                </td>
                <td className="py-6 px-6" style={{ color: "var(--text-muted)" }}>{l.jobType}</td>
                <td className="py-6 px-6" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: "var(--text-muted)" }}>{l.postcode}</td>
                <td className="py-6 px-6 text-sm" style={{ color: "var(--text-faint)" }}>{fmtDate(l.enquiredOn)}</td>
                <td className="py-6 px-6"><StatusPill status={l.status} /></td>
                <td className="py-6 px-6 font-semibold" style={{ color: l.value ? "var(--text)" : "var(--text-faint)" }}>{fmtMoney(l.value)}</td>
                <td className="py-6 px-6 text-sm" style={{ color: "var(--text-muted)" }}>{l.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes panel for one selected lead — picking the latest "Site visit booked" */}
      {(() => {
        const featured = leads.find(l => l.status === "Site visit booked");
        if (!featured) return null;
        return (
          <div className="rounded-md p-6" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>Next site visit</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{featured.name}</span>
              <StatusPill status={featured.status} />
            </div>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
              {featured.notes}
            </p>
          </div>
        );
      })()}

      {/* Add Lead modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-md flex flex-col" style={{ background: "var(--panel)", border: "1px solid var(--border-strong)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="font-semibold" style={{ fontSize: 16 }}>Add new lead</h3>
              <button onClick={() => setShowAdd(false)} style={{ color: "var(--text-faint)", fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            <div className="flex flex-col gap-4 px-6 py-5">
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Customer name</label>
                <input autoFocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Mr John Smith" className="w-full mt-1.5 px-3 py-2.5 text-sm rounded-sm outline-none" style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Phone</label>
                  <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="07700 900000" className="w-full mt-1.5 px-3 py-2.5 text-sm rounded-sm outline-none" style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Postcode</label>
                  <input value={draft.postcode} onChange={(e) => setDraft({ ...draft, postcode: e.target.value })} placeholder="M20 4DG" className="w-full mt-1.5 px-3 py-2.5 text-sm rounded-sm outline-none" style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Job type</label>
                <input value={draft.jobType} onChange={(e) => setDraft({ ...draft, jobType: e.target.value })} placeholder="e.g. Kitchen extension" className="w-full mt-1.5 px-3 py-2.5 text-sm rounded-sm outline-none" style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Source</label>
                <select value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} className="w-full mt-1.5 px-3 py-2.5 text-sm rounded-sm outline-none" style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }}>
                  <option>Google</option>
                  <option>Word of mouth</option>
                  <option>Returning customer</option>
                  <option>Local directory</option>
                  <option>Instagram</option>
                  <option>Facebook</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm rounded-sm" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                Cancel
              </button>
              <button onClick={addLead} disabled={!draft.name.trim()} className="flex-1 py-2.5 text-sm font-semibold rounded-sm transition-opacity hover:opacity-90 disabled:opacity-40" style={{ background: "var(--accent)", color: "#0E1217" }}>
                Add lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Jobs ───────────────────────────────────────────────────────────────── */

function JobsTab() {
  const active = JOBS.filter(j => j.status !== "Completed");
  const completed = JOBS.filter(j => j.status === "Completed");

  return (
    <div className="flex flex-col gap-14">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-bold tracking-tight">This week</h2>
          <span style={{ fontSize: 12, color: "var(--text-faint)" }}>· {active.length} live job{active.length !== 1 ? "s" : ""}</span>
          <div className="flex-1" />
          <button className="text-xs font-semibold px-3 py-1.5 rounded-sm" style={{ background: "var(--accent)", color: "#0E1217" }}>
            + Schedule job
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {active.map((j) => (
            <div key={j.id} className="rounded-md p-6 flex flex-col gap-4" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between gap-2">
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-faint)" }}>{j.id}</span>
                <StatusPill status={j.status} />
              </div>
              <div>
                <div className="font-semibold">{j.customer}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{j.type}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-1" style={{ fontSize: 12 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Dates</div>
                  <div style={{ color: "var(--text-muted)" }}>{fmtDateShort(j.start)} → {fmtDateShort(j.end)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Value</div>
                  <div className="font-semibold">{fmtMoney(j.value)}</div>
                </div>
                <div className="col-span-2">
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Crew</div>
                  <div style={{ color: "var(--text-muted)" }}>{j.team}</div>
                </div>
              </div>
              {j.notes && (
                <div className="rounded-sm px-3 py-2 mt-1" style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>📌 {j.notes}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight mb-5">Recently completed</h2>
        <div className="rounded-sm overflow-x-auto" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
          <table className="w-full min-w-[640px]" style={{ fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)" }}>
                {["Customer", "Job", "Postcode", "Finished", "Value"].map((h) => (
                  <th key={h} className="text-left py-3 px-6" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-faint)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completed.map((j) => (
                <tr key={j.id} className="hover:bg-[rgba(255,255,255,0.025)] transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-3 px-4 font-semibold">{j.customer}</td>
                  <td className="py-6 px-6" style={{ color: "var(--text-muted)" }}>{j.type}</td>
                  <td className="py-6 px-6" style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "var(--text-muted)" }}>{j.postcode}</td>
                  <td className="py-3 px-4 text-xs" style={{ color: "var(--text-faint)" }}>{fmtDate(j.end)}</td>
                  <td className="py-3 px-4 font-semibold">{fmtMoney(j.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Customers ──────────────────────────────────────────────────────────── */

function CustomersTab() {
  const [search, setSearch] = useState("");
  const filtered = CUSTOMERS.filter(c => !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || c.postcode.toLowerCase().includes(search.toLowerCase()));
  const totalLifetime = CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold tracking-tight">Customers</h2>
        <span style={{ fontSize: 12, color: "var(--text-faint)" }}>· {filtered.length} of {CUSTOMERS.length} · {fmtMoney(totalLifetime)} lifetime value</span>
        <div className="flex-1" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or postcode…"
          className="text-sm px-3 py-1.5 rounded-sm outline-none"
          style={{ background: "var(--panel-2)", border: "1px solid var(--border)", minWidth: 240 }}
        />
        <button className="text-xs font-semibold px-3 py-1.5 rounded-sm" style={{ background: "var(--accent)", color: "#0E1217" }}>
          + Add customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-md p-6 flex flex-col gap-4" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">{c.name}</div>
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{c.id}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {c.phone} · {c.postcode}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Jobs</div>
                <div className="font-semibold">{c.jobsCompleted}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)" }}>Total spent</div>
                <div className="font-semibold" style={{ color: "var(--accent)" }}>{fmtMoney(c.totalSpent)}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-faint)" }}>
              First job: {fmtDate(c.firstJob)} · Last: {fmtDate(c.lastJob)}
            </div>
            {c.notes && (
              <div className="rounded-sm px-3 py-2 mt-1" style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>📌 {c.notes}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Quotes ─────────────────────────────────────────────────────────────── */

function QuotesTab() {
  const [filter, setFilter] = useState<"All" | Quote["status"]>("All");
  const filtered = QUOTES.filter(q => filter === "All" || q.status === filter);
  const pendingTotal = QUOTES.filter(q => q.status === "Pending").reduce((s, q) => s + q.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold tracking-tight">Quotes</h2>
        <span style={{ fontSize: 12, color: "var(--text-faint)" }}>· {fmtMoney(pendingTotal)} pending</span>
        <div className="flex-1" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="text-sm px-3 py-1.5 rounded-sm outline-none"
          style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Declined</option>
          <option>Expired</option>
        </select>
        <button className="text-xs font-semibold px-3 py-1.5 rounded-sm" style={{ background: "var(--accent)", color: "#0E1217" }}>
          + New quote
        </button>
      </div>

      <div className="rounded-md overflow-x-auto" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
        <table className="w-full min-w-[680px]" style={{ fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)" }}>
              {["Quote #", "Customer", "Job", "Sent", "Status", "Amount"].map((h) => (
                <th key={h} className="text-left py-3 px-6" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-faint)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-[rgba(255,255,255,0.025)] transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="py-6 px-6" style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "var(--text-muted)" }}>{q.id}</td>
                <td className="py-3 px-4 font-semibold">{q.customer}</td>
                <td className="py-6 px-6" style={{ color: "var(--text-muted)" }}>{q.job}</td>
                <td className="py-3 px-4 text-xs" style={{ color: "var(--text-faint)" }}>{fmtDate(q.sentOn)}</td>
                <td className="py-6 px-6"><StatusPill status={q.status} /></td>
                <td className="py-3 px-4 font-semibold">{fmtMoney(q.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Invoices ───────────────────────────────────────────────────────────── */

function InvoicesTab() {
  const outstanding = INVOICES.filter(i => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const overdue = INVOICES.filter(i => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const paidThisMonth = INVOICES.filter(i => i.status === "Paid" && i.raisedOn >= "2026-05-01").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold tracking-tight">Invoices</h2>
        <div className="flex-1" />
        <button className="text-xs font-semibold px-3 py-1.5 rounded-sm" style={{ background: "var(--accent)", color: "#0E1217" }}>
          + Raise invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-md p-5" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-faint)" }}>Outstanding</div>
          <div className="font-bold mt-1" style={{ fontSize: 24, letterSpacing: "-0.02em" }}>{fmtMoney(outstanding)}</div>
        </div>
        <div className="rounded-md p-5" style={{ background: "var(--panel)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF8888" }}>Overdue</div>
          <div className="font-bold mt-1" style={{ fontSize: 24, letterSpacing: "-0.02em", color: "#FF8888" }}>{fmtMoney(overdue)}</div>
        </div>
        <div className="rounded-md p-5" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-faint)" }}>Paid this month</div>
          <div className="font-bold mt-1" style={{ fontSize: 24, letterSpacing: "-0.02em", color: "#7FECA1" }}>{fmtMoney(paidThisMonth)}</div>
        </div>
      </div>

      <div className="rounded-md overflow-x-auto" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
        <table className="w-full min-w-[760px]" style={{ fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--panel-2)", borderBottom: "1px solid var(--border)" }}>
              {["Invoice #", "Customer", "Job", "Raised", "Due", "Status", "Amount"].map((h) => (
                <th key={h} className="text-left py-3 px-6" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-faint)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((i) => (
              <tr key={i.id} className="hover:bg-[rgba(255,255,255,0.025)] transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="py-6 px-6" style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "var(--text-muted)" }}>{i.id}</td>
                <td className="py-3 px-4 font-semibold">{i.customer}</td>
                <td className="py-6 px-6" style={{ color: "var(--text-muted)" }}>{i.job}</td>
                <td className="py-3 px-4 text-xs" style={{ color: "var(--text-faint)" }}>{fmtDate(i.raisedOn)}</td>
                <td className="py-3 px-4 text-xs" style={{ color: i.status === "Overdue" ? "#FF8888" : "var(--text-faint)" }}>{fmtDate(i.dueOn)}</td>
                <td className="py-6 px-6"><StatusPill status={i.status} /></td>
                <td className="py-3 px-4 font-semibold">{fmtMoney(i.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
