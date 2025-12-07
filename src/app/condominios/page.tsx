"use client";

import { useEffect, useState } from "react";
import {
  ICondominio,
  getCondominios,
  deleteCondominio,
  updateCondominio,
  createCondominio,
} from "@/services/condominio.service";

import SearchBox from "@/components/search";
import Dropdown from "@/components/dropdown";
import ConfirmDialog from "@/components/confirmDialog";
import EditCondominioModal from "@/components/editCondominioModal";
import CreateCondominioModal from "@/components/createCondominioModal";
import { useToast } from "@/components/toastNotification";
import { Plus, Filter } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";

export default function ListaCondominios() {
  const [condominio, setCondominios] = useState<ICondominio[]>([]);
  const [filtered, setFiltered] = useState<ICondominio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<ICondominio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<ICondominio | null>(null);

  const [createOpen, setCreateOpen] = useState(false);

  const { showToast } = useToast();

  const fetchCondominios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCondominios();
      setCondominios(data);
      setFiltered(data);
    } catch (err: any) {
      const errorMsg = err.message || "Erro ao carregar dados.";
      setError(errorMsg);
      showToast({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCondominios();
  }, []);

  function handleEdit(item: ICondominio) {
    setEditItem(item);
    setEditOpen(true);
  }

  function handleAskDelete(item: ICondominio) {
    setSelected(item);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    setIsDeleting(true);

    try {
      await deleteCondominio(selected.id_condominio);
      showToast({ type: "success", message: "Condomínio excluído com sucesso" });
      await fetchCondominios();
    } catch (e: any) {
      showToast({
        type: "error",
        message: e?.message ?? "Não foi possível excluir o condomínio.",
      });
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setSelected(null);
    }
  }

  async function handleSaveFromModal(updates: {
    nome_condominio: string;
    endereco_condominio: string;
    cidade_condominio: string;
    uf_condominio: string;
    tipo_condominio: string;
  }) {
    if (!editItem) return;
    try {
      await updateCondominio(editItem.id_condominio, updates);
      showToast({ type: "success", message: "Condomínio atualizado com sucesso" });
      setEditOpen(false);
      setEditItem(null);
      await fetchCondominios();
    } catch (e: any) {
      showToast({
        type: "error",
        message: e?.message ?? "Falha ao salvar alterações.",
      });
      throw e;
    }
  }

  async function handleCreateFromModal(payload: {
    nome_condominio: string;
    endereco_condominio: string;
    cidade_condominio: string;
    uf_condominio: string;
    tipo_condominio: string;
  }) {
    try {
      await createCondominio(payload);
      showToast({ type: "success", message: "Condomínio criado com sucesso" });
      setCreateOpen(false);
      await fetchCondominios();
    } catch (e: any) {
      showToast({
        type: "error",
        message: e?.message ?? "Falha ao criar condomínio.",
      });
      throw e;
    }
  }

  return (
    <div>
      <PageHeader
        title="Condomínios"
        description="Gerencie todos os condomínios registrados no sistema"
        action={
          <Button
            onClick={() => setCreateOpen(true)}
            icon={<Plus className="w-5 h-5" />}
            className="whitespace-nowrap"
          >
            Novo Condomínio
          </Button>
        }
      />

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBox
            condominios={condominio}
            search={search}
            setSearch={setSearch}
            setFiltered={setFiltered}
            placeholder="Pesquisar por nome, endereço ou cidade..."
          />
        </div>
        <Button variant="secondary" icon={<Filter className="w-5 h-5" />}>
          Filtrar
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <LoadingSpinner message="Carregando condomínios..." />
      ) : error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 px-6 py-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchCondominios}
            className="mt-2 text-red-700 font-medium hover:text-red-800 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          title={search ? "Nenhum condomínio encontrado" : "Nenhum condomínio cadastrado"}
          description={
            search
              ? "Tente ajustar sua busca"
              : "Comece criando um novo condomínio"
          }
          action={
            !search && (
              <Button onClick={() => setCreateOpen(true)}>
                Criar Primeiro Condomínio
              </Button>
            )
          }
        />
      ) : (
        /* Table */
        <Table>
          <TableHead>
            <TableRow isHoverable={false}>
              <TableCell isHeader>#</TableCell>
              <TableCell isHeader>Nome</TableCell>
              <TableCell isHeader>Endereço</TableCell>
              <TableCell isHeader>Cidade</TableCell>
              <TableCell isHeader>UF</TableCell>
              <TableCell isHeader>Tipo</TableCell>
              <TableCell isHeader align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item, index) => (
              <TableRow key={item.id_condominio}>
                <TableCell className="text-gray-500 font-medium w-12">
                  {String(index + 1)}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {item.nome_condominio}
                </TableCell>
                <TableCell>{item.endereco_condominio}</TableCell>
                <TableCell>{item.cidade_condominio}</TableCell>
                <TableCell>
                  <Badge variant="info">
                    {item.uf_condominio}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="default">
                    {item.tipo_condominio}
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

      {/* Modals */}
      <EditCondominioModal
        open={editOpen}
        data={editItem}
        onClose={() => {
          setEditOpen(false);
          setEditItem(null);
        }}
        onSave={handleSaveFromModal}
      />

      <CreateCondominioModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreateFromModal}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir condomínio"
        description={
          selected && (
            <>
              <p>
                Tem certeza de que deseja excluir o condomínio{" "}
                <b className="text-blue-600">{selected.nome_condominio}</b>?
              </p>
              <p className="text-red-600 mt-3 text-sm font-medium">
                ⚠️ Todos os moradores vinculados a este condomínio também serão
                excluídos. Esta ação não poderá ser desfeita.
              </p>
            </>
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
