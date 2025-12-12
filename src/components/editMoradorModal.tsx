"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

type Morador = {
  id_morador: string;
  nome_morador: string;
  email_morador?: string | null;
  telefone_morador?: string | null;
  bloco?: string | null;
  unidade?: string | null;
  status_morador?: string | null;
};

type Props = {
  open: boolean;
  data: Morador | null;
  onClose: () => void;
  onSave: (updates: {
    nome_morador: string;
    email_morador?: string | null;
    telefone_morador?: string | null;
    bloco?: string | null;
    unidade?: string | null;
    status_morador?: string | null;
  }) => Promise<void> | void;
};

const StatusOptions = ["ativo", "inativo"];

export default function EditMoradorModal({ open, data, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    nome_morador: "",
    email_morador: null as string | null,
    telefone_morador: null as string | null,
    bloco: null as string | null,
    unidade: null as string | null,
    status_morador: "ativo" as string | null,
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !data) return;

    setForm({
      nome_morador: data.nome_morador ?? "",
      email_morador: data.email_morador ?? null,
      telefone_morador: data.telefone_morador ?? null,
      bloco: data.bloco ?? null,
      unidade: data.unidade ?? null,
      status_morador: data.status_morador ?? "ativo",
    });

    setErrors({});
    setSaving(false);
  }, [open, data]);

  if (!open || !data) return null;

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!form.nome_morador.trim()) {
      newErrors.nome = "Nome do morador é obrigatório";
    }

    if (
      form.email_morador &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_morador)
    ) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors({ ...errors, [key as string]: "" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  const handleClose = () => {
    if (!saving) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-morador-title"
      aria-busy={saving || undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !saving) handleClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="edit-morador-title" className="text-xl font-semibold text-gray-900">
            Editar Morador — {data.nome_morador}
          </h2>
          <button
            onClick={handleClose}
            disabled={saving}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nome do Morador"
                value={form.nome_morador}
                onChange={(e) => updateField("nome_morador", e.target.value)}
                error={errors.nome}
                disabled={saving}
              />
            </div>

            <Input
              label="Email"
              value={form.email_morador ?? ""}
              onChange={(e) =>
                updateField("email_morador", e.target.value || null)
              }
              error={errors.email}
              disabled={saving}
            />

            <Input
              label="Telefone"
              value={form.telefone_morador ?? ""}
              onChange={(e) =>
                updateField("telefone_morador", e.target.value || null)
              }
              disabled={saving}
            />

            <Input
              label="Bloco"
              value={form.bloco ?? ""}
              onChange={(e) => updateField("bloco", e.target.value || null)}
              disabled={saving}
            />

            <Input
              label="Unidade"
              value={form.unidade ?? ""}
              onChange={(e) => updateField("unidade", e.target.value || null)}
              disabled={saving}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={form.status_morador ?? "ativo"}
                onChange={(e) =>
                  updateField("status_morador", e.target.value)
                }
                disabled={saving}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                {StatusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" onClick={handleClose} disabled={saving} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} isLoading={saving}>
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
