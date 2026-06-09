import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — KHCWW" },
      { name: "description", content: "Reach out to Kirinyaga Health Care Workers Welfare." },
      { property: "og:title", content: "Contact KHCWW" },
      { property: "og:description", content: "Get in touch with the KHCWW office." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  subject: z.string().trim().min(2, "Enter a subject").max(160),
  message: z.string().trim().min(10, "Message is too short").max(2000),
});

function Contact() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const eobj: Record<string, string> = {};
      for (const i of parsed.error.issues) eobj[i.path[0] as string] = i.message;
      setErrors(eobj);
      return;
    }
    setErrors({});
    setState("submitting");
    // Phase 2: persist to Lovable Cloud. For now, simulate success.
    setTimeout(() => setState("sent"), 700);
  };

  return (
    <SiteLayout>
      <PageHero eyebrow="Contact" title="We'd love to hear from you" subtitle="Questions, suggestions, or partnership inquiries — reach out below." />
      <section className="container-x py-14 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Info Icon={MapPin} label="Office" value={SITE.address} />
          <Info Icon={Phone} label="Phone" value={SITE.phone} />
          <Info Icon={Mail} label="Email" value={SITE.email} />
          <div className="rounded-2xl brand-gradient text-white p-6 shadow-glow">
            <div className="text-xs uppercase tracking-widest opacity-80">Emergency line</div>
            <div className="font-display text-2xl mt-1">{SITE.emergency}</div>
            <p className="text-sm mt-2 opacity-90">For bereavement and urgent welfare matters.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 rounded-3xl border border-border bg-card p-7 shadow-soft grid gap-4">
          {state === "sent" ? (
            <div className="text-center py-10">
              <CheckCircle2 className="h-10 w-10 mx-auto text-green-600" />
              <h2 className="mt-3 font-display text-2xl">Message sent</h2>
              <p className="mt-2 text-sm text-muted-foreground">Thank you. We'll get back to you shortly.</p>
              <Button className="mt-5" variant="outline" onClick={() => { setState("idle"); setValues({ name: "", email: "", subject: "", message: "" }); }}>
                Send another message
              </Button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl">Send us a message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Your name" error={errors.name}>
                  <Input value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} maxLength={120} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <Input type="email" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} maxLength={200} />
                </Field>
              </div>
              <Field label="Subject" error={errors.subject}>
                <Input value={values.subject} onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))} maxLength={160} />
              </Field>
              <Field label="Message" error={errors.message}>
                <Textarea rows={6} value={values.message} onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))} maxLength={2000} />
              </Field>
              {state === "error" && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive flex gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {errMsg}
                </div>
              )}
              <Button type="submit" disabled={state === "submitting"} className="brand-gradient text-white border-0 hover:opacity-90 mt-2">
                {state === "submitting" ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</> : <><Send className="h-4 w-4 mr-2" /> Send message</>}
              </Button>
              <p className="text-xs text-muted-foreground">
                Messages will be saved to the admin dashboard once Lovable Cloud is enabled in Phase 2.
              </p>
            </>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}

function Info({ Icon, label, value }: { Icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex gap-4">
      <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-white shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
