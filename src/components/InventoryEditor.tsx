"use client";

import { useState } from "react";
import type { Product } from "@/db/schema";
import { formatPrice } from "@/lib/format";

type Row = {
  id: string;
  name: string;
  stock: number;
  priceCents: number;
};

export function InventoryEditor({ products }: { products: Product[] }) {
  const [rows, setRows] = useState<Row[]>(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      priceCents: p.priceCents,
    })),
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function update(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function save(row: Row) {
    setSaving(row.id);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          stock: row.stock,
          priceCents: row.priceCents,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSavedId(row.id);
        setTimeout(() => setSavedId((v) => (v === row.id ? null : v)), 1800);
      } else {
        setError(data.error ?? "Save failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5">
      {error && (
        <p className="bg-clay/10 px-5 py-2 text-sm font-medium text-clay">
          {error}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 font-semibold">Price (USD)</th>
              <th className="px-5 py-3 font-semibold">Stock</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status =
                row.stock <= 0
                  ? { label: "Sold out", cls: "bg-ink/80 text-white" }
                  : row.stock <= 20
                    ? { label: "Low", cls: "bg-clay text-white" }
                    : { label: "Healthy", cls: "bg-sage text-white" };
              return (
                <tr
                  key={row.id}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-5 py-3 font-medium text-ink">{row.name}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-ink-soft">$</span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={(row.priceCents / 100).toString()}
                        onChange={(e) =>
                          update(row.id, {
                            priceCents: Math.round(
                              (parseFloat(e.target.value) || 0) * 100,
                            ),
                          })
                        }
                        className="w-24 rounded-lg bg-white px-2 py-1.5 text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
                        aria-label={`Price for ${row.name}`}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          update(row.id, { stock: Math.max(0, row.stock - 5) })
                        }
                        className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-black/10 transition hover:bg-black/5"
                        aria-label="Decrease stock by 5"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={row.stock}
                        onChange={(e) =>
                          update(row.id, {
                            stock: Math.max(0, parseInt(e.target.value) || 0),
                          })
                        }
                        className="w-20 rounded-lg bg-white px-2 py-1.5 text-center text-ink ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-sage"
                        aria-label={`Stock for ${row.name}`}
                      />
                      <button
                        onClick={() => update(row.id, { stock: row.stock + 5 })}
                        className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-black/10 transition hover:bg-black/5"
                        aria-label="Increase stock by 5"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => save(row)}
                      disabled={saving === row.id}
                      className="rounded-full bg-moss px-4 py-2 text-xs font-semibold text-cream-soft transition hover:bg-sage-deep disabled:opacity-60"
                    >
                      {saving === row.id
                        ? "Saving…"
                        : savedId === row.id
                          ? "Saved ✓"
                          : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="px-5 py-3 text-xs text-ink-soft">
        Current catalog value:{" "}
        <span className="font-semibold text-ink">
          {formatPrice(
            rows.reduce((sum, r) => sum + r.priceCents * r.stock, 0),
          )}
        </span>{" "}
        across {rows.reduce((sum, r) => sum + r.stock, 0)} units.
      </p>
    </div>
  );
}
