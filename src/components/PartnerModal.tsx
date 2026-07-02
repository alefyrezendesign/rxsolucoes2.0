import { useState, useEffect, useCallback, useRef, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, AlertCircle, Handshake, Send, ChevronDown, Check } from 'lucide-react';
import { usePartnerModal } from '../hooks/usePartnerModal';

// ─── Tipos ───────────────────────────────────────────────────
interface FormFields {
    name: string;
    phone: string;
    email: string;
    company: string;
    city: string;
    segment: string;
    contribution: string;
    partnerModel: string;
}

interface FieldError { [key: string]: string | undefined }

interface CityItem { label: string }

type ModalState = 'form' | 'submitting' | 'success' | 'error';

const PLAN_OPTIONS = ['RX Mais', 'RX Pro', 'RX Elite'] as const;

const INITIAL: FormFields = {
    name: '', phone: '', email: '', company: '',
    city: '', segment: '', contribution: '', partnerModel: '',
};

// ─── Cache global de cidades IBGE ────────────────────────────
let citiesCache: CityItem[] | null = null;
let citiesPromise: Promise<CityItem[]> | null = null;

function loadCities(): Promise<CityItem[]> {
    if (citiesCache) return Promise.resolve(citiesCache);
    if (citiesPromise) return citiesPromise;
    citiesPromise = fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome')
        .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
        .then((d: Array<{ nome: string; microrregiao?: { mesorregiao?: { UF?: { sigla?: string } } } | null }>) => {
            citiesCache = d
                .map(c => {
                    const sigla = c.microrregiao?.mesorregiao?.UF?.sigla;
                    return sigla ? { label: `${c.nome} - ${sigla}` } : null;
                })
                .filter((c): c is CityItem => c !== null);
            return citiesCache;
        })
        .catch(err => { console.error('[IBGE]', err); citiesPromise = null; return [] as CityItem[]; });
    return citiesPromise;
}

// Pré-carregar ao importar o módulo
loadCities();

