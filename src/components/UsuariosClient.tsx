"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import SearchBox from "./search";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Dropdown from "@/components/dropdown";
import CreateUsuarioModal from "./createUsuarioModal";
import EditUsuarioModal from "./editUsuarioModal";
import ConfirmDialog from "./confirmDialog";
import { useToast } from "./toastNotification";

type Usuario = {
  id_usuario: string;
  nome_usuario: string;
  email_usuario?: string | null;
  empresa_usuario?: string | null;
  role_usuario?: string | null;
  id_administradora?: number | null;
  id_condominio?: number | null;
  created_at?: string | null;
};

export default function UsuariosClient({ initialUsers }: { initialUsers: Usuario[] }) {
  const [users, setUsers] = useState<Usuario[]>(initialUsers ?? []);
  const [filtered, setFiltered] = useState<Usuario[]>(initialUsers ?? []);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<Usuario | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<Usuario | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  async function refetch() {
    setLoading(true);
    try {
      const res = await fetch("/api/usuarios");
      const json = await res.json();
      if (json?.success) setUsers(json.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // inicializa com dados do servidor atualizados
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFiltered(users);
  }, [users]);

  async function handleCreate(payload: { nome_usuario: string; email_usuario?: string | null; empresa_usuario?: string | null; role_usuario?: string | null; id_administradora?: number | null; id_condominio?: number | null; }) {
    try {
      const res = await fetch("/api/usuarios", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || "Falha ao criar usuário");
      showToast({ type: "success", message: "Usuário criado" });
      setCreateOpen(false);
      await refetch();
    } catch (e: any) {
      showToast({ type: "error", message: e?.message ?? "Erro" });
      throw e;
    }
  }

  async function handleUpdate(updates: { nome_usuario: string; email_usuario?: string | null; empresa_usuario?: string | null; role_usuario?: string | null; id_administradora?: number | null; id_condominio?: number | null; }) {
    if (!editItem) return;
    try {
      const res = await fetch("/api/usuarios", { method: "PUT", body: JSON.stringify({ id: editItem.id_usuario, updates }), headers: { "Content-Type": "application/json" } });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || "Falha ao atualizar");
      showToast({ type: "success", message: "Usuário atualizado" });
      setEditOpen(false);
      setEditItem(null);
      await refetch();
    } catch (e: any) {
      showToast({ type: "error", message: e?.message ?? "Erro" });
      throw e;
    }
  }

  async function handleAskDelete(user: Usuario) {
    setSelectedToDelete(user);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selectedToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/usuarios", { method: "DELETE", body: JSON.stringify({ id: selectedToDelete.id_usuario }), headers: { "Content-Type": "application/json" } });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || "Falha ao excluir usuário");
      showToast({ type: "success", message: "Usuário excluído" });
      await refetch();
    } catch (e: any) {
      showToast({ type: "error", message: e?.message ?? "Erro" });
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setSelectedToDelete(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start">
        <div className="flex-1">
          <SearchBox
            condominios={users as any}
            search={search}
            setSearch={setSearch}
            setFiltered={setFiltered as any}
            placeholder="Pesquisar por nome, email ou empresa..."
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setCreateOpen(true)} icon={<Plus className="w-5 h-5" />}>
            Novo Usuário
          </Button>
        </div>
      </div>

      <div className="mt-0">
        <Table>
          <TableHead>
              <TableRow isHoverable={false}>
                <TableCell isHeader>#</TableCell>
                <TableCell isHeader>Nome</TableCell>
                <TableCell isHeader>Email</TableCell>
                <TableCell isHeader>Empresa</TableCell>
                <TableCell isHeader>Função</TableCell>
                <TableCell isHeader>Administradora</TableCell>
                <TableCell isHeader>Condomínio</TableCell>
                <TableCell isHeader align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {filtered.map((u, idx) => (
              <TableRow key={u.id_usuario}>
                <TableCell className="text-gray-500 font-medium w-12">{String(idx + 1)}</TableCell>
                <TableCell className="font-medium text-gray-900">{u.nome_usuario}</TableCell>
                <TableCell>{u.email_usuario ?? "-"}</TableCell>
                <TableCell>{u.empresa_usuario ?? "-"}</TableCell>
                <TableCell>{u.role_usuario ?? "-"}</TableCell>
                <TableCell>{u.id_administradora ?? "-"}</TableCell>
                <TableCell><Badge variant="info">{u.id_condominio ?? "-"}</Badge></TableCell>
                <TableCell align="right">
                  <Dropdown
                    onEdit={() => { setEditItem(u); setEditOpen(true); }}
                    onDelete={() => handleAskDelete(u)}
                    align="right"
                    labels={{ edit: "Editar", remove: "Excluir" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateUsuarioModal open={createOpen} onClose={() => setCreateOpen(false)} onSave={handleCreate} />

      <EditUsuarioModal
        open={editOpen}
        data={editItem}
        onClose={() => { setEditOpen(false); setEditItem(null); }}
        onSave={handleUpdate}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir usuário"
        description={selectedToDelete ? (<p>Tem certeza que deseja excluir <b className="text-blue-600">{selectedToDelete.nome_usuario}</b>?</p>) : undefined}
        confirmLabel={isDeleting ? "Excluindo..." : "Excluir"}
        cancelLabel="Cancelar"
        confirmDisabled={isDeleting}
        onCancel={() => { setConfirmOpen(false); setSelectedToDelete(null); }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
