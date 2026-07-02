export type OfferType = 'Produto' | 'Serviço' | 'Consultoria' | 'Treinamento' | 'Solução Digital';

export interface Offer {
    id: string;
    slug: string;
    name: string;
    partnerId: string;
    partnerName: string;
    partnerLogo: string;
    category: string;
    segments: string[];
    type: OfferType;
    image?: string; // URL da imagem da oferta
    shortDescription: string;
    fullDescription: string;
    benefits: string[];
    commercialCondition: string;
    validity?: string; // Ex: '2026-12-31'
    linkType: 'external' | 'whatsapp';
    externalLink?: string;
    whatsappNumber?: string;
    whatsappMessage?: string;
    isSponsored: boolean;
    isHighlighted: boolean;
    priority: number;
    isActive: boolean;
    createdAt: string;
}

export const offersData: Offer[] = [
    {
        id: 'off-1',
        slug: 'erp-farmacia-lite',
        name: 'ERP Completo para Farmácias - Plano Lite',
        partnerId: 'p1',
        partnerName: 'TechPharma Solutions',
        partnerLogo: 'TP',
        category: 'Sistemas',
        segments: ['Farmacêutico', 'Varejo'],
        type: 'Solução Digital',
        shortDescription: 'Gestão completa de estoque, PDV e fiscal com 50% OFF na implantação.',
        fullDescription: 'Tenha o controle total da sua farmácia com nosso ERP especializado. Integramos com as principais distribuidoras e SNGPC. O plano Lite oferece tudo que uma drogaria de pequeno e médio porte precisa para escalar com segurança e agilidade.',
        benefits: ['PDV Rápido e Intuitivo', 'Gestão de SNGPC Automática', 'Suporte Especializado 24/7'],
        commercialCondition: '50% de desconto na taxa de implantação + 1º Mês Grátis',
        validity: '2026-08-30',
        linkType: 'external',
        externalLink: 'https://example.com/techpharma/lite',
        isSponsored: true,
        isHighlighted: true,
        priority: 100,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        createdAt: '2026-06-01'
    },
    {
        id: 'off-2',
        slug: 'consultoria-tributaria-pet',
        name: 'Planejamento Tributário para Clínicas Pet',
        partnerId: 'p2',
        partnerName: 'VetCare Finance',
        partnerLogo: 'VC',
        category: 'Financeiro',
        segments: ['Pet e Vet'],
        type: 'Consultoria',
        shortDescription: 'Reduza a carga tributária da sua clínica legalmente.',
        fullDescription: 'Nossa equipe de especialistas contábeis faz uma varredura completa nas suas operações para encontrar incentivos fiscais e reclassificações que diminuem os impostos da sua clínica ou hospital veterinário.',
        benefits: ['Auditoria de impostos passados', 'Enquadramento tributário ideal', 'Redução imediata na guia do mês'],
        commercialCondition: 'Diagnóstico Gratuito de 30 minutos',
        linkType: 'whatsapp',
        whatsappNumber: '5511999999999',
        whatsappMessage: 'Olá, vim do portal RX Ofertas e gostaria de agendar meu diagnóstico tributário gratuito para minha clínica veterinária.',
        isSponsored: false,
        isHighlighted: true,
        priority: 80,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
        createdAt: '2026-06-02'
    },
    {
        id: 'off-3',
        slug: 'roteirizacao-food',
        name: 'Plataforma de Roteirização de Entregas',
        partnerId: 'p3',
        partnerName: 'FoodChain Logistics',
        partnerLogo: 'FC',
        category: 'Sistemas',
        segments: ['Alimentação', 'Logística'],
        type: 'Solução Digital',
        shortDescription: 'Corte custos de logística otimizando as rotas da sua frota.',
        fullDescription: 'Um software inteligente de roteirização que calcula o caminho mais rápido e barato para suas entregas de alimentos perecíveis. Reduz o consumo de combustível e diminui o tempo de espera dos seus clientes.',
        benefits: ['Redução de até 20% em combustível', 'Acompanhamento em tempo real', 'App para motoristas'],
        commercialCondition: '15% OFF nas 3 primeiras mensalidades',
        linkType: 'external',
        externalLink: 'https://example.com/foodchain/promo',
        isSponsored: false,
        isHighlighted: false,
        priority: 60,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
        createdAt: '2026-06-03'
    },
    {
        id: 'off-4',
        slug: 'portal-rh-cloudhr',
        name: 'Implantação Portal do Colaborador CloudHR',
        partnerId: 'p4',
        partnerName: 'CloudHR Platform',
        partnerLogo: 'CH',
        category: 'Recursos humanos',
        segments: ['Outros'],
        type: 'Serviço',
        shortDescription: 'Digitalize os holerites e a comunicação com sua equipe.',
        fullDescription: 'Dê adeus ao papel impresso e ao envio manual de holerites. Com o CloudHR, seus funcionários acessam informes de rendimento, ponto eletrônico e avisos em um portal seguro e fácil de usar no celular.',
        benefits: ['Assinatura Eletrônica', 'App Mobile para Funcionários', 'Gestão de Férias Simplificada'],
        commercialCondition: 'Implantação Isenta para parceiros RX',
        linkType: 'whatsapp',
        whatsappNumber: '5511888888888',
        whatsappMessage: 'Olá, gostaria de saber como zerar a taxa de implantação do CloudHR através da RX Soluções.',
        isSponsored: false,
        isHighlighted: false,
        priority: 50,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800',
        createdAt: '2026-06-04'
    },
    {
        id: 'off-5',
        slug: 'campanha-leads-lumina',
        name: 'Pacote Performance - Geração de Leads',
        partnerId: 'p5',
        partnerName: 'Agência Lumina',
        partnerLogo: 'AL',
        category: 'Marketing',
        segments: ['Farmacêutico', 'Alimentação', 'Outros'],
        type: 'Serviço',
        shortDescription: 'Criação e gestão de campanhas no Google Ads focado em conversão.',
        fullDescription: 'Alavanque suas vendas com campanhas de alta performance. Cuidamos do setup, criativos, palavras-chave e otimização semanal para extrair o máximo de cada real investido no Google Ads e Meta Ads.',
        benefits: ['Setup de Tags Incluso', 'Relatórios Mensais em Tempo Real', 'Equipe de Design e Copy'],
        commercialCondition: 'Auditoria de campanhas antigas grátis na contratação',
        validity: '2026-10-15',
        linkType: 'external',
        externalLink: 'https://example.com/lumina',
        isSponsored: true,
        isHighlighted: true,
        priority: 95,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        createdAt: '2026-06-05'
    },
    {
        id: 'off-6',
        slug: 'auditoria-lgpd',
        name: 'Auditoria Expressa de LGPD',
        partnerId: 'p6',
        partnerName: 'SafeGuard Compliance',
        partnerLogo: 'SG',
        category: 'Consultoria',
        segments: ['Outros', 'Farmacêutico', 'Pet e Vet'],
        type: 'Consultoria',
        shortDescription: 'Descubra os riscos jurídicos do seu negócio em relação aos dados de clientes.',
        fullDescription: 'Uma análise rápida e incisiva sobre como sua empresa captura, armazena e descarta dados de clientes. Entregamos um relatório de vulnerabilidades com os próximos passos para se adequar e evitar multas severas.',
        benefits: ['Análise do Site e Cookies', 'Revisão de Contratos de Trabalho', 'Mapeamento de Fluxo de Dados'],
        commercialCondition: 'Valor fixo especial: R$ 1.990,00',
        linkType: 'whatsapp',
        whatsappNumber: '5511977777777',
        whatsappMessage: 'Olá, tenho interesse na Auditoria Expressa LGPD no valor especial divulgado na página de Ofertas RX.',
        isSponsored: false,
        isHighlighted: false,
        priority: 40,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?auto=format&fit=crop&q=80&w=800',
        createdAt: '2026-06-06'
    },
    {
        id: 'off-7',
        slug: 'servidor-cloud-aws',
        name: 'Migração de Dados para Nuvem AWS',
        partnerId: 'p7',
        partnerName: 'TechCloud BR',
        partnerLogo: 'TC',
        category: 'Infraestrutura',
        segments: ['Outros'],
        type: 'Serviço',
        shortDescription: 'Mova seu sistema local para a nuvem com segurança militar.',
        fullDescription: 'Evite perda de dados com roubos ou queimas de HDs físicos. Nossa equipe especializada realiza toda a migração dos seus sistemas para servidores dedicados AWS Cloud com backup automático e redundância.',
        benefits: ['Zero indisponibilidade no horário comercial', 'Backup Diário Automático', 'Proteção Anti-DDoS'],
        commercialCondition: '30 dias de infraestrutura bancada pela TechCloud',
        linkType: 'whatsapp',
        whatsappNumber: '5511966666666',
        whatsappMessage: 'Gostaria de solicitar um orçamento de migração para nuvem.',
        isSponsored: true,
        isHighlighted: true,
        priority: 90,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
        createdAt: '2026-06-07'
    },
    {
        id: 'off-8',
        slug: 'treinamento-vendas',
        name: 'Workshop: Fechamento de Vendas B2B',
        partnerId: 'p8',
        partnerName: 'EduCloud Learning',
        partnerLogo: 'EC',
        category: 'Treinamentos',
        segments: ['Outros', 'Farmacêutico'],
        type: 'Treinamento',
        shortDescription: 'Aumente sua taxa de conversão B2B com técnicas modernas de negociação.',
        fullDescription: 'Um treinamento imersivo online (ou in-company) de 8 horas projetado para qualificar equipes comerciais. Aprenda contorno de objeções, SPIN Selling e táticas de fechamento direto.',
        benefits: ['Certificado de Conclusão', 'Apostilas Digitais', 'Acesso à gravação por 1 ano'],
        commercialCondition: '20% OFF para compras em lote (acima de 5 inscritos)',
        linkType: 'external',
        externalLink: 'https://example.com/educloud',
        isSponsored: false,
        isHighlighted: false,
        priority: 30,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
        createdAt: '2026-06-08'
    }
];

export const getUniqueOfferCategories = () => {
    const cats = new Set<string>();
    offersData.forEach(o => cats.add(o.category));
    return Array.from(cats).sort();
};
