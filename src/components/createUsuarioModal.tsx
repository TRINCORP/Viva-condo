"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    nome_usuario: string;
    email_usuario?: string | null;
    empresa_usuario?: string | null;
    role_usuario?: string | null;
    id_administradora?: number | null;
    id_condominio?: number | null;
  }) => Promise<void> | void;
}

const UserRoles = ["admin", "usuario", "síndico", "morador"];

export default function CreateUsuarioModal({ open, onClose, onSave }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [empresa, setEmpresa] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [idAdministradora, setIdAdministradora] = useState<string>("");
  const [idCondominio, setIdCondominio] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!nome.trim()) newErrors.nome = "Nome do usuário é obrigatório";
    // basic email check
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      await onSave({
        nome_usuario: nome,
        email_usuario: email,
        empresa_usuario: empresa,
        role_usuario: role,
        id_administradora: idAdministradora ? Number(idAdministradora) : null,
        id_condominio: idCondominio ? Number(idCondominio) : null,
      });

      setNome("");
      setEmail(null);
      setEmpresa(null);
      setRole(null);
      setIdAdministradora("");
      setIdCondominio("");
      setErrors({});
      onClose();
    } catch (error) {
      // parent handles errors / toast
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setNome("");
      setEmail(null);
      setEmpresa(null);
      setRole(null);
      setIdAdministradora("");
      setIdCondominio("");
      setErrors({});
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-usuario-title"
      aria-busy={loading || undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !loading) handleClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="create-usuario-title" className="text-xl font-semibold text-gray-900">
            Criar Novo Usuário
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
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
                placeholder="Ex: João Silva"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (errors.nome) setErrors({ ...errors, nome: "" });
                }}
                error={errors.nome}
                disabled={loading}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Email"
                placeholder="usuario@empresa.com"
                value={email ?? ""}
                onChange={(e) => { setEmail(e.target.value || null); if (errors.email) setErrors({ ...errors, email: "" }); }}
                error={errors.email}
                disabled={loading}
              />
            </div>

            <div>
              <Input
                label="Empresa"
                placeholder="Empresa/Organização (opcional)"
                value={empresa ?? ""}
                onChange={(e) => setEmpresa(e.target.value || null)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
              <select
                value={role ?? ""}
                onChange={(e) => setRole(e.target.value || null)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma função (opcional)</option>
                {UserRoles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Administradora (ID)"
                placeholder="ID da administradora (opcional)"
                value={idAdministradora}
                onChange={(e) => setIdAdministradora(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Input
                label="Condomínio (ID)"
                placeholder="ID do condomínio (opcional)"
                value={idCondominio}
                onChange={(e) => setIdCondominio(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" onClick={handleClose} disabled={loading} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} isLoading={loading} variant="success">
              Criar Usuário
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
