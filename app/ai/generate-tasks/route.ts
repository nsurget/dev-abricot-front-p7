import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, projectName, projectDescription } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: "La description des tâches est requise." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: "La clé API Gemini (GEMINI_API_KEY) n'est pas configurée dans le fichier .env.local du frontend." 
        },
        { status: 500 }
      );
    }

    // Context from the project
    const projectContext = projectName 
      ? `Ce projet s'intitule "${projectName}"${projectDescription ? ` et a pour description : "${projectDescription}"` : ''}. `
      : '';

    const systemInstruction = `Vous êtes un assistant IA de gestion de projet.
Voici le context du projet sur lequel vous devez vous baser pour générer des tâches:
${projectContext}
Analysez la demande de l'utilisateur pour extraire ou suggérer une liste de tâches structurées.

Format de retour attendu :
Vous devez renvoyer UNIQUEMENT un tableau JSON (sans clé racine, pas d'objet englobant) contenant des objets avec cette structure exacte :
[
  {
    "title": "Titre clair et concis de la tâche (ex: Créer le wireframe de la page d'accueil)",
    "description": "Description détaillée de ce qui doit être accompli pour cette tâche",
    "dueDate": "YYYY-MM-DD" (suggérez une date d'échéance logique en fonction du jour actuel ou de la description),
    "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT" (suggérez une priorité pertinente, par défaut "MEDIUM"),
    "status": "TODO" | "IN_PROGRESS" | "DONE" (par défaut "TODO")
  }
]

La date d'aujourd'hui est le ${new Date().toISOString().split('T')[0]}

Règles importantes :
- Le résultat doit être un tableau JSON valide.
- Ne pas inclure de texte d'explication, ni de balises de code Markdown (comme \`\`\`json).
- Générez au moins 1 tâche et au maximum 8 tâches en fonction de la demande de l'utilisateur ou la complexité de la description de l'utilisateur.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemInstruction}\n\nDemande de l'utilisateur : "${prompt}"`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Response:", errorText);
      return NextResponse.json(
        { success: false, error: `Erreur de l'API Gemini : ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return NextResponse.json(
        { success: false, error: "L'API Gemini n'a renvoyé aucune réponse." },
        { status: 500 }
      );
    }

    let parsedTasks;
    try {
      let trimmedText = responseText.trim();
      // Enlever d'éventuels backticks markdown résiduels
      if (trimmedText.startsWith("```")) {
        trimmedText = trimmedText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      parsedTasks = JSON.parse(trimmedText);
    } catch (e) {
      console.error("Failed to parse Gemini JSON output:", responseText, e);
      return NextResponse.json(
        { success: false, error: "La réponse de l'IA n'a pas pu être convertie en JSON valide." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, tasks: parsedTasks });
  } catch (error: any) {
    console.error("Internal Server Error in generate-tasks route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
