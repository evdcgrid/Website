import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "pt";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "evdcgrid-language";

const pageTranslations: Record<string, string> = {
  "DC Public Lighting Grid": "Rede DC de Iluminacao Publica",
  "DC EV Charging Hub": "Hub DC de Carregamento EV",
  "DC for Energy Communities": "DC para Comunidades de Energia",
  "Public infrastructure": "Infraestrutura publica",
  "Charging infrastructure": "Infraestrutura de carregamento",
  "Local energy systems": "Sistemas locais de energia",
  "View architecture": "Ver arquitetura",
  "Map Explorer": "Explorador de mapa",
  "Case Study": "Caso de estudo",
  "Problem": "Problema",
  "DC Approach": "Abordagem DC",
  "Electrical Architecture": "Arquitetura eletrica",
  "Technical description": "Descricao tecnica",
  "Technical scope": "Ambito tecnico",
  "Outcome": "Resultado",
  "What this enables": "O que isto permite",
  "Partners": "Parceiros",
  "Ideal partners": "Parceiros ideais",
  "Pilot / Deployment Requirements": "Requisitos de piloto / implementacao",
  "Typical pilot requirements": "Requisitos tipicos de piloto",
  "Explore DC applications": "Explorar aplicacoes DC",
  "Next step": "Proximo passo",
  "See the potential of the solution in each municipality.": "Ver o potencial da solucao em cada municipio.",
  "Open Map Explorer": "Abrir explorador de mapa",
  "Compare the DC deployment model with conventional AC works.": "Comparar o modelo de implementacao DC com obras AC convencionais.",
  "View Case Study": "Ver caso de estudo",
  "Convert existing public lighting circuits into a monitored bipolar DC infrastructure layer for street lighting, distributed EV charging and future urban energy assets.": "Converter circuitos existentes de iluminacao publica numa camada de infraestrutura DC bipolar monitorizada para iluminacao, carregamento EV distribuido e futuros ativos urbanos de energia.",
  "Urban electrification needs faster infrastructure deployment.": "A eletrificacao urbana precisa de implementacao de infraestrutura mais rapida.",
  "Cities need to expand EV charging, modernize public lighting and prepare for new electrified loads. However, conventional deployment often depends on new cables, civil works, grid reinforcement and long approval cycles.": "As cidades precisam de expandir o carregamento EV, modernizar a iluminacao publica e preparar novas cargas eletrificadas. No entanto, a implementacao convencional depende frequentemente de novos cabos, obras civis, reforco de rede e ciclos longos de aprovacao.",
  "Slow EV charging rollout": "Implementacao lenta de carregamento EV",
  "Underused public infrastructure": "Infraestrutura publica subutilizada",
  "Limited local visibility": "Visibilidade local limitada",
  "A controlled DC layer using existing public lighting assets.": "Uma camada DC controlada usando ativos existentes de iluminacao publica.",
  "Reuse of existing cables and grid assets": "Reutilizacao de cabos e ativos de rede existentes",
  "Central AC/DC conversion cabinet": "Armario central de conversao AC/DC",
  "Galvanic isolation and protection": "Isolamento galvanico e protecao",
  "Monitoring and control of the converted circuit": "Monitorizacao e controlo do circuito convertido",
  "Future integration with storage, PV or other DC assets": "Integracao futura com armazenamento, PV ou outros ativos DC",
  "Faster urban charging deployment": "Implementacao mais rapida de carregamento urbano",
  "Shared infrastructure layer": "Camada de infraestrutura partilhada",
  "Higher control and monitoring": "Maior controlo e monitorizacao",
  "Future-ready public infrastructure": "Infraestrutura publica preparada para o futuro",
  "Municipalities": "Municipios",
  "DSOs": "ORD",
  "CPOs": "CPOs",
  "One selected public lighting circuit": "Um circuito de iluminacao publica selecionado",
  "Access to the local low-voltage connection point": "Acesso ao ponto local de ligacao em baixa tensao",
  "Existing lighting assets suitable for LED replacement": "Ativos de iluminacao existentes adequados para substituicao por LED",
  "Location for the EVDCGrid conversion cabinet": "Local para o armario de conversao EVDCGrid",
  "Technical coordination with the municipality and DSO": "Coordenacao tecnica com o municipio e o ORD",
  "Optional EV charging points, storage or PV integration": "Pontos opcionais de carregamento EV, armazenamento ou integracao PV",
  "Want to test DC public infrastructure in your municipality?": "Quer testar infraestrutura publica DC no seu municipio?",
  "Discuss a Pilot": "Discutir um piloto",
  "Contact EVDCGrid": "Contactar a EVDCGrid",
  "Fast charging creates high local power demand.": "O carregamento rapido cria elevada procura local de potencia.",
  "High peak demand": "Elevada procura de pico",
  "Duplicated conversion hardware": "Hardware de conversao duplicado",
  "Difficult expansion": "Expansao dificil",
  "A shared DC bus for centralized power management.": "Um barramento DC partilhado para gestao centralizada de potencia.",
  "Common DC bus for multiple chargers": "Barramento DC comum para varios carregadores",
  "Centralized AC/DC conversion": "Conversao AC/DC centralizada",
  "Battery-ready architecture": "Arquitetura preparada para baterias",
  "Dynamic power allocation": "Alocacao dinamica de potencia",
  "Modular charger expansion": "Expansao modular de carregadores",
  "Lower grid stress": "Menor stress na rede",
  "Modular expansion": "Expansao modular",
  "Higher energy efficiency": "Maior eficiencia energetica",
  "Storage and renewables ready": "Preparado para armazenamento e renovaveis",
  "Fleet operators": "Operadores de frotas",
  "Service areas and parking operators": "Areas de servico e operadores de estacionamento",
  "Discuss a Charging Hub": "Discutir um hub de carregamento",
  "Energy communities need simpler local energy sharing.": "As comunidades de energia precisam de partilha local mais simples.",
  "Fragmented local assets": "Ativos locais fragmentados",
  "Unnecessary grid exchanges": "Trocas desnecessarias com a rede",
  "Complex community growth": "Crescimento complexo da comunidade",
  "A shared DC layer for local energy coordination.": "Uma camada DC partilhada para coordenacao local de energia.",
  "Shared DC infrastructure layer": "Camada partilhada de infraestrutura DC",
  "PV and battery integration": "Integracao de PV e baterias",
  "EV charging and flexible load connection": "Ligacao de carregamento EV e cargas flexiveis",
  "Local monitoring and control": "Monitorizacao e controlo locais",
  "Modular expansion points": "Pontos de expansao modular",
  "Reduced unnecessary power exchanges": "Reducao de trocas de potencia desnecessarias",
  "Better local energy use": "Melhor utilizacao local de energia",
  "Smarter energy sharing": "Partilha de energia mais inteligente",
  "Easier community growth": "Crescimento da comunidade mais simples",
  "More resilient local infrastructure": "Infraestrutura local mais resiliente",
  "Energy communities": "Comunidades de energia",
  "Campuses and industrial parks": "Campi e parques industriais",
  "Local generation asset, such as PV": "Ativo local de producao, como PV",
  "Optional battery storage": "Armazenamento por bateria opcional",
  "Defined community or campus boundary": "Limite definido da comunidade ou campus",
  "Discuss an Energy Community Pilot": "Discutir um piloto de comunidade de energia",
  "Areeiro, Lisbon": "Areeiro, Lisboa",
  "Areeiro Neighbourhood": "Bairro do Areeiro",
  "Comparative cost analysis between traditional AC public lighting infrastructure and the DC Grid system, demonstrating significant savings in civil works and installation.": "Analise comparativa de custos entre infraestrutura tradicional AC de iluminacao publica e o sistema DC Grid, demonstrando poupancas significativas em obras civis e instalacao.",
  "Total AC Cost": "Custo total AC",
  "Traditional system": "Sistema tradicional",
  "Total DC Cost": "Custo total DC",
  "DC Grid system": "Sistema DC Grid",
  "Savings": "Poupanca",
  "saved": "poupados",
  "Traditional AC System": "Sistema AC tradicional",
  "Conventional infrastructure": "Infraestrutura convencional",
  "Works": "Obras",
  "Installation": "Instalacao",
  "Components": "Componentes",
  "DC Grid Advantages": "Vantagens do DC Grid",
  "No excavation - full elimination of civil works": "Sem escavacao - eliminacao total de obras civis",
  "Faster and less disruptive installation": "Instalacao mais rapida e menos disruptiva",
  "Lower licensing and project design costs": "Custos mais baixos de licenciamento e projeto",
  "Modular and scalable infrastructure": "Infraestrutura modular e escalavel",
  "Explore Portugal": "Explorar Portugal",
  "Navigate the map to select a district, municipality, and parish.": "Navegue no mapa para selecionar um distrito, municipio e freguesia.",
  "Select a district on the map": "Selecione um distrito no mapa",
  "Select a municipality on the map": "Selecione um municipio no mapa",
  "Select a parish on the map": "Selecione uma freguesia no mapa",
  "New search": "Nova pesquisa",
  "Loading municipalities...": "A carregar municipios...",
  "Loading parishes...": "A carregar freguesias...",
  "Loading parish data...": "A carregar dados da freguesia...",
  "Error loading data. Please try again.": "Erro ao carregar dados. Tente novamente.",
  "Lighting Overview": "Visao geral da iluminacao",
  "Total Luminaires": "Total de luminarias",
  "Percentage of LEDs": "Percentagem de LEDs",
  "Annual LED Energy Savings": "Poupanca anual de energia LED",
  "EV Charging Capacity": "Capacidade de carregamento EV",
  "AC Chargers Possible Now": "Carregadores AC possiveis agora",
  "EV Chargers with DC Solution": "Carregadores EV com solucao DC",
  "Increase in Chargers": "Aumento de carregadores",
  "Power & Infrastructure": "Potencia e infraestrutura",
  "Current AC Power Available": "Potencia AC atual disponivel",
  "Additional DC Power Capacity": "Capacidade adicional de potencia DC",
  "Number of Racks Required": "Numero de racks necessarios",
  "Financial Comparison": "Comparacao financeira",
  "Traditional AC Investment Cost": "Investimento tradicional AC",
  "DC Solution Investment": "Investimento da solucao DC",
  "Savings vs Traditional AC": "Poupanca vs AC tradicional",
  "Page not found": "Pagina nao encontrada",
  "Oops! Page not found": "Pagina nao encontrada",
  "Return to Home": "Voltar ao inicio",
};

