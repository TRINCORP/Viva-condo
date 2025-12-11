import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Plus, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

type Usuario = {
  id_usuario: string;
  nome_usuario: string;
  tipo_usuario: string | null;
  id_condominio: number | null;
};

export default async function ListaUsuarios() {
  const supabase = await createClient(); // ← ESSENCIAL

  const { data, error } = await supabase
    .from("usuarios")
    .select("id_usuario, nome_usuario, tipo_usuario, id_condominio");

  if (error) console.error(error);

  const usuarios: Usuario[] = (data ?? []) as Usuario[];

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie todos os usuários do sistema"
        action={
          <Button icon={<Plus className="w-5 h-5" />}>Novo Usuário</Button>
        }
      />

      {usuarios.length === 0 ? (
        <EmptyState
          icon={<Users className="w-16 h-16 text-gray-300" />}
          title="Nenhum usuário cadastrado"
          description="Comece adicionando um novo usuário ao sistema."
          action={
            <Button icon={<Plus className="w-5 h-5" />}>
              Adicionar Primeiro Usuário
            </Button>
          }
        />
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {usuarios.map((user) => (
            <div
              key={user.id_usuario}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <h3 className="font-semibold">{user.nome_usuario}</h3>
              <p className="text-gray-600 text-sm">
                Tipo: {user.tipo_usuario || "não definido"}
              </p>
              <p className="text-gray-600 text-sm">
                Condomínio: {user.id_condominio || "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
