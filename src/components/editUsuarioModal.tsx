"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

type Usuario = {
  id_usuario: string;
  created_at?: string | null;
  nome_usuario: string;
  email_usuario?: string | null;
  empresa_usuario?: string | null;
  role_usuario?: string | null;
  id_administradora?: number | null;
  id_condominio?: number | null;
};

type Props = {
  open: boolean;
  data: Usuario | null;
  onClose: () => void;
  onSave: (updates: {
    nome_usuario: string;
    email_usuario?: string | null;
    empresa_usuario?: string | null;
    role_usuario?: string | null;
    id_administradora?: number | null;
    id_condominio?: number | null;
  }) => Promise<void> | void;
};

const UserRoles = ["admin", "usuario", "síndico", "morador"];

export default function EditUsuarioModal({ open, data, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    nome_usuario: "",
    email_usuario: null as string | null,
    empresa_usuario: null as string | null,
    role_usuario: null as string | null,
    id_administradora: null as number | null,
    id_condominio: null as number | null,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !data) return;
    setForm({
      nome_usuario: data.nome_usuario ?? "",
      email_usuario: data.email_usuario ?? null,
      empresa_usuario: data.empresa_usuario ?? null,
      role_usuario: data.role_usuario ?? null,
      id_administradora: data.id_administradora ?? null,
      id_condominio: data.id_condominio ?? null,
    });
    setErrors({});
    setSaving(false);
  }, [open, data]);

  if (!open || !data) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nome_usuario.trim()) newErrors.nome = "Nome do usuário é obrigatório";
    if (form.email_usuario && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_usuario)) newErrors.email = "Email inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) setErrors({ ...errors, [key as string]: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      await onSave(form);
    } catch (e: any) {
      // parent handles errors
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
      aria-labelledby="edit-usuario-title"
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="edit-usuario-title" className="text-xl font-semibold text-gray-900">
            Editar Usuário {data.nome_usuario}
          </h2>
          <button
            onClick={handleClose}
            disabled={saving}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nome do Usuário"
                value={form.nome_usuario}
                onChange={(e) => updateField("nome_usuario", e.target.value)}
                error={errors.nome}
                disabled={saving}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Email"
                value={form.email_usuario ?? ""}
                onChange={(e) => updateField("email_usuario", e.target.value || null)}
                error={errors.email}
                disabled={saving}
              />
            </div>

            <div>
              <Input
                label="Empresa"
                value={form.empresa_usuario ?? ""}
                onChange={(e) => updateField("empresa_usuario", e.target.value || null)}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
              <select
                value={form.role_usuario ?? ""}
                onChange={(e) => updateField("role_usuario", e.target.value || null)}
                disabled={saving}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">(não definido)</option>
                {UserRoles.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Administradora (ID)"
                value={form.id_administradora ?? "" as any}
                onChange={(e) => updateField("id_administradora", e.target.value ? Number(e.target.value) : null)}
                disabled={saving}
              />
            </div>

            <div>
              <Input
                label="Condomínio (ID)"
                value={form.id_condominio ?? "" as any}
                onChange={(e) => updateField("id_condominio", e.target.value ? Number(e.target.value) : null)}
                disabled={saving}
              />
            </div>
          </div>

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
