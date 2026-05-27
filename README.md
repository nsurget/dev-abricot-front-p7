# 🍑 Abricot.co — SaaS de Gestion de Projet pour Freelances

[![Production](https://img.shields.io/badge/Production-Live%20Demo-orange?style=for-the-badge&logo=vercel)](https://dev-abricot-front-p7.vercel.app)
[![OpenClassrooms](https://img.shields.io/badge/OpenClassrooms-Projet%207-blue?style=for-the-badge)](https://openclassrooms.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)

Bienvenue sur mon dépôt du front-end d'**Abricot**, le SaaS de gestion de projet pour freelances.

Ce projet a été réalisé par **Nicolas Surget** dans le cadre de ma formation de Développeur Full Stack sur **OpenClassrooms** (Projet 7).

---

## 🎨 Fonctionnalités d'Abricot

* **Tableau de Bord :** Visualisation globale des tâches assignées, de l'avancement des projets et des priorités.
* **Gestion des Projets & Tâches :** Création, modification, catégorisation par statut (`À faire`, `En cours`, `Terminé`) et par niveau de priorité (`Basse`, `Moyenne`, `Haute`, `Urgent`).
* **Attribution des Tâches :** Possibilité d'assigner des tâches à des membres spécifiques du projet.
* **Génération de Tâches par IA (Local) :** Module d'IA intégré pour décomposer un objectif complexe en une liste de sous-tâches éditables avant validation.
* **Authentification Sécurisée :** Gestion des sessions utilisateurs (inscription, connexion, déconnexion) notamment via un système de proxy (Next.js)

---

## 🛠️ Stack Technique

* **Framework :** [Next.js 16.2.0](https://nextjs.org/) (App Router)
* **Bibliothèque :** [React 19.2.4](https://react.dev/)
* **Langage :** [TypeScript](https://www.typescriptlang.org/)
* **Styles :** [Tailwind CSS v4](https://tailwindcss.com/) & CSS Vanilla
* **Gestion d'État :** [Zustand](https://github.com/pmndrs/zustand)
* **Formulaires :** [React Hook Form](https://react-hook-form.com/)
* **Requêtes HTTP :** [Axios](https://axios-http.com/)

---

## 💻 Installation et Lancement en Local

Pour faire fonctionner l'application en local, vous devez démarrer le serveur back-end ainsi que ce serveur front-end.

### 🖥️ 1. Lancer le serveur Back-end
Le back-end fournit l'API essentielle à la gestion des tâches.
* **Dépôt GitHub Back-end :** [https://github.com/nsurget/dev-abricot-back-p7](https://github.com/nsurget/dev-abricot-back-p7)
* Suivez les instructions du `README` du dépôt back-end pour l'installer et le démarrer (par défaut sur `http://localhost:8000`).

### 🎨 2. Lancer le serveur Front-end (ce dépôt)

#### A. Cloner le dépôt
```bash
git clone https://github.com/nsurget/dev-abricot-front-p7.git
cd dev-abricot-front-p7
```

#### B. Installer les dépendances
```bash
npm install
```

#### C. Configurer l'environnement (`.env.local`)
Créez un fichier `.env.local` à la racine et renseignez vos clés de configuration :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
GEMINI_API_KEY=votre_cle_gemini
```

#### D. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur [http://localhost:3000](http://localhost:3000) ou votre adresse locale.

---

## 💡 Note Importante — Fonctionnalité IA

> [!WARNING]
> **Désactivation de l'IA en Production**
> La fonctionnalité de génération de tâches assistée par l'Intelligence Artificielle **n'est pas active sur la version en ligne**. 
> 
> * **Pourquoi ?** L'application en production est accessible publiquement sur Internet et la création de compte y est ouverte à tous sans restriction. Activer l'API d'IA en production exposerait à une consommation abusive.
