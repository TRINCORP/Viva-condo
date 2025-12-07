"use client";

import { useEffect, useState } from "react";
import { ICondominio } from "@/services/condominio.service";
import { X } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

type Props = {
  open: boolean;
  data: ICondominio | null;
  onClose: () => void;
  onSave: (updates: {
    nome_condominio: string;
    endereco_condominio: string;
    cidade_condominio: string;
    uf_condominio: string;
    tipo_condominio: string;
  }) => Promise<void>;
};

const UFOptions = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const CondominiumTypes = ["Residencial", "Comercial", "Misto", "Industrial"];

export default function EditCondominioModal({ open, data, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    nome_condominio: "",
    endereco_condominio: "",
    cidade_condominio: "",
    uf_condominio: "",
    tipo_condominio: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !data) return;
    setForm({
      nome_condominio: data.nome_condominio ?? "",
      endereco_condominio: data.endereco_condominio ?? "",
      cidade_condominio: data.cidade_condominio ?? "",
      uf_condominio: data.uf_condominio ?? "",
      tipo_condominio: data.tipo_condominio ?? "",
    });
    setErrors({});
    setSaving(false);
  }, [open, data]);

  if (!open || !data) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.nome_condominio.trim()) newErrors.nome = "Nome do condomínio é obrigatório";
    if (!form.endereco_condominio.trim()) newErrors.endereco = "Endereço é obrigatório";
    if (!form.cidade_condominio.trim()) newErrors.cidade = "Cidade é obrigatória";
    if (!form.uf_condominio) newErrors.uf = "UF é obrigatório";
    if (!form.tipo_condominio) newErrors.tipo = "Tipo é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors({ ...errors, [key]: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);

    try {
      await onSave(form);
    } catch (e: any) {
      // Error is handled by parent
    } finally {
      setSaving(false);
    }
  }

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-condominio-title"
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
          <h2 id="edit-condominio-title" className="text-xl font-semibold text-gray-900">
            Editar Condomínio #{data.id_condominio}
          </h2>
          <button
            onClick={handleClose}
            disabled={saving}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="sm:col-span-2">
              <Input
                label="Nome do Condomínio"
                value={form.nome_condominio}
                onChange={(e) => updateField("nome_condominio", e.target.value)}
                error={errors.nome}
                disabled={saving}
              />
            </div>

            {/* Endereço */}
            <div className="sm:col-span-2">
              <Input
                label="Endereço"
                value={form.endereco_condominio}
                onChange={(e) => updateField("endereco_condominio", e.target.value)}
                error={errors.endereco}
                disabled={saving}
              />
            </div>

            {/* Cidade */}
            <div>
              <Input
                label="Cidade"
                value={form.cidade_condominio}
                onChange={(e) => updateField("cidade_condominio", e.target.value)}
                error={errors.cidade}
                disabled={saving}
              />
            </div>

            {/* UF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado (UF)
              </label>
              <select
                value={form.uf_condominio}
                onChange={(e) => updateField("uf_condominio", e.target.value)}
                disabled={saving}
                className={`
                  w-full px-4 py-2 rounded-lg border
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.uf ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
                `}
              >
                <option value="">Selecione um estado</option>
                {UFOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.uf && <p className="text-sm text-red-600 mt-1">{errors.uf}</p>}
            </div>

            {/* Tipo */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Condomínio
              </label>
              <select
                value={form.tipo_condominio}
                onChange={(e) => updateField("tipo_condominio", e.target.value)}
                disabled={saving}
                className={`
                  w-full px-4 py-2 rounded-lg border
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.tipo ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
                `}
              >
                <option value="">Selecione um tipo</option>
                {CondominiumTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.tipo && <p className="text-sm text-red-600 mt-1">{errors.tipo}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleClose}
              disabled={saving}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              isLoading={saving}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
