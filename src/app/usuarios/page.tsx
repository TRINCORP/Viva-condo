import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Plus, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

type Usuario = {
  id_usuario: string;
  nome_usuario: string;
  email_usuario: string | null;
  empresa_usuario: string | null;
  role_usuario: string | null;
  id_administradora: number | null;
  id_condominio: number | null;
};

export default async function ListaUsuarios() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("usuarios")
    .select(`
      id_usuario,
      nome_usuario,
      email_usuario,
      empresa_usuario,
      role_usuario,
      id_administradora,
      id_condominio
    `);

  if (error) console.error("Erro ao buscar usuários:", error);

  const usuarios: Usuario[] = (data ?? []) as Usuario[];

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie todos os usuários da administradora e dos condomínios"
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
              <h3 className="font-semibold text-lg">{user.nome_usuario}</h3>

              <p className="text-gray-600 text-sm">
                <strong>Email:</strong> {user.email_usuario || "-"}
              </p>

              <p className="text-gray-600 text-sm">
                <strong>Empresa:</strong> {user.empresa_usuario || "-"}
              </p>

              <p className="text-gray-600 text-sm">
                <strong>Função:</strong> {user.role_usuario || "não definido"}
              </p>

              <p className="text-gray-600 text-sm">
                <strong>Administradora:</strong>{" "}
                {user.id_administradora || "-"}
              </p>

              <p className="text-gray-600 text-sm">
                <strong>Condomínio:</strong> {user.id_condominio || "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
