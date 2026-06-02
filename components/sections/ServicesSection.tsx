import { Wrench, HardDrive, Monitor, Cpu, Wifi, ShieldCheck, RefreshCw, GraduationCap, Globe, Code2, Smartphone, LayoutDashboard } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Réparation matérielle",
    desc: "Remplacement d'écran cassé, clavier défaillant, chargeur, batterie, port USB, ventilateur ou carte mère. Diagnostic gratuit avant toute intervention.",
    category: "Réparation informatique Parakou",
  },
  {
    icon: Monitor,
    title: "Réinstallation Windows",
    desc: "Réinstallation complète ou réparation de Windows 10 / 11. Installation des pilotes, Office, antivirus et logiciels essentiels. PC rendu comme neuf.",
    category: "Maintenance informatique Parakou",
  },
  {
    icon: ShieldCheck,
    title: "Suppression de virus & malwares",
    desc: "Détection et nettoyage complet des virus, ransomwares, logiciels espions et adwares. Sécurisation du PC avec un antivirus fiable.",
    category: "Sécurité informatique Parakou",
  },
  {
    icon: HardDrive,
    title: "Upgrade RAM & SSD",
    desc: "Boostez votre PC lent : remplacement du disque dur par un SSD rapide, ajout de mémoire RAM. Gain de vitesse immédiat et garanti.",
    category: "Maintenance informatique Parakou",
  },
  {
    icon: Cpu,
    title: "Nettoyage & maintenance préventive",
    desc: "Nettoyage interne (poussière, pâte thermique), vérification du matériel, optimisation du démarrage. Prolongez la durée de vie de votre machine.",
    category: "Maintenance informatique Parakou",
  },
  {
    icon: Wifi,
    title: "Configuration réseau & partage",
    desc: "Installation et configuration de box internet, Wi-Fi, réseau local (LAN), partage d'imprimante et connexion entre postes de travail.",
    category: "Configuration réseau Parakou",
  },
  {
    icon: RefreshCw,
    title: "Récupération de données",
    desc: "Tentative de récupération de fichiers perdus suite à une panne, suppression accidentelle ou formatage. Photos, documents, vidéos — on fait tout pour les retrouver.",
    category: "Récupération de données Parakou",
  },
  {
    icon: GraduationCap,
    title: "Conseil & accompagnement",
    desc: "Vous ne savez pas quel PC choisir ou comment configurer votre machine ? Nos techniciens vous accompagnent et répondent à vos questions gratuitement.",
    category: "Conseil informatique Parakou",
  },
  {
    icon: Globe,
    title: "Création de site web",
    desc: "Développement de sites vitrines, portfolios et sites institutionnels modernes et responsives. Idéal pour les entreprises et professionnels de Parakou et du Bénin.",
    category: "Développement web Parakou",
  },
  {
    icon: LayoutDashboard,
    title: "Site e-commerce & boutique en ligne",
    desc: "Création de boutiques en ligne pour vendre vos produits sur internet. Solution clé en main avec paiement mobile money intégré (MTN MoMo, Moov).",
    category: "Développement web Bénin",
  },
  {
    icon: Code2,
    title: "Applications web & mobiles",
    desc: "Développement d'applications web sur mesure et d'applications mobiles pour Android. Systèmes de gestion, ERP, CRM — adaptés à vos besoins métier.",
    category: "Développement application Bénin",
  },
  {
    icon: Smartphone,
    title: "Réparation téléphone & tablette",
    desc: "Remplacement d'écran cassé, batterie défaillante, réparation software. Tous modèles : Samsung, iPhone, Infinix, Tecno, Huawei. Devis gratuit.",
    category: "Réparation téléphone Parakou",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="py-14 px-4 bg-gray-50"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-7 bg-brand-blue rounded-full" />
          <div>
            <h2 className="font-head text-2xl md:text-3xl font-black text-brand-dark">
              Nos <span className="text-brand-blue">services</span>
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Bien plus qu&apos;un magasin — votre partenaire tech à Parakou : réparation, conseil et développement web
            </p>
          </div>
        </div>

        {/* Grid 4 colonnes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map(({ icon: Icon, title, desc, category }) => (
            <article
              key={title}
              className="bg-white border-[1.5px] border-transparent rounded-brand p-5 hover:border-brand-blue hover:shadow-brand transition-all duration-200 group"
              itemScope
              itemType="https://schema.org/Service"
            >
              <meta itemProp="serviceType" content={category} />
              <meta itemProp="areaServed" content="Parakou, Bénin" />
              <meta itemProp="provider" content="MICROLOGIS" />
              <div className="w-11 h-11 bg-brand-blue-pale rounded-xl flex items-center justify-center mb-4 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-200">
                <Icon size={21} />
              </div>
              <h3 className="font-head text-[14.5px] font-bold text-brand-dark mb-1.5" itemProp="name">{title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed" itemProp="description">{desc}</p>
            </article>
          ))}
        </div>

        {/* CTA WhatsApp */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 mb-3">
            Un problème avec votre PC, téléphone ou besoin d&apos;un site web ? Contactez-nous directement.
          </p>
          <a
            href="https://wa.me/2290197419851?text=Bonjour%20MICROLOGIS%2C%20j%27ai%20besoin%20d%27un%20service."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-whatsapp text-white font-bold text-sm px-6 py-3 rounded-brand-sm hover:opacity-85 transition-opacity"
          >
            💬 Demander un devis sur WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
