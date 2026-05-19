export interface IFSChapterDef {
  id: string;
  label: string;
  chapterCodes: string;
  defaultDuration: number;
  category: string;
}

export interface IFSScheduleDay {
  day: number;
  activities: {
    type: 'fixed' | 'chapter';
    time: string;
    chapterIds?: string[];
    label: string;
    description: string;
    isOnSite?: boolean;
    duration?: number;
  }[];
}

export const IFS_CHAPTERS: IFSChapterDef[] = [
  { id: 'gouvernance', label: 'Gouvernance et Engagement', chapterCodes: '1.1, 1.2, 1.3, 5.11', defaultDuration: 45, category: 'Management' },
  { id: 'haccp', label: 'HACCP', chapterCodes: '2.2, 4.12, 4.9.10, 4.19', defaultDuration: 60, category: 'HACCP' },
  { id: 'specifications', label: 'Spécifications client', chapterCodes: '4.1, 4.2', defaultDuration: 30, category: 'Process' },
  { id: 'tracabilite', label: 'Traçabilité générale', chapterCodes: '4.18', defaultDuration: 60, category: 'Traceability' },
  { id: 'achats', label: 'Achats', chapterCodes: '4.4, 4.5, 4.19', defaultDuration: 60, category: 'Process' },
  { id: 'fraude', label: 'Fraude alimentaire', chapterCodes: '4.20', defaultDuration: 45, category: 'Food Safety' },
  { id: 'evaluation1', label: 'Évaluation sur site: réception au chargement', chapterCodes: '4.8, 3.4, 3.2, 4.14, 4.9, 4.18.5', defaultDuration: 180, category: 'Site' },
  { id: 'evaluation2', label: 'Évaluation sur site (suite)', chapterCodes: '2.3.9.1, 4.12, 5.5, 4.10, 4.3, 4.13', defaultDuration: 240, category: 'Site' },
  { id: 'evaluation3', label: 'Évaluation sur site (suite)', chapterCodes: '4.16, 4.9.10, 4.17, 5.3', defaultDuration: 60, category: 'Site' },
  { id: 'evaluation4', label: 'Évaluation sur site (suite)', chapterCodes: '2.3.9.1, 4.5, 4.6, 4.7, 4.21', defaultDuration: 240, category: 'Site' },
  { id: 'etalonnage', label: 'Étalonnage', chapterCodes: '5.4', defaultDuration: 30, category: 'Quality' },
  { id: 'hygiene', label: 'Gestion de l\'hygiène', chapterCodes: '4.11, 4.13, 4.10, 3.2, 3.4', defaultDuration: 45, category: 'Site' },
  { id: 'mesures', label: 'Mesures et analyse', chapterCodes: '5.6, 5.7, 5.10, 5.11', defaultDuration: 45, category: 'Quality' },
  { id: 'management', label: 'Management du système qualité', chapterCodes: '5.1, 5.2, 5.8, 5.9', defaultDuration: 60, category: 'Quality' },
  { id: 'ressources', label: 'Gestion des ressources', chapterCodes: '3.1, 3.3', defaultDuration: 60, category: 'Resources' },
  { id: 'developpement', label: 'Développement / Procédés', chapterCodes: '4.3', defaultDuration: 60, category: 'Process' },
  { id: 'protection', label: 'Protection actes malveillants', chapterCodes: '4.21', defaultDuration: 45, category: 'Food Safety' },
  { id: 'transport', label: 'Transport', chapterCodes: '4.15', defaultDuration: 15, category: 'Process' },
  { id: 'qualite', label: 'Management de la qualité', chapterCodes: '2.1', defaultDuration: 15, category: 'Management' },
];

