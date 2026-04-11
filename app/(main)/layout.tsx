import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
