import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProjectModal from "@/components/modal/ProjectModal";
import TaskModal from "@/components/modal/TaskModal";
import AiTaskModal from "@/components/modal/AiTaskModal";
import ToastContainer from "@/components/ui/ToastContainer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#F9FAFB]">
        <ToastContainer />
        {children}
      </main>
      <Footer />
      
      {/* Modales globales */}
      <ProjectModal />
      <TaskModal />
      <AiTaskModal />
    </div>
  );
}

