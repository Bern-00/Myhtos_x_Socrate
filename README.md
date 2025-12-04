# MythosAI - Ayiti AI Hackathon 2025

**MythosAI** est une plateforme éducative et créative qui permet à chacun de créer, vivre et apprendre à travers des histoires interactives et des leçons générées par l'intelligence artificielle (Google Gemini).

## Fonctionnalités

*   **Leçons adaptatives** : Explication de concepts (maths, histoire, sciences) adaptée à l'âge (Enfant, Ado, Adulte).
*   **Mode Culturel Haïtien** : Intégration de références locales, folklore et proverbes.
*   **Multimodal** : Génération de texte, d'images (Gemini Image) et d'audio (Gemini TTS).
*   **Historique Local** : Sauvegarde automatique des dernières créations.
*   **Thème Sombre/Clair** : Interface adaptée à vos préférences.

## Installation

1.  Cloner le dépôt :
    ```bash
    git clone https://github.com/votre-username/mythos-ai.git
    cd mythos-ai
    ```

2.  Installer les dépendances :
    ```bash
    npm install
    ```

3.  Configurer la clé API :
    *   Créez un fichier `.env` à la racine.
    *   Ajoutez votre clé Google Gemini :
        ```
        API_KEY=votre_cle_api_ici
        ```
    *   *Note: Dans cet environnement de démo web, la clé est injectée automatiquement.*

4.  Lancer le projet :
    ```bash
    npm run dev
    ```

## 🚀 Publication sur GitHub

Pour envoyer ce projet sur votre compte GitHub :

1.  Initialiser Git localement :
    ```bash
    git init
    ```
2.  Ajouter tous les fichiers :
    ```bash
    git add .
    ```
3.  Faire le premier commit :
    ```bash
    git commit -m "Version Initiale Hackathon"
    ```
4.  Aller sur [GitHub.com](https://github.com/new) et créer un nouveau dépôt (repository).
5.  Lier le dépôt local au distant (remplacez l'URL par la vôtre) et envoyer :
    ```bash
    git branch -M main
    git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/mythos-ai.git
    git push -u origin main
    ```

## Stack Technique

*   React + TypeScript
*   Vite
*   Tailwind CSS
*   Google Gemini API (Flash 2.5, Pro 3, TTS)
*   Pixazo / Open-Sora (Génération Vidéo)

## Équipe

**B.A BA-Tech**