"use client";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { Home } from "lucide-react";

export default function ListaMoradores() {
  return (
    <div>
      <PageHeader
        title="Moradores"
        description="Gerencie todos os moradores dos condomínios"
        action={
          <Button icon={<Plus className="w-5 h-5" />}>
            Novo Morador
          </Button>
        }
      />

      <EmptyState
        icon={<Home className="w-16 h-16 text-gray-300" />}
        title="Nenhum morador cadastrado"
        description="Cadastre condomínios primeiro e depois adicione moradores às unidades."
        action={
          <Button icon={<Plus className="w-5 h-5" />}>
            Adicionar Primeiro Morador
          </Button>
        }
      />
    </div>
  );
}
