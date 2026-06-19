import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

type Settings = {
  id?: string;
  contact_email: string | null;
  contact_phone: string | null;
  emergency_phone: string | null;
  address: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
};

const EMPTY: Settings = {
  contact_email: "",
  contact_phone: "",
  emergency_phone: "",
  address: "",
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  youtube_url: "",
};

function SettingsPage() {
  const [values, setValues] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("*")
        .maybeSingle();
      if (error) toast.error(error.message);
      if (data) setValues(data);
      setLoading(false);
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...values, singleton: true };
    const { error } = await (supabase as any)
      .from("site_settings")
      .upsert(payload, { onConflict: "singleton" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  };

  const field = (key: keyof Settings, label: string, type = "text") => (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        value={(values[key] as string) ?? ""}
        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      />
    </div>
  );

  return (
    <AdminLayout title="Contact settings">
      {loading ? (
        <div className="p-10 text-center"><Loader2 className="h-5 w-5 animate-spin inline" /></div>
      ) : (
        <form onSubmit={save} className="grid gap-6 max-w-3xl">
          <section className="rounded-xl border border-border bg-card p-6 grid gap-4">
            <h2 className="font-display text-lg">Contact information</h2>
            {field("contact_email", "Public email", "email")}
            {field("contact_phone", "Phone number")}
            {field("emergency_phone", "Emergency line")}
            <div className="grid gap-1.5">
              <Label>Address</Label>
              <Textarea
                rows={2}
                value={values.address ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 grid gap-4">
            <h2 className="font-display text-lg">Social media</h2>
            {field("facebook_url", "Facebook URL", "url")}
            {field("twitter_url", "Twitter / X URL", "url")}
            {field("instagram_url", "Instagram URL", "url")}
            {field("youtube_url", "YouTube URL", "url")}
          </section>

          <div>
            <Button type="submit" disabled={saving} className="brand-gradient text-white border-0">
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : "Save settings"}
            </Button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
