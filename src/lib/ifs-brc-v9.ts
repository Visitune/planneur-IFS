import { IFSScheduleDay } from './ifs-food-v8';

export type IFsBrcScheduleFixed = {
  type: 'fixed';
  time: string;
  label: string;
  description: string;
  chapterIFS?: string;
  chapterBRC?: string;
};

export type IFsBrcScheduleChapter = {
  type: 'chapter';
  time: string;
  chapterIFS: string;
  chapterBRC: string;
  label: string;
  description: string;
  isOnSite: boolean;
  duration: number;
};

export type IFsBrcScheduleActivity = IFsBrcScheduleFixed | IFsBrcScheduleChapter;

export interface IFsBrcScheduleDay {
  day: number;
  activities: IFsBrcScheduleActivity[];
}

export function getCombinedSchedule(durationDays: number, isAnnounced: boolean): IFsBrcScheduleDay[] {
  const base: IFsBrcScheduleDay[] = [
    {
      day: 1,
      activities: [
        { type: 'fixed', time: '08h15', label: 'Arrivée', description: 'Arrivée sur le site', chapterIFS: 'Arrivée', chapterBRC: 'Arrivée' },
        { type: 'fixed', time: '08h30', label: "Réunion d'ouverture", description: "RÉUNION D'OUVERTURE", chapterIFS: '', chapterBRC: '' },
        { type: 'chapter', time: '08h45', chapterIFS: '1.1, 1.2, 1.3, 5.11', chapterBRC: '1.1, 1.2', label: 'Gouvernance et Engagement', description: 'Gouvernance et Engagement', isOnSite: false, duration: 45 },
        { type: 'chapter', time: '09h30', chapterIFS: '4.8, 3.4, 3.2, 4.14, 4.9, 4.18.5', chapterBRC: '4.3, 7, 4.8, 8, 4.15, 4.4, 4.5', label: 'Évaluation sur site', description: 'Évaluation sur site: réception, flux, hygiène', isOnSite: true, duration: 180 },
        { type: 'fixed', time: '12h30', label: 'Repas', description: 'Repas rapide' },
        { type: 'chapter', time: '13h30', chapterIFS: '2.2, 4.12, 4.9.10, 4.19', chapterBRC: '2, 4.9/4.10, 5.3', label: 'HACCP', description: 'HACCP et Allergènes', isOnSite: true, duration: 60 },
        { type: 'chapter', time: '14h30', chapterIFS: '4.1, 4.2', chapterBRC: '3.6', label: 'Spécifications client', description: 'Spécifications et revue contrat', isOnSite: true, duration: 30 },
        { type: 'chapter', time: '15h00', chapterIFS: '4.18', chapterBRC: '3.9', label: 'Traçabilité', description: 'Traçabilité générale', isOnSite: true, duration: 60 },
        { type: 'chapter', time: '16h00', chapterIFS: '4.4, 4.5, 4.19', chapterBRC: '3.5, 3.6, 5.5, 5.4', label: 'Achats', description: 'Achats et référencement fournisseurs', isOnSite: true, duration: 45 },
        { type: 'chapter', time: '16h45', chapterIFS: '4.20', chapterBRC: '5.4', label: 'Fraude alimentaire', description: 'Fraude alimentaire', isOnSite: true, duration: 30 },
        { type: 'chapter', time: '17h15', chapterIFS: 'Exclus du périmètre', chapterBRC: '9', label: 'Produits hors périmètre', description: 'Gestion produits négoce/sous-traités', isOnSite: false, duration: 15 },
        { type: 'fixed', time: '17h30', label: 'Fin journée 1', description: 'Fin de la première journée' },
      ],
    },
    {
      day: 2,
      activities: [
        { type: 'fixed', time: '08h15', label: 'Arrivée', description: 'Deuxième journée: Arrivée sur le site' },
        { type: 'chapter', time: '08h30', chapterIFS: '2.3.9.1, 4.12, 5.5, 4.10, 4.3, 4.13', chapterBRC: '2.10, 4.9/4.10, 6.3, 4.11, 5.1, 4.14', label: 'Évaluation sur site (suite)', description: 'Évaluation sur site approfondie', isOnSite: true, duration: 240 },
        { type: 'fixed', time: '12h30', label: 'Repas', description: 'Repas rapide' },
        { type: 'chapter', time: '13h30', chapterIFS: '4.16, 4.9.10, 4.17, 5.3', chapterBRC: '4.6, 4.7', label: 'Évaluation sur site (suite)', description: 'Maintenance, validation process', isOnSite: true, duration: 60 },
        { type: 'chapter', time: '14h30', chapterIFS: '5.4', chapterBRC: '6.4', label: 'Étalonnage', description: 'Étalonnage', isOnSite: true, duration: 30 },
        { type: 'chapter', time: '15h00', chapterIFS: '4.11, 4.13, 4.10, 3.2, 3.4', chapterBRC: '4.12, 4.13, 4.14, 4.11, 7.2', label: "Gestion de l'hygiène", description: "Hygiène, déchets, nuisibles", isOnSite: true, duration: 45 },
        { type: 'chapter', time: '15h45', chapterIFS: '5.6, 5.7, 5.10, 5.11', chapterBRC: '5.6, 5.4, 5.7, 3.8, 3.7', label: 'Mesures et analyse', description: 'Analyses, blocage, réclamations', isOnSite: true, duration: 45 },
        { type: 'chapter', time: '16h30', chapterIFS: '5.1, 5.2, 5.8, 5.9', chapterBRC: '3.4, 3.10, 3.11', label: 'Management qualité', description: 'Audits internes, inspections, incidents', isOnSite: true, duration: 60 },
        { type: 'fixed', time: '17h30', label: 'Fin journée 2', description: 'Fin de la deuxième journée' },
      ],
    },
    {
      day: 3,
      activities: [
        { type: 'fixed', time: '08h15', label: 'Arrivée', description: 'Troisième journée: Arrivée sur le site' },
        { type: 'chapter', time: '08h30', chapterIFS: '2.3.9.1, 4.5, 4.6, 4.7, 4.21', chapterBRC: '2.10, 6.1, 6.2, 6.3, 4.1, 4.2', label: 'Évaluation sur site (suite)', description: 'Emballage, lieu usine, protection', isOnSite: true, duration: 240 },
        { type: 'fixed', time: '12h30', label: 'Repas', description: 'Repas rapide' },
        { type: 'chapter', time: '13h30', chapterIFS: '3.1, 3.3', chapterBRC: '7.1, 7.3', label: 'Gestion des ressources', description: 'Gestion RH, formation', isOnSite: true, duration: 60 },
        { type: 'chapter', time: '14h30', chapterIFS: '4.3', chapterBRC: '5.1, 5.2', label: 'Développement / Procédés', description: 'Développement produits et procédés', isOnSite: true, duration: 45 },
        { type: 'chapter', time: '15h15', chapterIFS: '4.21', chapterBRC: '4.2', label: 'Protection actes malveillants', description: 'Food defence / protection', isOnSite: true, duration: 45 },
        { type: 'chapter', time: '16h00', chapterIFS: '4.15', chapterBRC: '4.16', label: 'Transport', description: 'Transport et stockage', isOnSite: true, duration: 15 },
        { type: 'chapter', time: '16h15', chapterIFS: '2.1', chapterBRC: '3.1, 3.2, 3.3', label: 'Management qualité', description: 'Politique qualité, management', isOnSite: true, duration: 15 },
        { type: 'fixed', time: '16h30', label: 'Préparation clôture', description: 'Préparation réunion de clôture' },
        { type: 'fixed', time: '17h00', label: 'Réunion de clôture', description: 'RÉUNION DE CLOTURE' },
        { type: 'fixed', time: '17h30', label: "Fin de l'audit", description: "Fin de l'audit" },
      ],
    },
  ];

  if (durationDays <= 2) {
    return base.slice(0, 2);
  }
  return base;
}
