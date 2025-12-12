import PageHeader from "@/components/ui/PageHeader";
import { createClient } from "@/utils/supabase/server";
import UsuariosClient from "@/components/UsuariosClient";

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
      id_condominio,
      created_at
    `)
    .order("created_at", { ascending: true });

  if (error) console.error("Erro ao buscar usuários:", error);

  const usuarios: Usuario[] = (data ?? []) as Usuario[];

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie todos os usuários da administradora e dos condomínios"
        action={null}
      />

      <UsuariosClient initialUsers={usuarios} />
    </div>
  );
}
