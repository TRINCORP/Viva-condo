"use client";

import { useEffect, useState } from "react";
import {
  getMoradores,
  deleteMorador,
  updateMorador,
  createMorador,
} from "@/services/morador.service";

import SearchBox from "@/components/search";
import Dropdown from "@/components/dropdown";
import ConfirmDialog from "@/components/confirmDialog";
import EditMoradorModal from "@/components/editMoradorModal";
import CreateMoradorModal from "@/components/createMoradorModal";
import { useToast } from "@/components/toastNotification";
import { Plus, Filter } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";

/* =========================
   Tipagem local (CORRETO)
========================= */
interface IMorador {
  id_morador: string;
  nome_morador: string;
  email_morador?: string | null;
  telefone_morador?: string | null;
  bloco?: string | null;
  unidade?: string | null;
  status_morador?: string | null;
  condominio: {
    id_condominio: number;
    nome_condominio: string;
  };
}

export default function ListaMoradores() {
  const [moradores, setMoradores] = useState<IMorador[]>([]);
  const [filtered, setFiltered] = useState<IMorador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<IMorador | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<IMorador | null>(null);

  const [createOpen, setCreateOpen] = useState(false);

  const { showToast } = useToast();

  /* =========================
     Fetch
  ========================= */
  const fetchMoradores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMoradores();
      setMoradores(data);
      setFiltered(data);
    } catch (err: any) {
      const errorMsg = err.message || "Erro ao carregar moradores.";
      setError(errorMsg);
      showToast({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoradores();
  }, []);

  /* =========================
     Actions
  ========================= */
  function handleEdit(item: IMorador) {
    setEditItem(item);
    setEditOpen(true);
  }

  function handleAskDelete(item: IMorador) {
    setSelected(item);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    setIsDeleting(true);

    try {
      await deleteMorador(selected.id_morador);
      showToast({ type: "success", message: "Morador excluído com sucesso" });
      await fetchMoradores();
    } catch (e: any) {
      showToast({
        type: "error",
        message: e?.message ?? "Não foi possível excluir o morador.",
      });
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setSelected(null);
    }
  }

  async function handleSaveFromModal(updates: {
    nome_morador: string;
    email_morador?: string | null;
    telefone_morador?: string | null;
    bloco?: string | null;
    unidade?: string | null;
    status_morador?: string | null;
  }) {
    if (!editItem) return;

    try {
      await updateMorador(editItem.id_morador, updates);
      showToast({ type: "success", message: "Morador atualizado com sucesso" });
      setEditOpen(false);
      setEditItem(null);
      await fetchMoradores();
    } catch (e: any) {
      showToast({
        type: "error",
        message: e?.message ?? "Falha ao salvar alterações.",
      });
      throw e;
    }
  }

  async function handleCreateFromModal(payload: {
    nome_morador: string;
    email_morador?: string | null;
    telefone_morador?: string | null;
    bloco?: string | null;
    unidade?: string | null;
    status_morador?: string | null;
    id_condominio: number;
  }) {
    try {
      await createMorador(payload);
      showToast({ type: "success", message: "Morador criado com sucesso" });
      setCreateOpen(false);
      await fetchMoradores();
    } catch (e: any) {
      showToast({
        type: "error",
        message: e?.message ?? "Falha ao criar morador.",
      });
      throw e;
    }
  }

  /* =========================
     Render
  ========================= */
  return (
    <div>
      <PageHeader
        title="Moradores"
        description="Gerencie os moradores vinculados aos condomínios"
        action={
          <Button
            onClick={() => setCreateOpen(true)}
            icon={<Plus className="w-5 h-5" />}
            className="whitespace-nowrap"
          >
            Novo Morador
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBox
            condominios={moradores}
            search={search}
            setSearch={setSearch}
            setFiltered={setFiltered}
            placeholder="Pesquisar por nome, condomínio, bloco ou unidade..."
          />
        </div>
        <Button variant="secondary" icon={<Filter className="w-5 h-5" />}>
          Filtrar
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Carregando moradores..." />
      ) : error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 px-6 py-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchMoradores}
            className="mt-2 text-red-700 font-medium hover:text-red-800"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          title={search ? "Nenhum morador encontrado" : "Nenhum morador cadastrado"}
          description={
            search
              ? "Tente ajustar sua busca"
              : "Comece cadastrando um novo morador"
          }
          action={
            !search && (
              <Button onClick={() => setCreateOpen(true)}>
                Criar Primeiro Morador
              </Button>
            )
          }
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow isHoverable={false}>
              <TableCell isHeader>#</TableCell>
              <TableCell isHeader>Morador</TableCell>
              <TableCell isHeader>Condomínio</TableCell>
              <TableCell isHeader>Bloco</TableCell>
              <TableCell isHeader>Unidade</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item, index) => (
              <TableRow key={item.id_morador}>
                <TableCell className="text-gray-500 font-medium w-12">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {item.nome_morador}
                </TableCell>
                <TableCell>{item.condominio?.nome_condominio}</TableCell>
                <TableCell>{item.bloco || "-"}</TableCell>
                <TableCell>{item.unidade || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status_morador === "ativo" ? "success" : "default"
                    }
                  >
                    {item.status_morador ?? "ativo"}
                  </Badge>
                </TableCell>
                <TableCell align="right">
                  <Dropdown
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleAskDelete(item)}
                    align="right"
                    labels={{ edit: "Editar", remove: "Excluir" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modais */}
      <EditMoradorModal
        open={editOpen}
        data={editItem}
        onClose={() => {
          setEditOpen(false);
          setEditItem(null);
        }}
        onSave={handleSaveFromModal}
      />

      <CreateMoradorModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreateFromModal}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir morador"
        description={
          selected && (
            <p>
              Tem certeza que deseja excluir o morador{" "}
              <b className="text-blue-600">{selected.nome_morador}</b>?
            </p>
          )
        }
        confirmLabel={isDeleting ? "Excluindo..." : "Excluir"}
        cancelLabel="Cancelar"
        confirmDisabled={isDeleting}
        onCancel={() => {
          setConfirmOpen(false);
          setSelected(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
