"use client";

import { useMemo, useState } from "react";
import type { ChatLead } from "@/lib/types/platform";

const statuses: ChatLead["status"][] = ["new", "contacted", "converted", "lost"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function ChatLeadsTable({ leads }: { leads: ChatLead[] }) {
  const [rows, setRows] = useState(leads);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  const [savingId, setSavingId] = useState("");

  const services = useMemo(
    () => Array.from(new Set(rows.map((lead) => lead.service_interest).filter(Boolean))).sort() as string[],
    [rows],
  );

  const filteredRows = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();
    return rows.filter((lead) => {
      const matchesStatus = status === "all" || lead.status === status;
      const matchesService = service === "all" || lead.service_interest === service;
      const searchText = [lead.name, lead.phone, lead.email, lead.business_name, lead.service_interest, lead.city, lead.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && matchesService && (!cleanQuery || searchText.includes(cleanQuery));
    });
  }, [query, rows, service, status]);

  async function updateStatus(id: string, nextStatus: ChatLead["status"]) {
    setSavingId(id);
    const response = await fetch("/api/admin/records", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table: "chat_leads",
        id,
        data: {
          status: nextStatus,
          updated_at: new Date().toISOString(),
        },
      }),
    });

    if (response.ok) {
      setRows((current) => current.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead)));
    }

    setSavingId("");
  }

  function exportCsv() {
    const header = [
      "Name",
      "Phone",
      "Email",
      "Business",
      "Service",
      "Message",
      "Status",
      "Created",
      "Source",
    ];
    const body = filteredRows.map((lead) =>
      [
        lead.name,
        lead.phone,
        lead.email,
        lead.business_name,
        lead.service_interest,
        lead.message,
        lead.status,
        lead.created_at,
        lead.source,
      ]
        .map(csvCell)
        .join(","),
    );
    const blob = new Blob([[header.map(csvCell).join(","), ...body].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chatbot-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="section-card chat-leads-card">
      <div className="chat-leads-toolbar">
        <div>
          <h2>Chatbot leads</h2>
          <p>Search, filter, update status, and export captured enquiries.</p>
        </div>
        <button type="button" onClick={exportCsv} disabled={!filteredRows.length}>
          Export CSV
        </button>
      </div>

      <div className="chat-leads-filters">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads..." />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All status</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select value={service} onChange={(event) => setService(event.target.value)}>
          <option value="all">All services</option>
          {services.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {filteredRows.length ? (
        <div className="chat-leads-table-wrap">
          <table className="chat-leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <strong>{lead.name}</strong>
                    <span>{lead.business_name || "Business not added"}</span>
                  </td>
                  <td>
                    <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                    <span>{lead.email || "No email"}</span>
                  </td>
                  <td>
                    <strong>{lead.service_interest || "General"}</strong>
                    <span>{lead.city || "Location not added"}</span>
                  </td>
                  <td className="chat-lead-message">{lead.message || "No message"}</td>
                  <td>
                    <select
                      value={lead.status}
                      disabled={savingId === lead.id}
                      onChange={(event) => void updateStatus(lead.id, event.target.value as ChatLead["status"])}
                    >
                      {statuses.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{formatDate(lead.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <strong>No chatbot leads found</strong>
          <p>New chatbot enquiries will appear here after the Supabase migration is applied.</p>
        </div>
      )}
    </section>
  );
}
