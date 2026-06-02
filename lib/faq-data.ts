/**
 * Données FAQ — partagées entre le composant client (accordion) et le serveur (JSON-LD FAQPage).
 * Ne pas marquer "use client" ici.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: "Proposez-vous des ordinateurs d'occasion ou reconditionnés ?",
    a: "Oui ! Nous proposons des ordinateurs portables neufs, d'occasion et reconditionnés (HP, Dell, Lenovo, Asus, Acer) à Parakou. Tous nos appareils d'occasion sont testés et vérifiés avant la vente. Contactez-nous sur WhatsApp pour connaître les disponibilités actuelles.",
  },
  {
    q: "Puis-je payer en plusieurs fois (versements) ?",
    a: "Nous proposons des facilités de paiement pour certains produits. Contactez-nous directement sur WhatsApp ou par téléphone pour en discuter et trouver un arrangement adapté à votre budget.",
  },
  {
    q: "Faites-vous des livraisons à domicile à Parakou ?",
    a: "Oui, nous effectuons des livraisons à Parakou et dans les zones environnantes. Les frais et délais de livraison dépendent de votre quartier. Contactez-nous pour plus de détails.",
  },
  {
    q: "Proposez-vous un service de réparation pour les téléphones et PC ?",
    a: "Absolument ! Nous disposons d'un atelier de réparation pour téléphones et ordinateurs à Parakou. Dépannage logiciel, remplacement d'écran cassé, nettoyage, upgrade de RAM/SSD, récupération de données... N'hésitez pas à passer nous voir.",
  },
  {
    q: "Quelles sont vos garanties sur les produits neufs ?",
    a: "Tous nos produits neufs bénéficient d'une garantie fabricant (généralement 12 mois). En cas de problème, amenez simplement votre appareil avec sa facture d'achat.",
  },
  {
    q: "Acceptez-vous les paiements Mobile Money (MTN, Moov) ?",
    a: "Oui, nous acceptons les paiements en espèces ainsi que par Mobile Money (MTN MoMo et Moov Money). Le paiement par Orange Money est également possible.",
  },
  {
    q: "Créez-vous des sites web et applications pour les entreprises ?",
    a: "Oui ! MICROLOGIS propose des services de développement web : création de sites vitrines, sites e-commerce, applications web et mobiles. Nous accompagnons les entreprises et particuliers de Parakou et de tout le Bénin dans leur présence digitale.",
  },
  {
    q: "Quel est le délai pour la réparation d'un téléphone ou PC ?",
    a: "Les réparations simples (nettoyage, réinstallation Windows, configuration) sont effectuées en quelques heures. Pour les pannes matérielles (remplacement d'écran, carte mère), le délai est généralement de 24 à 72 heures selon la disponibilité des pièces.",
  },
];
