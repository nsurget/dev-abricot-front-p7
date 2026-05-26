"use client";

import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Composant de base réutilisable pour les fenêtres modales.
 * Il gère l'overlay sombre, le centrage du contenu et l'accessibilité (WCAG AA).
 */
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Gérer le montage pour les animations et le scroll du body
  useEffect(() => {
    if (isOpen) {
      // Sauvegarder l'élément actif précédent pour restaurer le focus plus tard
      if (typeof document !== "undefined") {
        previousActiveElementRef.current = document.activeElement as HTMLElement;
      }

      // Un court délai pour s'assurer que le DOM est prêt pour la transition
      const timer = setTimeout(() => {
        setMounted(true);
        // Mettre le focus sur le premier élément focusable ou le conteneur lui-même
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 50);

      document.body.style.overflow = "hidden";

      // Écouteur pour fermer la modale avec Échap et gérer le focus trap
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }

        if (e.key === "Tab" && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
        setMounted(false);
        // Restaurer le focus sur l'élément d'origine
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

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
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`
          relative bg-white shadow-2xl overflow-y-auto transition-all duration-300 ease-in-out outline-none
          md:rounded-[10px] md:w-full md:max-w-[690px] md:max-h-[95vh] md:m-4
          ${mounted ? "md:opacity-100 md:scale-100" : "md:opacity-0 md:scale-95"}
          max-md:fixed max-md:top-0 max-md:right-0 max-md:h-full max-md:w-full max-md:rounded-none
          ${mounted ? "max-md:translate-x-0" : "max-md:translate-x-full"}
        `}
      >
        {children}
      </div>
    </div>
  );
}
