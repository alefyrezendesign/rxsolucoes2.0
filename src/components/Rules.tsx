import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Target } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';


const Rules = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const rulesList = [
        "Aprovação no RX Partner Program mediante análise de perfil.",
        "Indicação ativa de serviços e engajamento com a base.",
        "Setup inicial para integração comercial e treinamento.",
        "Diferenciais exclusivos para clientes do ecossistema RX.",
        "Política de distribuição e comissionamento definida em contrato."
    ];

    return (
        <section className="py-24 bg-[#080808] relative overflow-hidden" ref={ref}>
            <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="w-full mx-auto bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 backdrop-blur-md relative overflow-hidden">
                    {/* Corner decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/20 to-transparent opacity-50" />
                    
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                            transition={{ duration: 0.6 }}
                            className="flex-1"
                        >
                            <SectionBadge icon={<ShieldCheck className="w-4 h-4" />}>
                                Regras
                            </SectionBadge>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                                Regras para garantir <br className="hidden lg:block"/>
                                <span className="text-white">qualidade e consistência</span>
                            </h2>
                            <p className="text-gray-400 font-light text-lg">
                                Nosso ecossistema opera com alto nível de exigência para garantir que todos os parceiros e clientes alcancem os melhores resultados possíveis.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex-1 w-full"
                        >
                            <ul className="space-y-4">
                                {rulesList.map((rule, i) => (
                                    <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary-500/30 transition-colors">
                                        <div className="mt-0.5 shrink-0">
                                            <Target className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <span className="text-gray-300 font-medium">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Rules;