// ─── Helpers ─────────────────────────────────────────────────
function maskPhone(v: string): string {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
const unphone = (v: string) => v.replace(/\D/g, '');
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function validate(f: FormFields): FieldError {
    const e: FieldError = {};
    if (!f.name.trim()) e.name = 'Obrigatório';
    if (unphone(f.phone).length < 10) e.phone = 'Telefone inválido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email inválido';
    if (!f.company.trim()) e.company = 'Obrigatório';
    if (!f.city.trim()) e.city = 'Obrigatório';
    if (!f.segment.trim()) e.segment = 'Obrigatório';
    if (!f.contribution.trim()) e.contribution = 'Obrigatório';
    return e;
}

async function submitToRD(f: FormFields): Promise<void> {
    const p = new URLSearchParams();
    p.append('token_rdstation', '746f8889c28e428d94d1e60633d1f883');
    p.append('identificador', 'rx-solucoes-quero-ser-parceiro');
    p.append('name', f.name.trim());
    p.append('personal_phone', unphone(f.phone));
    p.append('email', f.email.trim());
    p.append('company', f.company.trim());
    p.append('city', f.city.trim());
    p.append('cf_segmento', f.segment.trim());
    p.append('cf_qual_solucao_sua_empresa_agrega_ao_mercado_farmaceutico', f.contribution.trim());
    if (f.partnerModel) p.append('cf_qual_modelo_de_parceria_se_adequa_melhor', f.partnerModel);
    
    // CAMPOS DE RASTREAMENTO E ANTI-SPAM RD
    p.append('c_utmz', '');
    p.append('traffic_source', '');
    p.append('client_id', '');
    p.append('_doe', '');
    p.append('privacy_data[browser]', navigator.userAgent); // O RD coleta o userAgent aqui
    p.append('emP7yF13ld', '');
    p.append('sh0uldN07ch4ng3', 'should_not_change');

    try {
        await fetch('https://www.rdstation.com.br/api/1.2/conversions', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: p.toString(),
        });
        // Com mode: 'no-cors', a resposta é "opaque" e não acessível.
        // O fetch só dará throw caso não haja conexão com a internet.
        // Como o payload já está chegando limpo no RD, podemos assumir sucesso!
    } catch (err) {
        console.error('[RD Station Error]', err);
        throw new Error('Falha na comunicação com o servidor RD Station.');
    }
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function PartnerModal() {
    const { isOpen, selectedPlan, closeModal } = usePartnerModal();
    const [form, setForm] = useState<FormFields>(INITIAL);
    const [errors, setErrors] = useState<FieldError>({});
    const [state, setState] = useState<ModalState>('form');
    const [serverErr, setServerErr] = useState('');
    const formRef = useRef(form);
    useEffect(() => { formRef.current = form; }, [form]);

    // ─── Cidades ─────────────────────────────────────────────
    const citiesRef = useRef<CityItem[]>(citiesCache || []);
    const [cityQuery, setCityQuery] = useState('');
    const [suggestions, setSuggestions] = useState<CityItem[]>([]);
    const [showDrop, setShowDrop] = useState(false);
    const [hlIdx, setHlIdx] = useState(-1);
    const cityRef = useRef<HTMLInputElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    // ─── Modelo de Parceria (dropdown customizado) ───────────
    const [showPlanDrop, setShowPlanDrop] = useState(false);
    const planBtnRef = useRef<HTMLButtonElement>(null);
    const planDropRef = useRef<HTMLDivElement>(null);

    // Garantir cidades carregadas
    useEffect(() => {
        if (citiesCache) { citiesRef.current = citiesCache; return; }
        loadCities().then(c => { citiesRef.current = c; });
    }, []);

    // Reset + pré-selecionar plano ao abrir
    useEffect(() => {
        if (!isOpen) return;
        setTimeout(() => {
            setForm({ ...INITIAL, partnerModel: selectedPlan });
            setErrors({});
            setState('form');
            setServerErr('');
            setCityQuery('');
            setSuggestions([]);
            setShowDrop(false);
            setShowPlanDrop(false);
        }, 0);
    }, [isOpen, selectedPlan]);

    // Lock body scroll + ESC
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showDrop) setShowDrop(false);
                else if (showPlanDrop) setShowPlanDrop(false);
                else closeModal();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
    }, [isOpen, closeModal, showDrop, showPlanDrop]);

    // Fechar dropdowns ao clicar fora
    useEffect(() => {
        if (!showDrop && !showPlanDrop) return;
        const h = (e: MouseEvent) => {
            const t = e.target as Node;
            if (showDrop && cityRef.current && !cityRef.current.contains(t) &&
                dropRef.current && !dropRef.current.contains(t))
                setShowDrop(false);
            if (showPlanDrop && planBtnRef.current && !planBtnRef.current.contains(t) &&
                planDropRef.current && !planDropRef.current.contains(t))
                setShowPlanDrop(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [showDrop, showPlanDrop]);

    // ─── Handlers ────────────────────────────────────────────
    const onChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: name === 'phone' ? maskPhone(value) : value }));
        setErrors(p => ({ ...p, [name]: undefined }));
    }, []);

    const filterCities = useCallback((q: string) => {
        if (citiesRef.current.length === 0) { setSuggestions([]); return; }
        if (q.length === 0) {
            // Sem query: mostra as primeiras cidades
            setSuggestions(citiesRef.current.slice(0, 8));
        } else {
            const n = norm(q);
            // Filtra por startsWith no nome da cidade (antes do " - ")
            setSuggestions(
                citiesRef.current.filter(c => {
                    const cityName = c.label.split(' - ')[0];
                    return norm(cityName).startsWith(n);
                }).slice(0, 8)
            );
        }
        setHlIdx(-1);
    }, []);

    const onCityInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setCityQuery(v);
        // Limpa a seleção real – o form.city só é setado ao selecionar da lista
        setForm(p => ({ ...p, city: '' }));
        setErrors(p => ({ ...p, city: undefined }));
        setShowDrop(true);
        filterCities(v);
    }, [filterCities]);

    const pickCity = useCallback((c: CityItem) => {
        setForm(p => ({ ...p, city: c.label }));
        setCityQuery(c.label);
        setShowDrop(false);
        setSuggestions([]);
        setErrors(p => ({ ...p, city: undefined }));
    }, []);

    // Ao perder o foco, reverte para o valor selecionado (impede texto livre)
    const onCityBlur = useCallback(() => {
        // Pequeno delay para permitir clique nos items
        setTimeout(() => {
            setCityQuery(formRef.current.city);
            // Se não havia seleção, limpa
            if (!formRef.current.city) setCityQuery('');
        }, 150);
    }, []);

    const onCityKey = useCallback((e: React.KeyboardEvent) => {
        if (!showDrop || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setHlIdx(i => i < suggestions.length - 1 ? i + 1 : 0); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setHlIdx(i => i > 0 ? i - 1 : suggestions.length - 1); }
        else if (e.key === 'Enter' && hlIdx >= 0) { e.preventDefault(); pickCity(suggestions[hlIdx]); }
    }, [showDrop, suggestions, hlIdx, pickCity]);

    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setState('submitting');
        setServerErr('');
        try { await submitToRD(form); setState('success'); }
        catch { setServerErr('Ocorreu um erro ao enviar. Tente novamente.'); setState('error'); }
    }, [form]);

    // ─── Classes comuns ──────────────────────────────────────
    const inputCls = (err?: string) =>
        `w-full rounded-xl bg-white/5 border px-4 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_0_15px_rgba(139,92,246,0.1)] ${
            err ? 'border-red-500/50' : 'border-white/10 focus:border-primary-500/50'
        }`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/75 backdrop-blur-xl cursor-pointer"
                        onClick={closeModal}
                    />

                    {/* Card */}
                    <motion.div
                        key="card" role="dialog" aria-modal="true" aria-labelledby="pm-title"
                        initial={{ opacity: 0, scale: 0.88, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                        className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_32px_80px_rgba(0,0,0,0.85)] flex flex-col overflow-visible max-h-[calc(100vh-2rem)] sm:max-h-none"
                    >
                        {/* Glows */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary-500/15 blur-[80px] rounded-full pointer-events-none" />

                        {/* Close */}
                        <button onClick={closeModal} className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer" aria-label="Fechar">
                            <X size={16} />
                        </button>

                        <AnimatePresence mode="wait">
                            {/* ═══ FORMULÁRIO ═══ */}
                            {(state === 'form' || state === 'error') && (
                                <motion.div key="f" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="px-7 pt-6 pb-7 sm:px-10 sm:pt-7 sm:pb-8 overflow-y-auto sm:overflow-visible">
                                    {/* Header */}
                                    <div className="flex items-center gap-3.5 mb-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/10">
                                            <Handshake size={20} className="text-primary-400" />
                                        </div>
                                        <div>
                                            <h2 id="pm-title" className="text-xl font-bold text-white tracking-tight leading-tight">Seja um Parceiro RX</h2>
                                            <p className="text-xs text-white/40 font-light">Faça parte do ecossistema e amplie suas oportunidades</p>
                                        </div>
                                    </div>

                                    {/* Erro servidor */}
                                    <AnimatePresence>
                                        {serverErr && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-400 mt-3">
                                                <AlertCircle size={14} className="shrink-0" />
                                                <p className="text-xs font-medium">{serverErr}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={onSubmit} noValidate className="mt-5 space-y-5">
                                        {/* Linha 1: Nome + Telefone */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <F label="Nome" err={errors.name}>
                                                <input name="name" type="text" placeholder="Seu nome completo" value={form.name} onChange={onChange} autoComplete="name" className={inputCls(errors.name)} />
                                            </F>
                                            <F label="Telefone" err={errors.phone}>
                                                <input name="phone" type="tel" placeholder="(XX) XXXXX-XXXX" value={form.phone} onChange={onChange} autoComplete="tel" className={inputCls(errors.phone)} />
                                            </F>
                                        </div>

                                        {/* Linha 2: Email + Empresa */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <F label="Email" err={errors.email}>
                                                <input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={onChange} autoComplete="email" className={inputCls(errors.email)} />
                                            </F>
                                            <F label="Empresa" err={errors.company}>
                                                <input name="company" type="text" placeholder="Nome da empresa" value={form.company} onChange={onChange} autoComplete="organization" className={inputCls(errors.company)} />
                                            </F>
                                        </div>

                                        {/* Linha 3: Cidade (autocomplete) + Segmento */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <F label="Cidade" err={errors.city}>
                                                <div className="relative">
                                                    <input
                                                        ref={cityRef}
                                                        name="city"
                                                        type="text"
                                                        placeholder="Buscar cidade..."
                                                        value={cityQuery}
                                                        onChange={onCityInput}
                                                        onFocus={() => { filterCities(cityQuery); setShowDrop(true); }}
                                                        onBlur={onCityBlur}
                                                        onKeyDown={onCityKey}
                                                        autoComplete="off"
                                                        className={inputCls(errors.city)}
                                                    />
                                                    <AnimatePresence>
                                                        {showDrop && suggestions.length > 0 && (
                                                            <motion.div
                                                                ref={dropRef}
                                                                initial={{ opacity: 0, y: -4 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -4 }}
                                                                transition={{ duration: 0.12 }}
                                                                className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-white/10 bg-zinc-900 shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden max-h-[200px] overflow-y-auto"
                                                            >
                                                                {suggestions.map((c, i) => (
                                                                    <button
                                                                        key={c.label}
                                                                        type="button"
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                        onClick={() => pickCity(c)}
                                                                        onMouseEnter={() => setHlIdx(i)}
                                                                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors cursor-pointer ${i === hlIdx ? 'bg-primary-600/20 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                                                    >
                                                                        {hlText(c.label, cityQuery)}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </F>
                                            <F label="Qual seu segmento?" err={errors.segment}>
                                                <input name="segment" type="text" placeholder="Ex: Tecnologia, Saúde..." value={form.segment} onChange={onChange} className={inputCls(errors.segment)} />
                                            </F>
                                        </div>

                                        {/* Linha 4: Contribuição + Modelo de parceria */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <F label="Como você pode contribuir com o ecossistema RX?" err={errors.contribution}>
                                                <input name="contribution" type="text" placeholder="Descreva brevemente..." value={form.contribution} onChange={onChange} className={inputCls(errors.contribution)} />
                                            </F>
                                            <F label="Qual modelo de parceria?">
                                                <div className="relative">
                                                    <button
                                                        ref={planBtnRef}
                                                        type="button"
                                                        onClick={() => setShowPlanDrop(p => !p)}
                                                        className={`${inputCls()} text-left cursor-pointer pr-10 flex items-center`}
                                                    >
                                                        <span className={form.partnerModel ? 'text-white' : 'text-white/25'}>
                                                            {form.partnerModel || 'Selecione'}
                                                        </span>
                                                    </button>
                                                    <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none transition-transform duration-200 ${showPlanDrop ? 'rotate-180' : ''}`} />
                                                    <AnimatePresence>
                                                        {showPlanDrop && (
                                                            <motion.div
                                                                ref={planDropRef}
                                                                initial={{ opacity: 0, y: -4 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -4 }}
                                                                transition={{ duration: 0.12 }}
                                                                className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-white/10 bg-zinc-900 shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden"
                                                            >
                                                                {PLAN_OPTIONS.map(o => (
                                                                    <button
                                                                        key={o}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setForm(p => ({ ...p, partnerModel: o }));
                                                                            setShowPlanDrop(false);
                                                                        }}
                                                                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors cursor-pointer flex items-center justify-between ${
                                                                            form.partnerModel === o
                                                                                ? 'bg-primary-600/20 text-white'
                                                                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                                        }`}
                                                                    >
                                                                        {o}
                                                                        {form.partnerModel === o && <Check size={14} className="text-primary-400" />}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </F>
                                        </div>

                                        {/* Botão */}
                                        <button type="submit" className="group w-full relative overflow-hidden rounded-xl bg-primary-600 py-3.5 text-[13px] font-bold tracking-wide text-white transition-all duration-300 hover:bg-primary-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] active:scale-[0.98] cursor-pointer mt-2">
                                            <span className="flex items-center justify-center gap-2">
                                                <Send size={15} className="group-hover:translate-x-0.5 transition-transform" />
                                                Solicitar Parceria
                                            </span>
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* ═══ ENVIANDO ═══ */}
                            {state === 'submitting' && (
                                <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-4 p-16 min-h-[340px]">
                                    <Loader2 className="w-11 h-11 text-primary-400 animate-spin" />
                                    <p className="text-white/70 font-medium tracking-wide text-sm">Enviando seu cadastro…</p>
                                </motion.div>
                            )}

                            {/* ═══ SUCESSO ═══ */}
                            {state === 'success' && (
                                <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center text-center p-10 sm:p-12">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1, stiffness: 300, damping: 20 }} className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.25)]">
                                        <CheckCircle2 size={36} className="text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                    </motion.div>
                                    <h2 className="text-xl font-extrabold text-white tracking-tight mb-2">Cadastro recebido!</h2>
                                    <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto mb-8">Em breve nosso time entrará em contato para seguirmos com os próximos passos.</p>
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                                    <button onClick={closeModal} className="w-full max-w-xs rounded-xl bg-primary-600 py-3 text-sm font-bold text-white hover:bg-primary-500 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)] active:scale-[0.98] transition-all cursor-pointer">OK, Entendido</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ─── Sub-componentes ─────────────────────────────────────────
function F({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-white/50">{label}</label>
            {children}
            {err && <span className="text-[11px] text-red-400 leading-tight">{err}</span>}
        </div>
    );
}

function hlText(label: string, query: string) {
    if (!query) return <span>{label}</span>;
    const idx = norm(label).indexOf(norm(query));
    if (idx === -1) return <span>{label}</span>;
    return <span>{label.slice(0, idx)}<span className="text-primary-400 font-semibold">{label.slice(idx, idx + query.length)}</span>{label.slice(idx + query.length)}</span>;
}
