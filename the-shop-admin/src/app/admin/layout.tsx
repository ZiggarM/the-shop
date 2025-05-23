import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RenderMounted } from "@/components/render-mounted";
import { ADMIN } from "@/constants/constants";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();

  if (authData?.user) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (error || !data) {
      console.log("Error fetching user data", error);
    }

    if (data?.type === ADMIN) return redirect("/");
  }
  // TODO check if the user is authenticated and if he is admin
  return (
    <RenderMounted>
      <Header />
      <main className="min-h-[calc(100vh-128px)] py-3">{children}</main>
      <Footer />
    </RenderMounted>
  );
}
