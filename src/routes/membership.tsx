import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { AlertCircle, CheckCircle2, Clock, CreditCard, Loader2, ShieldCheck, Smartphone, XCircle } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { wmsApi, type StatusResponse } from "@/lib/wms-api";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Join KHCWW — Membership Registration" },
      { name: "description", content: "Register as a KHCWW member. Pay the registration fee via M-Pesa and track your approval status." },
      { property: "og:title", content: "Join KHCWW" },
      { property: "og:description", content: "Secure online registration with M-Pesa STK Push." },
      { property: "og:url", content: "/membership" },
    ],
    links: [{ rel: "canonical", href: "/membership" }],
  }),
  component: Membership,
});

const registerSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  phone_number: z
    .string()
    .trim()
    .regex(/^(?:\+?254|0)?7\d{8}$/, "Enter a valid Kenyan phone number"),
  department: z.string().trim().min(2, "Enter your department").max(120),
  working_location: z.string().trim().min(2, "Enter your working location").max(160),
});

type FormValues = z.infer<typeof registerSchema>;

function normalizePhone(p: string): string {
  const s = p.replace(/\s+/g, "");
  if (s.startsWith("+254")) return s.slice(1);
  if (s.startsWith("254")) return s;
  if (s.startsWith("0")) return "254" + s.slice(1);
  return s;
}

type Step = 1 | 2 | 3 | 4;

