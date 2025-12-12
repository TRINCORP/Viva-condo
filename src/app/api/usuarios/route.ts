import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("usuarios")
      .select("id_usuario, nome_usuario, email_usuario, empresa_usuario, role_usuario, id_administradora, id_condominio, created_at")
      .order("created_at", { ascending: true });

    if (error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, count: data?.length ?? 0, data: data ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message ?? "Erro inesperado" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { nome_usuario, email_usuario, empresa_usuario, role_usuario, id_administradora, id_condominio } = body ?? {};

    if (!nome_usuario || typeof nome_usuario !== "string")
      return NextResponse.json({ success: false, error: "Campo 'nome_usuario' é obrigatório." }, { status: 400 });

    const supabase = await createClient();

    const payload: any = { nome_usuario };
    if (email_usuario !== undefined) payload.email_usuario = email_usuario;
    if (empresa_usuario !== undefined) payload.empresa_usuario = empresa_usuario;
    if (role_usuario !== undefined) payload.role_usuario = role_usuario;
    if (id_administradora !== undefined) payload.id_administradora = id_administradora;
    if (id_condominio !== undefined) payload.id_condominio = id_condominio;

    const { data, error } = await supabase
      .from("usuarios")
      .insert(payload)
      .select("id_usuario");

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data: data ?? [] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message ?? "Erro ao criar usuário." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, updates } = await req.json().catch(() => ({}));
    if (!id) return NextResponse.json({ success: false, error: "Campo 'id' é obrigatório." }, { status: 400 });
    if (!updates || typeof updates !== "object") return NextResponse.json({ success: false, error: "Campo 'updates' inválido." }, { status: 400 });

    const allowed = ["nome_usuario", "email_usuario", "empresa_usuario", "role_usuario", "id_administradora", "id_condominio"] as const;
    const safeUpdates: Record<string, any> = {};
    for (const k of allowed) if (k in updates) safeUpdates[k] = updates[k];

    if (Object.keys(safeUpdates).length === 0) return NextResponse.json({ success: false, error: "Nenhum campo permitido para atualizar." }, { status: 400 });

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("usuarios")
      .update(safeUpdates)
      .eq("id_usuario", id)
      .select("id_usuario");

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    if (!data || data.length === 0) return NextResponse.json({ success: false, error: "Usuário não encontrado." }, { status: 404 });

    return NextResponse.json({ success: true, id, message: "Usuário atualizado com sucesso." }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message ?? "Erro interno ao atualizar." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id } = body ?? {};
    if (!id) return NextResponse.json({ success: false, error: "Campo 'id' é obrigatório." }, { status: 400 });

    const supabase = await createClient();

    const { data, error } = await supabase.from("usuarios").delete().eq("id_usuario", id).select("id_usuario");

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    if (!data || data.length === 0) return NextResponse.json({ success: false, error: "Usuário não encontrado." }, { status: 404 });

    return NextResponse.json({ success: true, id, message: "Usuário excluído com sucesso." }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message ?? "Erro ao excluir." }, { status: 500 });
  }
}
