"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Home } from "lucide-react";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { getCondominios } from "@/services/condominio.service";
import { getUsuarios } from "@/services/usuario.service";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Busca dados do Supabase via services
        const condominios = await getCondominios();
        const usuarios = await getUsuarios();

        setStats([
          {
            title: "Total de Condomínios",
            value: condominios.length,
            icon: <Building2 className="w-6 h-6" />,
            color: "bg-blue-50 text-blue-600 border-blue-200",
            description: "Condomínios cadastrados",
          },
          {
            title: "Usuários do Sistema",
            value: usuarios.length,
            icon: <Users className="w-6 h-6" />,
            color: "bg-purple-50 text-purple-600 border-purple-200",
            description: "Gerenciadores cadastrados",
          },
          {
            title: "Unidades Totais",
            value: "---",
            icon: <Home className="w-6 h-6" />,
            color: "bg-orange-50 text-orange-600 border-orange-200",
            description: "Unidades nos condomínios",
          },
        ]);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Carregando dashboard..." />;
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral do sistema de gestão condominial"
      />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardBody className="flex flex-col">
              <div
                className={`inline-flex w-12 h-12 items-center justify-center rounded-lg mb-4 ${stat.color}`}
              >
                {stat.icon}
              </div>

              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </h3>

              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>

              {stat.description && (
                <p className="text-xs text-gray-500">{stat.description}</p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* CONTENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Atividade Recente
            </h2>
          </CardHeader>

          <CardBody>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Condomínio atualizado
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Há alguns minutos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Ações Rápidas
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              + Novo Condomínio
            </button>

            <button className="w-full px-4 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              + Novo Usuário
            </button>

            <button className="w-full px-4 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Ver Relatórios
            </button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
