"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.replace("/dashboard");
        return;
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("E-mail ou senha inválidos.");
      setSubmitting(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  if (checkingSession) return null;

  return (
    <div className="h-screen w-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2">

      {/* LADO ESQUERDO – Imagem Premium */}
      <div className="hidden lg:block relative h-full">
        <Image
          src="/fundo_login.png"
          alt="Condomínio Premium"
          fill
          className="object-cover brightness-75"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

        <div className="absolute bottom-10 left-10 text-white select-none">
          <h1 className="text-4xl font-bold drop-shadow-lg">VivaCondo</h1>
          <p className="text-lg opacity-90 mt-2">
            Gestão inteligente e moderna para administradoras e condomínios.
          </p>
        </div>
      </div>

      {/* LADO DIREITO – SEM SCROLL */}
      <div className="flex justify-center items-center h-full">

        <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">

          {/* LOGO */}
          <div className="text-center mb-6">
            <Image
              src="/Logo_viva_condo.png"
              alt="Logo VivaCondo"
              width={180}
              height={60}
              className="mx-auto"
            />
          </div>

          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Bem-vindo de volta
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="text-gray-700 text-sm font-medium">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? "Entrando..." : "Entrar"}
            </button>

            {errorMsg && (
              <p className="text-center text-red-600 text-sm mt-3 font-medium">
                {errorMsg}
              </p>
            )}
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm select-none">
            © {new Date().getFullYear()} VivaCondo — Todos os direitos reservados.
          </p>
        </div>

      </div>
    </div>
  );
}