function Membership() {
  const [step, setStep] = useState<Step>(1);
  const [values, setValues] = useState<FormValues>({
    full_name: "",
    phone_number: "",
    department: "",
    working_location: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [fee, setFee] = useState<number | null>(null);

  const configQuery = useQuery({
    queryKey: ["wms", "config"],
    queryFn: () => wmsApi.getConfig(),
    retry: 1,
  });

  const registerMut = useMutation({
    mutationFn: (data: FormValues) =>
      wmsApi.register({ ...data, phone_number: normalizePhone(data.phone_number) }),
    onSuccess: (res) => {
      setRegistrationId(res.registration_id);
      setFee(res.registration_fee);
      setStep(3);
    },
  });

  const paymentMut = useMutation({
    mutationFn: () => {
      if (!registrationId) throw new Error("No registration id");
      return wmsApi.initiatePayment({
        registration_id: registrationId,
        phone_number: normalizePhone(values.phone_number),
      });
    },
    onSuccess: () => setStep(4),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      const eobj: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormValues;
        if (!eobj[k]) eobj[k] = issue.message;
      }
      setErrors(eobj);
      return;
    }
    setErrors({});
    registerMut.mutate(parsed.data);
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Membership"
        title="Join Kirinyaga Health Care Workers Welfare"
        subtitle="Four quick steps. Your registration is processed by the KHCWW Welfare Management System."
      />

      <section className="container-x py-14">
        <Stepper step={step} />
        <div className="mt-10 max-w-2xl mx-auto rounded-3xl border border-border bg-card p-7 md:p-10 shadow-soft">
          {step === 1 && (
            <Step1
              loading={configQuery.isLoading}
              error={configQuery.error?.message}
              fee={configQuery.data?.registration_fee}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <h2 className="font-display text-2xl">Your details</h2>
              <Field label="Full name" error={errors.full_name}>
                <Input value={values.full_name} onChange={(e) => setValues((v) => ({ ...v, full_name: e.target.value }))} maxLength={120} />
              </Field>
              <Field label="Phone number (M-Pesa)" error={errors.phone_number}>
                <Input value={values.phone_number} placeholder="0712 345 678" onChange={(e) => setValues((v) => ({ ...v, phone_number: e.target.value }))} maxLength={20} />
              </Field>
              <Field label="Department" error={errors.department}>
                <Input value={values.department} placeholder="e.g. Nursing, Lab, Pharmacy" onChange={(e) => setValues((v) => ({ ...v, department: e.target.value }))} maxLength={120} />
              </Field>
              <Field label="Working location" error={errors.working_location}>
                <Input value={values.working_location} placeholder="e.g. Kerugoya County Referral Hospital" onChange={(e) => setValues((v) => ({ ...v, working_location: e.target.value }))} maxLength={160} />
              </Field>
              {registerMut.error && (
                <ErrorBanner message={(registerMut.error as Error).message} />
              )}
              <div className="flex gap-3 mt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" disabled={registerMut.isPending} className="brand-gradient text-white border-0 hover:opacity-90 flex-1">
                  {registerMut.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…</> : "Continue to Payment"}
                </Button>
              </div>
            </form>
          )}
          {step === 3 && (
            <div className="grid gap-5">
              <h2 className="font-display text-2xl">Pay registration fee</h2>
              <div className="rounded-xl bg-surface-2 p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl brand-gradient grid place-items-center text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Amount</div>
                  <div className="font-display text-2xl">KES {(fee ?? configQuery.data?.registration_fee ?? 0).toLocaleString()}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                We'll send an M-Pesa STK Push to <span className="font-medium text-foreground">{normalizePhone(values.phone_number)}</span>.
                Enter your M-Pesa PIN on your phone to complete the payment.
              </p>
              {paymentMut.error && <ErrorBanner message={(paymentMut.error as Error).message} />}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button disabled={paymentMut.isPending} onClick={() => paymentMut.mutate()} className="brand-gradient text-white border-0 hover:opacity-90 flex-1">
                  {paymentMut.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending STK Push…</> : <><Smartphone className="h-4 w-4 mr-2" /> Send M-Pesa Request</>}
                </Button>
              </div>
            </div>
          )}
          {step === 4 && registrationId && <Step4 registrationId={registrationId} />}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground max-w-xl mx-auto">
          <ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-accent" />
          Your data is sent directly to the KHCWW Welfare Management System. This website does
          not store your personal information.
        </p>
      </section>
    </SiteLayout>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = ["Requirements", "Your details", "Payment", "Status"];
  return (
    <ol className="flex items-center justify-between max-w-2xl mx-auto gap-2">
      {items.map((label, i) => {
        const n = (i + 1) as Step;
        const active = n === step;
        const done = n < step;
        return (
          <li key={label} className="flex-1 flex items-center gap-2">
            <div
              className={`h-9 w-9 shrink-0 rounded-full grid place-items-center text-sm font-semibold border ${
                done
                  ? "brand-gradient text-white border-transparent"
                  : active
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-card text-muted-foreground border-border"
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : n}
            </div>
            <span className={`hidden sm:inline text-xs ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
            {i < items.length - 1 && <span className="flex-1 h-px bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

function Step1({
  loading,
  error,
  fee,
  onNext,
}: {
  loading: boolean;
  error?: string;
  fee?: number;
  onNext: () => void;
}) {
  return (
    <div className="grid gap-5">
      <h2 className="font-display text-2xl">Membership requirements</h2>
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading requirements…
        </div>
      )}
      {error && <ErrorBanner message={error} />}
      <ul className="space-y-3 text-sm">
        {[
          "You must be a practicing or retired health care worker in Kirinyaga County.",
          "You must provide a valid M-Pesa phone number for the registration fee.",
          "Your registration must be approved by the Welfare Committee.",
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <div className="rounded-xl bg-surface-2 p-5 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Registration fee</div>
          <div className="font-display text-2xl">
            {fee != null ? `KES ${fee.toLocaleString()}` : "—"}
          </div>
        </div>
        <CreditCard className="h-7 w-7 text-accent" />
      </div>
      <Button onClick={onNext} className="brand-gradient text-white border-0 hover:opacity-90">
        Start registration
      </Button>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive flex gap-2">
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <div className="break-words">{message}</div>
    </div>
  );
}

function Step4({ registrationId }: { registrationId: string }) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stopped = useRef(false);

  useEffect(() => {
    stopped.current = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        const s = await wmsApi.getStatus(registrationId);
        if (stopped.current) return;
        setStatus(s);
        if (s.status === "approved" || s.status === "rejected") return;
      } catch (err) {
        if (!stopped.current) setError((err as Error).message);
      }
      if (!stopped.current) timer = setTimeout(tick, 4000);
    };
    tick();
    return () => {
      stopped.current = true;
      clearTimeout(timer!);
    };
  }, [registrationId]);

  const view = useMemo(() => {
    const s = status?.status ?? "payment_pending";
    if (s === "approved")
      return { Icon: CheckCircle2, color: "text-green-600", title: "Membership approved", body: "Welcome to KHCWW! You can now log in to the Welfare Management System." };
    if (s === "rejected")
      return { Icon: XCircle, color: "text-destructive", title: "Registration rejected", body: status?.message ?? "Please contact the welfare office for assistance." };
    if (s === "verified")
      return { Icon: ShieldCheck, color: "text-accent-foreground", title: "Payment verified", body: "Your payment has been received. Awaiting committee approval." };
    return { Icon: Clock, color: "text-muted-foreground", title: "Waiting for payment", body: "Complete the M-Pesa prompt on your phone. This page updates automatically." };
  }, [status]);

  return (
    <div className="grid gap-5 text-center">
      <h2 className="font-display text-2xl">Registration status</h2>
      <div className="mx-auto h-16 w-16 rounded-full bg-surface-2 grid place-items-center">
        <view.Icon className={`h-8 w-8 ${view.color}`} />
      </div>
      <div>
        <div className="font-display text-xl">{view.title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{view.body}</p>
      </div>
      <div className="rounded-lg bg-surface-2 p-3 text-xs text-muted-foreground">
        Registration ID: <span className="font-mono text-foreground">{registrationId}</span>
      </div>
      {error && <ErrorBanner message={error} />}
    </div>
  );
}
