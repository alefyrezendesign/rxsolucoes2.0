export type PartnerPlan = 'Elite' | 'Pro' | 'Mais';

export interface Partner {
    id: string;
    name: string;
    logo: string;
    shortDescription: string;
    fullDescription: string;
    segments: string[];
    categories: string[];
    solutions: string[];
    offers?: string[];
    differentials?: string[];
    website?: string;
    whatsapp?: string;
    affiliateLink?: string;
    internalPage?: string;
    plan: PartnerPlan;
    priority: number; // Higher number means higher priority
    isHighlighted: boolean;
    isActive: boolean;
}

export const getPlanPriority = (plan: PartnerPlan) => {
    switch (plan) {
        case 'Elite': return 3000;
        case 'Pro': return 2000;
        case 'Mais': return 1000;
        default: return 0;
    }
};

// Dados base para gerar os mockups de forma premium e escalável
const baseData = {
    "Farmacêutico": [
        { name: "Farma Gestão", logo: "FG" },
        { name: "Cura Digital", logo: "CD" },
        { name: "Monta Fácil", logo: "MF" },
        { name: "Estoque Farma", logo: "EF" },
        { name: "BioSaúde", logo: "BS" },
        { name: "Receita Digital", logo: "RD" },
        { name: "Farma Inova", logo: "FI" },
        { name: "Saúde Ágil", logo: "SA" },
        { name: "MedFácil", logo: "MF" },
        { name: "RX Analítica", logo: "RX" }
    ],
    "Pet e Vet": [
        { name: "Vet Financeiro", logo: "VF" },
        { name: "Mundo Pet Admin", logo: "MP" },
        { name: "Gestão Animal", logo: "GA" },
        { name: "Nuvem Vet", logo: "NV" },
        { name: "Clínica Pet", logo: "CP" },
        { name: "Pet Fluxo", logo: "PF" },
        { name: "ZooTech ERP", logo: "ZT" },
        { name: "Saúde Animal", logo: "SA" },
        { name: "Pet Inovador", logo: "PI" }
    ],
    "Alimentação": [
        { name: "Menu Digital", logo: "MD" },
        { name: "Gastro Admin", logo: "GA" },
        { name: "Restaurante Fácil", logo: "RF" },
        { name: "Estoque Chefe", logo: "EC" },
        { name: "Cozinha Ágil", logo: "CA" },
        { name: "Gourmet Gestão", logo: "GG" },
        { name: "Alimenta Fluxo", logo: "AF" },
        { name: "Nutri Cloud", logo: "NC" },
        { name: "Food Inova", logo: "FI" }
    ],
    "Outros": [
        { name: "RH Digital", logo: "RH" },
        { name: "Agência Lumina", logo: "AL" },
        { name: "Compliance Fácil", logo: "CF" },
        { name: "Finanças Prime", logo: "FP" },
        { name: "Logística Core", logo: "LC" },
        { name: "Educação em Nuvem", logo: "EN" },
        { name: "Loja Gestão", logo: "LG" },
        { name: "ConstruSys", logo: "CS" },
        { name: "Auto Gerente", logo: "AG" }
    ]
};

const generatePartners = (): Partner[] => {
    const list: Partner[] = [];
    let counter = 1;

    Object.entries(baseData).forEach(([segment, companies]) => {
        companies.forEach((company, index) => {
            const plan: PartnerPlan = index < 2 ? 'Elite' : index < 5 ? 'Pro' : 'Mais';
            
            let isHighlighted = false;
            if (segment === "Farmacêutico" && index < 3) isHighlighted = true;
            else if (segment === "Pet e Vet" && index < 2) isHighlighted = true;
            else if (segment === "Alimentação" && index < 2) isHighlighted = true;
            else if (segment === "Outros" && index < 1) isHighlighted = true;

            list.push({
                id: `p${counter}`,
                name: company.name,
                logo: company.logo,
                shortDescription: `Solução especializada de alta performance para o segmento ${segment.toLowerCase()}.`,
                fullDescription: `A ${company.name} oferece uma plataforma robusta e inovadora para otimizar os processos no setor de ${segment}. Focamos em entregar inteligência de dados, redução de custos e integração nativa com seus processos operacionais.`,
                segments: [segment],
                categories: [
                    index % 3 === 0 ? "Eficiência" : index % 3 === 1 ? "Redução de Custo" : "Sistemas",
                    index % 2 === 0 ? "Sistemas" : "Eficiência"
                ].filter((v, i, a) => a.indexOf(v) === i),
                solutions: [
                    "Gestão Inteligente (ERP)", 
                    "Controle de Fluxo de Caixa", 
                    "Análise Preditiva de Dados"
                ],
                offers: isHighlighted ? ["Integração gratuita", "1º mês de mensalidade isento"] : undefined,
                differentials: ["Suporte 24/7 humanizado", "Setup ágil em até 48h", "Ecossistema Cloud-first"],
                website: "https://rxsolucoes.com",
                whatsapp: "5511999999999",
                plan: plan,
                priority: getPlanPriority(plan) + (10 - index) + (isHighlighted ? 10000 : 0),
                isHighlighted: isHighlighted,
                isActive: true
            });
            counter++;
        });
    });

    return list;
};

export const partnersData: Partner[] = generatePartners();

export const getUniqueSegments = () => {
    const segments = new Set<string>();
    partnersData.forEach(p => p.segments.forEach(s => segments.add(s)));
    return Array.from(segments);
};

export const getUniqueCategories = () => {
    const categories = new Set<string>();
    partnersData.forEach(p => p.categories.forEach(c => categories.add(c)));
    return Array.from(categories).sort();
};
