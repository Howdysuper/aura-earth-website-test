"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "./Toast";
import type { Address } from "@/db/schema";

type AddressInput = Omit<Address, "id" | "userId" | "createdAt" | "isDefault"> & {
  isDefault?: boolean;
};

const blank: AddressInput = {
  label: "Home",
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

export function AddressBook({
  initialAddresses,
  defaultName,
  defaultCountry,
}: {
  initialAddresses: Address[];
  defaultName: string;
  defaultCountry: string;
}) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<AddressInput>({
    ...blank,
    fullName: defaultName,
    country: defaultCountry,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { show } = useToast();

  async function add(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAddresses((prev) => [data.address, ...prev]);
        setAdding(false);
        setForm({ ...blank, fullName: defaultName, country: defaultCountry });
        show("Address saved", "success");
      } else {
        setError(data.error ?? "Could not save.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this address?")) return;
    const res = await fetch(`/api/account/profile?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      show("Address removed");
    } else {
      show("Could not remove", "error");
    }
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !adding && (
        <p className="rounded-2xl bg-white/70 px-5 py-8 text-center text-ink-soft ring-1 ring-black/5">
          You haven&apos;t saved any addresses yet.
        </p>
      )}
      {addresses.map((a) => (
        <div
          key={a.id}
          className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-base font-semibold text-ink">
                  {a.label}
                </p>
                {a.isDefault && (
                  <span className="rounded-full bg-sage px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink">{a.fullName}</p>
              <p className="text-sm text-ink-soft">
                {a.address}, {a.city}, {a.postalCode}, {a.country}
              </p>
            </div>
            <button
              onClick={() => remove(a.id)}
              className="text-sm text-ink-soft transition hover:text-clay"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {adding ? (
        <form
          onSubmit={add}
          className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Label"
              value={form.label}
              onChange={(v) => setForm({ ...form, label: v })}
            />
            <Field
              label="Full name"
              value={form.fullName}
              onChange={(v) => setForm({ ...form, fullName: v })}
            />
            <div className="col-span-2">
              <Field
                label="Street address"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
              />
            </div>
            <Field
              label="City"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
            />
            <Field
              label="Postal code"
              value={form.postalCode}
              onChange={(v) => setForm({ ...form, postalCode: v })}
            />
            <div className="col-span-2">
              <Field
                label="Country"
                value={form.country}
                onChange={(v) => setForm({ ...form, country: v })}
              />
            </div>
            <label className="col-span-2 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={!!form.isDefault}
                onChange={(e) =>
                  setForm({ ...form, isDefault: e.target.checked })
                }
                className="h-4 w-4 rounded border-black/20 text-moss focus:ring-sage"
              />
              Set as default address
            </label>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-clay/10 px-3 py-2 text-sm font-medium text-clay"
            >
              {error}
            </p>
          )}
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save address"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setError("");
              }}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-black/10 transition hover:bg-cream-soft"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
        >
          + Add a new address
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-white px-3 py-2.5 text-base text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
      />
    </div>
  );
}
