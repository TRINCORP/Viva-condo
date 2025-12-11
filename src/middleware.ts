import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  console.log("🔥 MIDDLEWARE EXECUTOU para:", req.nextUrl.pathname);

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("👤 USER NO MIDDLEWARE:", user?.email ?? "nenhum");

  const protectedRoutes = [
    "/dashboard",
    "/condominios",
    "/usuarios",
    "/moradores",
    "/configuracoes",
  ];

  const pathname = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  if (isProtected && !user) {
    console.log("⛔ BLOQUEADO — usuário não logado!");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)"],
};
