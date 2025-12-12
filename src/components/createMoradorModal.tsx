"use client";

import { X } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    nome_morador: string;
    email_morador?: string | null;
    telefone_morador?: string | null;
    bloco?: string | null;
    unidade?: string | null;
    status_morador?: string | null;
    id_condominio: number;
  }) => Promise<void> | void;
};

export default function CreateMoradorModal({ open, onClose, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome_morador: "",
    email_morador: "",
    telefone_morador: "",
    bloco: "",
    unidade: "",
    status_morador: "ativo",
    id_condominio: "",
  });

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        id_condominio: Number(form.id_condominio),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Novo Morador</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            value={form.nome_morador}
            onChange={(e) =>
              setForm({ ...form, nome_morador: e.target.value })
            }
          />

          <Input
            label="Condomínio (ID)"
            value={form.id_condominio}
            onChange={(e) =>
              setForm({ ...form, id_condominio: e.target.value })
            }
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={saving}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
