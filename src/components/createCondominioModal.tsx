"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    nome_condominio: string;
    endereco_condominio: string;
    cidade_condominio: string;
    uf_condominio: string;
    tipo_condominio: string;
  }) => Promise<void> | void;
}

const UFOptions = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const CondominiumTypes = ["Residencial", "Comercial", "Misto", "Industrial"];

export default function CreateCondominioModal({ open, onClose, onSave }: Props) {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!nome.trim()) newErrors.nome = "Nome do condomínio é obrigatório";
    if (!endereco.trim()) newErrors.endereco = "Endereço é obrigatório";
    if (!cidade.trim()) newErrors.cidade = "Cidade é obrigatória";
    if (!uf) newErrors.uf = "UF é obrigatório";
    if (!tipo) newErrors.tipo = "Tipo é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await onSave({
        nome_condominio: nome,
        endereco_condominio: endereco,
        cidade_condominio: cidade,
        uf_condominio: uf,
        tipo_condominio: tipo,
      });

      setNome("");
      setEndereco("");
      setCidade("");
      setUf("");
      setTipo("");
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done by parent
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setNome("");
      setEndereco("");
      setCidade("");
      setUf("");
      setTipo("");
      setErrors({});
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-condominio-title"
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="create-condominio-title" className="text-xl font-semibold text-gray-900">
            Criar Novo Condomínio
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
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
                placeholder="Ex: Residencial Jardim das Flores"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (errors.nome) setErrors({ ...errors, nome: "" });
                }}
                error={errors.nome}
                disabled={loading}
              />
            </div>

            {/* Endereço */}
            <div className="sm:col-span-2">
              <Input
                label="Endereço"
                placeholder="Ex: Rua Primavera 150"
                value={endereco}
                onChange={(e) => {
                  setEndereco(e.target.value);
                  if (errors.endereco) setErrors({ ...errors, endereco: "" });
                }}
                error={errors.endereco}
                disabled={loading}
              />
            </div>

            {/* Cidade */}
            <div>
              <Input
                label="Cidade"
                placeholder="Ex: Campinas"
                value={cidade}
                onChange={(e) => {
                  setCidade(e.target.value);
                  if (errors.cidade) setErrors({ ...errors, cidade: "" });
                }}
                error={errors.cidade}
                disabled={loading}
              />
            </div>

            {/* UF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado (UF)
              </label>
              <select
                value={uf}
                onChange={(e) => {
                  setUf(e.target.value);
                  if (errors.uf) setErrors({ ...errors, uf: "" });
                }}
                disabled={loading}
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
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value);
                  if (errors.tipo) setErrors({ ...errors, tipo: "" });
                }}
                disabled={loading}
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
              disabled={loading}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
              variant="success"
            >
              Criar Condomínio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
