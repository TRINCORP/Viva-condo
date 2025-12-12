import { createClient } from "@/utils/supabase/client";

/**
 * Busca todos os moradores com o respectivo condomínio
 */
export async function getMoradores() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("moradores")
    .select(`
      id_morador,
      nome_morador,
      email_morador,
      telefone_morador,
      bloco,
      unidade,
      status_morador,
      condominio (
        id_condominio,
        nome_condominio
      )
    `)
    .order("nome_morador", { ascending: true });

  if (error) {
    console.error("Erro ao carregar moradores:", error);
    throw new Error("Erro ao carregar moradores");
  }

  return data ?? [];
}

/**
 * Cria um novo morador
 */
export async function createMorador(payload: {
  nome_morador: string;
  email_morador?: string | null;
  telefone_morador?: string | null;
  bloco?: string | null;
  unidade?: string | null;
  status_morador?: string | null;
  id_condominio: number;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .from("moradores")
    .insert(payload);

  if (error) {
    console.error("Erro ao criar morador:", error);
    throw new Error("Erro ao criar morador");
  }

  return true;
}

/**
 * Atualiza um morador existente
 */
export async function updateMorador(
  id_morador: string,
  updates: {
    nome_morador: string;
    email_morador?: string | null;
    telefone_morador?: string | null;
    bloco?: string | null;
    unidade?: string | null;
    status_morador?: string | null;
  }
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("moradores")
    .update(updates)
    .eq("id_morador", id_morador);

  if (error) {
    console.error("Erro ao atualizar morador:", error);
    throw new Error("Erro ao atualizar morador");
  }

  return true;
}

/**
 * Exclui um morador pelo ID
 */
export async function deleteMorador(id_morador: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("moradores")
    .delete()
    .eq("id_morador", id_morador);

  if (error) {
    console.error("Erro ao excluir morador:", error);
    throw new Error("Erro ao excluir morador");
  }

  return true;
}
