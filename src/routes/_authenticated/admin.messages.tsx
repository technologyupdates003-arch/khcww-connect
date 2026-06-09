import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Mail, Trash2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesPage,
});

interface Msg {
  id: string; name: string; email: string; subject: string;
  message: string; read: boolean; created_at: string;
}

function MessagesPage() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Msg | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Msg[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const toggleRead = async (m: Msg) => {
    await supabase.from("contact_messages").update({ read: !m.read }).eq("id", m.id);
    load();
    if (selected?.id === m.id) setSelected({ ...m, read: !m.read });
  };

  const remove = async (m: Msg) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", m.id);
    if (selected?.id === m.id) setSelected(null);
    load();
  };

  return (
    <AdminLayout title="Messages">
      {loading ? (
        <div className="p-10 text-center"><Loader2 className="h-5 w-5 mx-auto animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted-foreground rounded-xl border border-border bg-card">
          <Mail className="h-8 w-8 mx-auto mb-3 opacity-50" />
          No messages yet.
        </div>
      ) : (
        <div className="grid lg:grid-cols-[400px_1fr] gap-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border max-h-[70vh] overflow-y-auto">
            {rows.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelected(m); if (!m.read) toggleRead(m); }}
                className={`w-full text-left p-4 hover:bg-surface-2 transition-colors ${selected?.id === m.id ? "bg-surface-2" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className={`font-medium truncate ${!m.read ? "text-foreground" : "text-muted-foreground"}`}>{m.name}</div>
                  {!m.read && <span className="h-2 w-2 rounded-full bg-accent shrink-0" />}
                </div>
                <div className="text-xs text-muted-foreground truncate">{m.subject}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}</div>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            {selected ? (
              <div className="grid gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl">{selected.subject}</h2>
                    <div className="text-sm text-muted-foreground mt-1">
                      From <span className="font-medium text-foreground">{selected.name}</span> · <a href={`mailto:${selected.email}`} className="text-accent underline">{selected.email}</a>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(selected.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleRead(selected)}>
                      <Check className="h-4 w-4 mr-1" /> {selected.read ? "Mark unread" : "Mark read"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => remove(selected)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed border-t border-border pt-4">
                  {selected.message}
                </div>
                <div>
                  <Button asChild className="brand-gradient text-white border-0">
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}>Reply via email</a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-20 text-sm">Select a message to read it</div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
