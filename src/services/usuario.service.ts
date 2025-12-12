import { createClient } from "@/utils/supabase/client";

export async function getUsuarios() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("usuarios")
    .select("*");

  if (error) {
    console.error("Erro ao carregar usuários:", error);
    return [];
  }

  return data ?? [];
}