const reversePageTranslations = Object.fromEntries(
  Object.entries(pageTranslations).map(([english, portuguese]) => [portuguese, english])
) as Record<string, string>;

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const translateTextNodes = (language: Language) => {
  if (typeof document === "undefined") return;
  const translations = language === "pt" ? pageTranslations : reversePageTranslations;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  nodes.forEach((node) => {
    const normalized = normalizeText(node.nodeValue ?? "");
    const translated = translations[normalized];
    if (translated) {
      node.nodeValue = translated;
    }
  });
};

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "pt" ? "pt" : "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-PT" : "en";
    window.requestAnimationFrame(() => translateTextNodes(language));
  }, [language]);

  useEffect(() => {
    if (typeof MutationObserver === "undefined") return undefined;
    const observer = new MutationObserver(() => translateTextNodes(language));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return value;
};

export const commonText = {
  en: {
    navigation: "Navigation",
    projects: "Projects",
    contact: "Contact",
    home: "Home",
    technology: "Technology",
    about: "About Us",
    contactUs: "Contact Us",
    location: "Lisbon, Portugal",
    rights: "All rights reserved.",
    footerDescription:
      "DC-based infrastructure solutions for renewables, storage, public lighting, EV charging and flexible loads.",
    languageLabel: "Language",
    switchToEnglish: "Switch language to English",
    switchToPortuguese: "Switch language to Portuguese",
    projectTitles: {
      publicLighting: "DC Public Lighting Grid",
      chargingHub: "DC EV Charging Hub",
      energyCommunities: "DC for Energy Communities",
    },
  },
  pt: {
    navigation: "Navegacao",
    projects: "Projetos",
    contact: "Contacto",
    home: "Inicio",
    technology: "Tecnologia",
    about: "Sobre Nos",
    contactUs: "Contactos",
    location: "Lisboa, Portugal",
    rights: "Todos os direitos reservados.",
    footerDescription:
      "Solucoes de infraestrutura em corrente continua para renovaveis, armazenamento, iluminacao publica, carregamento de veiculos eletricos e cargas flexiveis.",
    languageLabel: "Idioma",
    switchToEnglish: "Mudar idioma para ingles",
    switchToPortuguese: "Mudar idioma para portugues",
    projectTitles: {
      publicLighting: "Rede DC de Iluminacao Publica",
      chargingHub: "Hub DC de Carregamento EV",
      energyCommunities: "DC para Comunidades de Energia",
    },
  },
} as const;
