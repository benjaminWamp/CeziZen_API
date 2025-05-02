export interface StepTemplate {
  title: string;
  description: string;
}

export function generateStepTemplates(): StepTemplate[] {
  const templates: StepTemplate[] = [];

  for (let i = 1; i <= 10; i++) {
    templates.push({
      title: `Étape modèle ${i}`,
      description: `Ceci est la description de l'étape modèle ${i}`,
    });
  }

  return templates;
}
