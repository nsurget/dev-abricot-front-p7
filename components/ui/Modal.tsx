"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Composant de base réutilisable pour les fenêtres modales.
 * Il gère l'overlay sombre et le centrage du contenu.
 */
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  // Gérer le montage pour les animations et le scroll du body
  useEffect(() => {
    if (isOpen) {
      // Un court délai pour s'assurer que le DOM est prêt pour la transition
      const timer = setTimeout(() => setMounted(true), 10);
      document.body.style.overflow = "hidden";
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
        setMounted(false);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay sombre en arrière-plan */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`} 
        onClick={onClose}
      />
      
      {/* Conteneur de la modale */}
      <div className={`
        relative bg-white shadow-2xl overflow-y-auto transition-all duration-300 ease-in-out
        md:rounded-[10px] md:w-full md:max-w-[690px] md:max-h-[95vh] md:m-4
        ${mounted ? "md:opacity-100 md:scale-100" : "md:opacity-0 md:scale-95"}
        max-md:fixed max-md:top-0 max-md:right-0 max-md:h-full max-md:w-full max-md:rounded-none
        ${mounted ? "max-md:translate-x-0" : "max-md:translate-x-full"}
      `}>
        {children}
      </div>
    </div>
  );
}
