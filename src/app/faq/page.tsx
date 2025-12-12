"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "O que é o Viva-Condo?",
    answer:
      "O Viva-Condo é uma plataforma de gestão condominial desenvolvida para centralizar o controle de condomínios, usuários administrativos e moradores em um único ambiente seguro e organizado.",
  },
  {
    question: "Quem pode utilizar o sistema?",
    answer:
      "O sistema é voltado para administradoras de condomínios, síndicos, gestores, usuários administrativos e moradores vinculados aos condomínios.",
  },
  {
    question: "Qual a diferença entre Usuários e Moradores?",
    answer:
      "Usuários possuem acesso administrativo ao sistema, enquanto moradores representam os residentes vinculados a um condomínio, bloco e unidade específica.",
  },
  {
    question: "Como os moradores são vinculados aos condomínios?",
    answer:
      "Cada morador é cadastrado com vínculo direto a um condomínio existente, incluindo informações como bloco, unidade e status, garantindo organização e controle.",
  },
  {
    question: "É possível cadastrar vários condomínios?",
    answer:
      "Sim. O Viva-Condo permite o cadastro de múltiplos condomínios, cada um associado a uma administradora.",
  },
  {
    question: "O sistema possui controle de permissões?",
    answer:
      "Atualmente, o sistema trabalha com perfis de usuário definidos por função. A arquitetura já está preparada para evoluções futuras com permissões mais granulares.",
  },
  {
    question: "Os dados são armazenados de forma segura?",
    answer:
      "Sim. O Viva-Condo utiliza infraestrutura baseada em Supabase, com autenticação segura, controle de sessões e banco de dados relacional.",
  },
  {
    question: "Quais funcionalidades estão previstas para o futuro?",
    answer:
      "Entre as evoluções previstas estão módulos de chamados, comunicação interna, relatórios gerenciais, controle financeiro e notificações.",
  },
  {
    question: "O sistema pode ser adaptado para diferentes tipos de condomínio?",
    answer:
      "Sim. A plataforma foi desenvolvida de forma modular, permitindo adaptação para condomínios residenciais, comerciais, mistos, verticais ou horizontais.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <PageHeader
        title="Perguntas Frequentes (FAQ)"
        description="Tire suas dúvidas sobre o funcionamento do Viva-Condo"
      />

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl bg-white shadow-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
