export interface Solution {
    id: string;
    name: string;
    partnerName: string;
    description: string;
    categoryId: string;
    isRxAnalises?: boolean;
}

export interface Partner {
    id: string;
    name: string;
    logoUrl?: string; // We'll mock a fallback if none
}

export interface Category {
    id: string;
    name: string;
    iconType: 'efficiency' | 'cost' | 'system' | 'analytics' | 'default';
    solutions: Solution[];
}

export interface Segment {
    id: string;
    label: string;
    impactPhrase: string;
    description: string;
    categories: Category[];
    partners: Partner[];
}

const mockPartners = ["AlphaTech", "GlobalSys", "NexusCorp", "InnovaData", "PrimeLogic", "QuantumSoft", "VertexIT", "OmniTech"];
const mockSolutions = ["Plataforma de Gestão", "Automação Integrada", "Análise Preditiva", "Sistema ERP B2B", "Controle de Estoque", "Otimização Logística", "Gestão Financeira", "Monitoramento Cloud"];

// Helper to generate mock solutions
const generateMockSolutions = (category: string, categoryId: string, count: number): Solution[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `mock-${categoryId}-${i}`,
        name: mockSolutions[i % mockSolutions.length],
        partnerName: mockPartners[i % mockPartners.length],
        description: `Implementação de tecnologia de ponta para a área de ${category.toLowerCase()}, focada em maximizar resultados e escalar operações de forma inteligente.`,
        categoryId: categoryId
    }));
};

// Helper to ensure all segments have the standard 4 categories
const createStandardCategories = (
    _eficiencia: Solution[],
    _reducaoCusto: Solution[],
    _sistemas: Solution[]
): Category[] => [
    {
        id: "eficiencia",
        name: "Eficiência",
        iconType: "efficiency",
        solutions: generateMockSolutions("Eficiência", "eficiencia", 8)
    },
    {
        id: "reducao-custo",
        name: "Redução de Custo",
        iconType: "cost",
        solutions: generateMockSolutions("Redução de Custo", "reducao-custo", 6)
    },
    {
        id: "sistemas",
        name: "Sistemas",
        iconType: "system",
        solutions: generateMockSolutions("Sistemas", "sistemas", 4)
    },
    {
        id: "rx-analises",
        name: "RX Análises",
        iconType: "analytics",
        solutions: [] // Soluções não são renderizadas aqui, será texto fixo
    }
];

// Mock Data
export const solutionsData: Segment[] = [
    {
        id: "farmaceutico",
        label: "Farmacêutico",
        impactPhrase: "Soluções feitas para \na alta exigência do\nmercado farmacêutico.",
        description: "Reduza perdas, controle seu estoque com precisão e impulsione as vendas com os parceiros mais confiáveis do setor.",
        partners: [
            { id: "p-farm-1", name: "FarmaTech" },
            { id: "p-farm-2", name: "MediLog" },
            { id: "p-farm-3", name: "HealthSys" },
            { id: "p-farm-4", name: "BioDistribuidora" },
        ],
        categories: createStandardCategories([], [], [])
    },
    {
        id: "pet-vet",
        label: "Pet e Vet",
        impactPhrase: "O impulso que o seu negócio Pet/Vet precisa para crescer.",
        description: "Encontre fornecedores homologados para produtos, sistemas de gestão veterinária e serviços dedicados a esse mercado em expansão.",
        partners: [
            { id: "p-pet-1", name: "PetSoft ERP" },
            { id: "p-pet-2", name: "VetDistribuidora" },
            { id: "p-pet-3", name: "DogLogística" },
        ],
        categories: createStandardCategories(
            [
                { id: "s-p-e1", name: "Logística Especializada", partnerName: "DogLogística", description: "Transporte seguro de vacinas e medicamentos.", categoryId: "eficiencia" }
            ],
            [
                { id: "s-p-2", name: "Compra Coletiva de Rações", partnerName: "VetDistribuidora", description: "Acesso a descontos de atacado para pequenos petshops.", categoryId: "reducao-custo" }
            ],
            [
                { id: "s-p-1", name: "Software de Gestão Veterinária", partnerName: "PetSoft ERP", description: "Prontuários eletrônicos e agendamento de banho/tosa.", categoryId: "sistemas" }
            ]
        )
    },
    {
        id: "alimentacao",
        label: "Alimentação",
        impactPhrase: "Eficiência e escala para food service e indústrias.",
        description: "Soluções focadas em redução de desperdício, logística eficiente e automação de ponta para o setor alimentício.",
        partners: [
            { id: "p-ali-1", name: "FoodChain ERP" },
            { id: "p-ali-2", name: "CozinhaTech" },
            { id: "p-ali-3", name: "EntregaÁgil" },
        ],
        categories: createStandardCategories(
            [
                { id: "s-a-1", name: "Controle de Desperdício", partnerName: "CozinhaTech", description: "IA para prever demanda e ajustar estoque de perecíveis.", categoryId: "eficiencia" },
                { id: "s-a-2", name: "Roteirização de Entregas", partnerName: "EntregaÁgil", description: "Otimização de rotas para delivery e distribuição.", categoryId: "eficiencia" }
            ],
            [
                { id: "s-a-c1", name: "Central de Compras de Insumos", partnerName: "FoodChain ERP", description: "Negociação direta com produtores rurais.", categoryId: "reducao-custo" }
            ],
            [
                { id: "s-a-s1", name: "ERP para Restaurantes", partnerName: "FoodChain ERP", description: "Controle de mesas, delivery e estoque integrado.", categoryId: "sistemas" }
            ]
        )
    },
    {
        id: "outros",
        label: "Outros",
        impactPhrase: "Tecnologia e serviços para empresas de todos os setores.",
        description: "Descubra soluções B2B versáteis de RH, finanças, marketing e infraestrutura que impulsionam resultados em qualquer segmento.",
        partners: [
            { id: "p-out-1", name: "GeralTech" },
            { id: "p-out-2", name: "CloudSys" },
            { id: "p-out-3", name: "FintechPro" },
        ],
        categories: createStandardCategories(
            [
                { id: "s-o-e1", name: "Automação de Processos (RPA)", partnerName: "GeralTech", description: "Robôs para automatizar tarefas repetitivas.", categoryId: "eficiencia" }
            ],
            [
                { id: "s-o-c1", name: "Gestão de Frotas", partnerName: "GeralTech", description: "Controle de combustível e manutenção preventiva.", categoryId: "reducao-custo" }
            ],
            [
                { id: "s-o-1", name: "Infraestrutura Cloud", partnerName: "CloudSys", description: "Servidores seguros e escaláveis para seu negócio.", categoryId: "sistemas" },
                { id: "s-o-2", name: "Plataforma de Pagamentos", partnerName: "FintechPro", description: "Gateway de pagamentos com taxas reduzidas B2B.", categoryId: "sistemas" }
            ]
        )
    }
];