export function getDefaultIFSSchedule(durationDays: number, isAnnounced: boolean): IFSScheduleDay[] {
  const base: IFSScheduleDay[] = [
    {
      day: 1,
      activities: [
        { type: 'fixed', time: '08h15', label: 'Arrivée sur le site', description: 'Arrivée sur le site' },
        { type: 'fixed', time: '08h30', label: "Réunion d'ouverture", description: "RÉUNION D'OUVERTURE" },
        { type: 'chapter', time: '08h45', chapterIds: ['gouvernance'], label: 'Gouvernance et Engagement', description: 'Gouvernance et Engagement', isOnSite: false, duration: 45 },
        { type: 'chapter', time: '09h30', chapterIds: ['evaluation1'], label: 'Évaluation sur site: réception', description: 'Évaluation sur site: réception au chargement', isOnSite: true, duration: 180 },
        { type: 'fixed', time: '12h30', label: 'Repas', description: 'Repas rapide' },
        { type: 'chapter', time: '13h30', chapterIds: ['haccp'], label: 'HACCP', description: 'HACCP, Allergènes, Corps étrangers', isOnSite: true, duration: 60 },
        { type: 'chapter', time: '14h30', chapterIds: ['specifications'], label: 'Spécifications client', description: 'Spécifications client', isOnSite: true, duration: 30 },
        { type: 'chapter', time: '15h00', chapterIds: ['tracabilite'], label: 'Traçabilité générale', description: 'Traçabilité générale', isOnSite: true, duration: 60 },
        { type: 'chapter', time: '16h00', chapterIds: ['achats'], label: 'Achats', description: 'Achats / Sourcing', isOnSite: true, duration: 60 },
        { type: 'chapter', time: '17h00', chapterIds: ['fraude'], label: 'Fraude alimentaire', description: 'Fraude alimentaire', isOnSite: true, duration: 30 },
        { type: 'fixed', time: '17h30', label: 'Fin de la première journée', description: 'Fin de la première journée' },
      ],
    },
    {
      day: 2,
      activities: [
        { type: 'fixed', time: '08h15', label: 'Arrivée', description: 'Deuxième journée: Arrivée sur le site' },
        { type: 'chapter', time: '08h30', chapterIds: ['evaluation2'], label: 'Évaluation sur site (suite)', description: 'Évaluation sur site (suite)', isOnSite: true, duration: 240 },
        { type: 'fixed', time: '12h30', label: 'Repas', description: 'Repas rapide' },
        { type: 'chapter', time: '13h30', chapterIds: ['evaluation3'], label: 'Évaluation sur site (suite)', description: 'Évaluation sur site (suite)', isOnSite: true, duration: 60 },
        { type: 'chapter', time: '14h30', chapterIds: ['etalonnage'], label: 'Étalonnage', description: 'Étalonnage', isOnSite: true, duration: 30 },
        { type: 'chapter', time: '15h00', chapterIds: ['hygiene'], label: "Gestion de l'hygiène", description: "Gestion de l'hygiène, Déchets, Nuisibles", isOnSite: true, duration: 45 },
        { type: 'chapter', time: '15h45', chapterIds: ['mesures'], label: 'Mesures et analyse', description: 'Mesures et analyse, Réclamations, NC', isOnSite: true, duration: 45 },
        { type: 'chapter', time: '16h30', chapterIds: ['management'], label: 'Management qualité', description: 'Management du système de la qualité', isOnSite: true, duration: 60 },
        { type: 'fixed', time: '17h30', label: 'Fin de la deuxième journée', description: 'Fin de la deuxième journée' },
      ],
    },
    {
      day: 3,
      activities: [
        { type: 'fixed', time: '08h15', label: 'Arrivée', description: 'Troisième journée: Arrivée sur le site' },
        { type: 'chapter', time: '08h30', chapterIds: ['evaluation4'], label: 'Évaluation sur site (suite)', description: 'Évaluation sur site (suite)', isOnSite: true, duration: 240 },
        { type: 'fixed', time: '12h30', label: 'Repas', description: 'Repas rapide' },
        { type: 'chapter', time: '13h30', chapterIds: ['ressources'], label: 'Gestion des ressources', description: 'Gestion des ressources', isOnSite: true, duration: 60 },
        { type: 'chapter', time: '14h30', chapterIds: ['developpement'], label: 'Développement / Procédés', description: 'Développement / Procédés', isOnSite: true, duration: 45 },
        { type: 'chapter', time: '15h15', chapterIds: ['protection'], label: 'Protection actes malveillants', description: 'Protection actes malveillants', isOnSite: true, duration: 45 },
        { type: 'chapter', time: '16h00', chapterIds: ['transport'], label: 'Transport', description: 'Transport', isOnSite: true, duration: 15 },
        { type: 'chapter', time: '16h15', chapterIds: ['qualite'], label: 'Management de la qualité', description: 'Management de la qualité', isOnSite: true, duration: 15 },
        { type: 'fixed', time: '16h30', label: 'Préparation clôture', description: 'Préparation réunion de clôture' },
        { type: 'fixed', time: '17h00', label: 'Réunion de clôture', description: 'RÉUNION DE CLOTURE' },
        { type: 'fixed', time: '17h30', label: "Fin de l'audit", description: "Fin de l'audit" },
      ],
    },
  ];

  if (durationDays <= 2) {
    return base.slice(0, 2);
  }
  if (durationDays >= 4) {
    const extraDay: IFSScheduleDay = {
      day: 3,
      activities: [
        { type: 'fixed', time: '08h15', label: 'Arrivée', description: 'Arrivée sur le site' },
        { type: 'chapter', time: '08h30', chapterIds: ['evaluation4', 'ressources'], label: 'Évaluation sur site (suite)', description: 'Évaluation sur site et gestion ressources', isOnSite: true, duration: 240 },
        { type: 'fixed', time: '12h30', label: 'Repas', description: 'Repas rapide' },
        { type: 'chapter', time: '13h30', chapterIds: ['developpement', 'protection', 'transport', 'qualite'], label: 'Process & Management', description: 'Procédés, Protection, Transport, Management qualité', isOnSite: true, duration: 180 },
        { type: 'fixed', time: '16h30', label: 'Préparation clôture', description: 'Préparation réunion de clôture' },
        { type: 'fixed', time: '17h00', label: 'Réunion de clôture', description: 'RÉUNION DE CLOTURE' },
        { type: 'fixed', time: '17h30', label: "Fin de l'audit", description: "Fin de l'audit" },
      ],
    };
    if (durationDays === 4) {
      return [...base, extraDay];
    }
    return [...base, extraDay, {
      day: 5,
      activities: [
        { type: 'fixed', time: '08h15', label: 'Arrivée', description: 'Arrivée sur le site' },
        { type: 'chapter', time: '08h30', chapterIds: ['evaluation4'], label: 'Évaluation approfondie', description: 'Évaluation approfondie sur site', isOnSite: true, duration: 240 },
        { type: 'fixed', time: '12h30', label: 'Repas', description: 'Repas rapide' },
        { type: 'chapter', time: '13h30', chapterIds: ['ressources', 'qualite'], label: 'Révisions finales', description: 'Révisions finales et synthèse', isOnSite: false, duration: 180 },
        { type: 'fixed', time: '16h30', label: 'Préparation clôture', description: 'Préparation réunion de clôture' },
        { type: 'fixed', time: '17h00', label: 'Réunion de clôture', description: 'RÉUNION DE CLOTURE' },
        { type: 'fixed', time: '17h30', label: "Fin de l'audit", description: "Fin de l'audit" },
      ],
    }];
  }

  return base;
}

export function getChapterById(id: string): IFSChapterDef | undefined {
  return IFS_CHAPTERS.find(c => c.id === id);
}

export function getFixedActivity(label: string): { time: string; description: string; isOnSite: boolean; } {
  const lower = label.toLowerCase();
  if (lower.includes('arriv')) return { time: '08h15', description: 'Arrivée sur le site', isOnSite: false };
  if (lower.includes('réunion') || lower.includes('reunion')) return { time: '08h30', description: "RÉUNION D'OUVERTURE", isOnSite: false };
  if (lower.includes('repas')) return { time: '12h30', description: 'Repas rapide', isOnSite: false };
  if (lower.includes('clôture') || lower.includes('cloture') || lower.includes('prep')) return { time: '16h30', description: 'Préparation réunion de clôture', isOnSite: false };
  return { time: '17h30', description: 'Fin de la journée', isOnSite: false };
}
