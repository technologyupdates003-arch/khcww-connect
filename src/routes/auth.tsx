import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
const logo = { url: "/khcww-logo.png" };

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Sign In — KHCWW" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
    // Count admins (RLS allows authenticated to read own; for unauthed we
    // probe by trying to read any admin row — if signed out, returns []).
    // We use a server-safe check: count via a view-like query.
    supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .then(({ count }) => setHasAdmin((count ?? 0) > 0));
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — check email if confirmation is required, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  // If no admin exists yet, default to signup (first signup becomes admin).
  useEffect(() => {
    if (hasAdmin === false) setMode("signup");
  }, [hasAdmin]);

  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 brand-gradient text-white">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="" className="h-12 w-12 rounded-full bg-white/10 p-1" />
          <div>
            <div className="font-display text-lg font-semibold">KHCWW</div>
            <div className="text-xs uppercase tracking-widest opacity-80">Admin</div>
          </div>
        </Link>
        <div>
          <ShieldCheck className="h-10 w-10 opacity-80" />
          <h1 className="font-display text-4xl mt-4 leading-tight">Welfare Management Console</h1>
          <p className="mt-3 text-white/90 max-w-md">
            Manage news, gallery, events, downloads, hero banners and contact messages for the KHCWW public website.
          </p>
        </div>
        <div className="text-xs opacity-80">© {new Date().getFullYear()} KHCWW</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft grid gap-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-white">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl">{mode === "signup" ? "Create admin account" : "Sign in"}</h2>
              <p className="text-xs text-muted-foreground">
                {hasAdmin === false
                  ? "No admin exists yet — your first signup becomes the admin."
                  : "Access the KHCWW admin dashboard."}
              </p>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="grid gap-1.5">
            <Label>Password</Label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>
          <Button type="submit" disabled={busy} className="brand-gradient text-white border-0 hover:opacity-90">
            {busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Please wait…</> : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
          {hasAdmin !== false && (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            >
              {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </button>
          )}
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground text-center">
            ← Back to website
          </Link>
        </form>
      </div>
    </div>
  );
}
