import { Wrench, RefreshCw, Monitor, Truck, GraduationCap, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Réparation PC & Téléphones",
    desc: "Diagnostic gratuit, devis transparent. Réparation carte mère, écran, batterie, clavier, virus et bien plus encore.",
  },
  {
    icon: RefreshCw,
    title: "PC Occasion Recertifiés",
    desc: "Chaque PC occasion est testé, nettoyé, mis à jour et livré avec garantie. Rapport qualité/prix imbattable.",
  },
  {
    icon: Monitor,
    title: "Installation & Configuration",
    desc: "Windows, Office, antivirus, pilotes — votre machine prête à l'emploi dès l'achat. Service à domicile disponible.",
  },
  {
    icon: Truck,
    title: "Livraison à Parakou",
    desc: "Livraison rapide dans Parakou et environs. Paiement à la livraison disponible pour les clients locaux.",
  },
  {
    icon: GraduationCap,
    title: "Conseil & Formation",
    desc: "Quel PC choisir pour vos études ? Comment protéger votre téléphone ? Nos conseillers répondent gratuitement.",
  },
  {
    icon: ShieldCheck,
    title: "Garantie & SAV",
    desc: "Tous les produits neufs sont vendus avec garantie. Service après-vente rapide et local.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-14 px-4 bg-gray-50">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-8">
          <h2 className="font-head text-2xl md:text-3xl font-black text-brand-dark">
            Nos <span className="text-brand-blue">services</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Bien plus qu&apos;un magasin — un partenaire de confiance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border-[1.5px] border-transparent rounded-brand p-6 hover:border-brand-blue-light hover:shadow-brand transition-all duration-200"
            >
              <div className="w-12 h-12 bg-brand-blue-pale rounded-[13px] flex items-center justify-center mb-4 text-brand-blue">
                <Icon size={24} />
              </div>
              <h3 className="font-head text-[15px] font-bold text-brand-dark mb-2">{title}</h3>
              <p className="text-[13.5px] text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
