import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProjectModal from "@/components/project/ProjectModal";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#F9FAFB]">
        {children}
      </main>
      <Footer />
      
      {/* Modale globale de projet */}
      <ProjectModal />
    </div>
  );
}
