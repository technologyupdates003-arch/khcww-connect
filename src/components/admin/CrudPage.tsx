import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type FieldType = "text" | "textarea" | "url" | "number" | "datetime" | "boolean" | "list" | "select";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  help?: string;
  options?: { value: string; label: string }[];
}

export interface ColumnDef<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface Props<T extends { id: string }> {
  table: string;
  title: string;
  orderBy: { column: string; ascending?: boolean };
  columns: ColumnDef<T>[];
  fields: FieldDef[];
  emptyMessage?: string;
  beforeSave?: (values: any) => any;
}

export function CrudPage<T extends { id: string }>(props: Props<T>) {
  const { table, title, orderBy, columns, fields, emptyMessage, beforeSave } = props;
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<T | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from(table)
      .select("*")
      .order(orderBy.column, { ascending: orderBy.ascending ?? false });
    if (error) toast.error(error.message);
    setRows((data as T[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); /* eslint-disable-next-line */ }, [table]);

  const onDelete = async () => {
    if (!deleting) return;
    const { error } = await (supabase as any).from(table).delete().eq("id", deleting.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); setDeleting(null); load(); }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} {rows.length === 1 ? "item" : "items"}</p>
        <Button onClick={() => setCreating(true)} className="brand-gradient text-white border-0">
          <Plus className="h-4 w-4 mr-2" /> New
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 mx-auto animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            {emptyMessage ?? `No ${title.toLowerCase()} yet. Click "New" to create one.`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left">
                <tr>
                  {columns.map((c) => (
                    <th key={String(c.key)} className={`px-4 py-3 font-medium ${c.className ?? ""}`}>
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-border hover:bg-surface-2/50">
                    {columns.map((c) => (
                      <td key={String(c.key)} className={`px-4 py-3 ${c.className ?? ""}`}>
                        {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(row)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleting(row)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FormDialog
        open={creating || !!editing}
        onClose={() => { setCreating(false); setEditing(null); }}
        title={editing ? `Edit ${title}` : `New ${title}`}
        fields={fields}
        initial={editing ?? undefined}
        onSubmit={async (values) => {
          const payload = beforeSave ? beforeSave(values) : values;
          if (editing) {
            const { error } = await (supabase as any).from(table).update(payload).eq("id", editing.id);
            if (error) { toast.error(error.message); return false; }
            toast.success("Updated");
          } else {
            const { error } = await (supabase as any).from(table).insert(payload);
            if (error) { toast.error(error.message); return false; }
            toast.success("Created");
          }
          await load();
          return true;
        }}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FormDialog({
  open, onClose, title, fields, initial, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FieldDef[];
  initial?: any;
  onSubmit: (values: any) => Promise<boolean>;
}) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      const init: Record<string, any> = {};
      for (const f of fields) {
        const v = initial?.[f.name];
        if (v !== undefined && v !== null) {
          if (f.type === "datetime" && typeof v === "string") init[f.name] = v.slice(0, 16);
          else if (f.type === "list" && Array.isArray(v)) init[f.name] = v.join("\n");
          else init[f.name] = v;
        } else if (f.defaultValue !== undefined) {
          init[f.name] = f.type === "list" && Array.isArray(f.defaultValue) ? f.defaultValue.join("\n") : f.defaultValue;
        } else {
          init[f.name] = f.type === "boolean" ? false : f.type === "number" ? 0 : "";
        }
      }
      setValues(init);
    }
  }, [open, initial, fields]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload: Record<string, any> = {};
    for (const f of fields) {
      let v = values[f.name];
      if (f.type === "number") v = v === "" ? null : Number(v);
      if (f.type === "datetime") v = v ? new Date(v).toISOString() : null;
      if (f.type === "list") {
        v = typeof v === "string"
          ? v.split("\n").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(v) ? v : [];
      }
      if ((v === "" || v === undefined) && !f.required && f.type !== "list") v = null;
      payload[f.name] = v;
    }
    const ok = await onSubmit(payload);
    setBusy(false);
    if (ok) onClose();
  };


  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-4 mt-2">
          {fields.map((f) => (
            <div key={f.name} className="grid gap-1.5">
              <Label>
                {f.label}
                {f.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {f.type === "textarea" || f.type === "list" ? (
                <Textarea
                  rows={f.type === "list" ? 5 : 6}
                  required={f.required}
                  placeholder={f.placeholder ?? (f.type === "list" ? "One item per line" : undefined)}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                />
              ) : f.type === "boolean" ? (
                <div className="flex items-center gap-2 h-9">
                  <Switch
                    checked={!!values[f.name]}
                    onCheckedChange={(c) => setValues((v) => ({ ...v, [f.name]: c }))}
                  />
                  <span className="text-sm text-muted-foreground">{values[f.name] ? "Yes" : "No"}</span>
                </div>
              ) : f.type === "select" ? (
                <select
                  required={f.required}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select…</option>
                  {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <Input
                  type={f.type === "datetime" ? "datetime-local" : f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                />
              )}
              {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
            </div>
          ))}
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
            <Button type="submit" disabled={busy} className="brand-gradient text-white border-0">
              {busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
