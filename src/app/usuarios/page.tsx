"use client";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

export default function ListaUsuarios() {
  return (
    <div className="pt-20 lg:pt-0">
      <PageHeader
        title="Usuários"
        description="Gerencie todos os usuários do sistema"
        action={
          <Button icon={<Plus className="w-5 h-5" />}>
            Novo Usuário
          </Button>
        }
      />

      <EmptyState
        icon={<Users className="w-16 h-16 text-gray-300" />}
        title="Nenhum usuário cadastrado"
        description="Comece adicionando um novo usuário ao sistema para gerenciar condomínios e moradores."
        action={
          <Button icon={<Plus className="w-5 h-5" />}>
            Adicionar Primeiro Usuário
          </Button>
        }
      />
    </div>
  );
}
