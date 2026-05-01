import type { ChatLead } from "@/lib/types/platform";

const labels: Array<{ key: ChatLead["status"] | "total"; label: string }> = [
  { key: "total", label: "Total leads" },
  { key: "new", label: "New leads" },
  { key: "contacted", label: "Contacted" },
  { key: "converted", label: "Converted" },
  { key: "lost", label: "Lost" },
];

export function LeadStatsCards({ leads }: { leads: ChatLead[] }) {
  const stats = labels.map((item) => ({
    ...item,
    value: item.key === "total" ? leads.length : leads.filter((lead) => lead.status === item.key).length,
  }));

  return (
    <section className="chat-lead-stats" aria-label="Chat lead statistics">
      {stats.map((stat) => (
        <article key={stat.key} className="stat-card compact">
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
          <p>Chatbot source</p>
        </article>
      ))}
    </section>
  );
}
