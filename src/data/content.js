import {
  Brain,
  Bug,
  Car,
  CheckCircle2,
  Cpu,
  Github,
  Layers3,
  Lightbulb,
  Linkedin,
  Mail,
  MessageSquare,
  Mic,
  PenSquare,
  ShieldCheck,
  Sparkles,
  Twitter,
  Wind,
  Zap,
} from 'lucide-react';

// Primary download destination — the public App Store listing.
export const APP_STORE_URL = 'https://apps.apple.com/app/ask-milo-ai-chat-assistant/id6780062368';

// When MILO was first built and used daily by its maker.
export const MONTHS_IN_USE = 8;

// Centralized primary CTA for consistency (used by AppStoreButton default + CTAs).
export const PRIMARY_CTA_LABEL = 'Download on the App Store';

// Paid path (#71): visible pricing, 7-day trial + lifetime unlock (no sub).
export const PRICING_OFFER =
  '7-day trial, then $39 lifetime unlock. Bring your own keys — no subscription.';

// Quantified hero for #72 (content-driven).
export const heroContent = {
  headline: 'Give Siri 200+ AI brains — hands-free in the car.',
  subhead:
    'The core job: wake Siri and ask real AI (GPT, Claude, Gemini, Apple Intelligence, or local). From lock screen, headphones, or CarPlay. No tapping.',
};

export const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Screens', href: '#screens' },
  { label: 'Story', href: '#story' },
  { label: 'Help', href: '#help' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Feedback', href: '#feedback' },
];

// Bugs and feature requests are filed as issues on the public GitHub repo
// that also hosts this site. Each card below deep-links to a guided issue
// form defined in .github/ISSUE_TEMPLATE/.
export const FEEDBACK_REPO = 'luongnv89/milo-website';
const FEEDBACK_ISSUE_URL = `https://github.com/${FEEDBACK_REPO}/issues/new`;

export const feedbackIntro = {
  title: 'Help shape MILO',
  description:
    'MILO is built and used daily by one person. Bugs, ideas, and questions go to a public GitHub issue tracker — pick a card and the form is pre-filled for you. A free GitHub account is all you need.',
  repoUrl: `https://github.com/${FEEDBACK_REPO}`,
};

export const feedbackOptions = [
  {
    id: 'bug',
    icon: Bug,
    label: 'Report a bug',
    description: 'Something broken or behaving oddly? Tell me what happened.',
    href: `${FEEDBACK_ISSUE_URL}?template=bug_report.yml&labels=bug`,
    gradient: 'from-rose-500 to-orange-500',
  },
  {
    id: 'feature',
    icon: Lightbulb,
    label: 'Request a feature',
    description: 'Have an idea for a model, shortcut, or workflow? Pitch it.',
    href: `${FEEDBACK_ISSUE_URL}?template=feature_request.yml&labels=enhancement`,
    gradient: 'from-milo-blue to-cyan-400',
  },
  {
    id: 'general',
    icon: MessageSquare,
    label: 'General feedback',
    description: 'Questions, praise, or anything that doesn’t fit the others.',
    href: `${FEEDBACK_ISSUE_URL}?template=feedback.yml`,
    gradient: 'from-violet-500 to-fuchsia-500',
  },
];

export const heroChecklist = [
  { label: 'Ask by voice via Siri — no app to open', icon: CheckCircle2 },
  { label: 'Short spoken answers in CarPlay', icon: CheckCircle2 },
  { label: 'Pick any of 8 providers (your keys)', icon: CheckCircle2 },
];

export const heroBadges = [
  { label: 'iOS 17.6+' },
  { label: 'On the App Store' },
  { label: `Built & used daily for ${MONTHS_IN_USE} months` },
];

export const featureCards = [
  {
    title: 'Ask by voice through Siri',
    description:
      'Say “Hey Siri, ask MILO…” from the lock screen, headphones, or car. The only system-wide hands-free trigger on iOS — MILO routes it to the real AI you choose.',
    icon: Mic,
  },
  {
    title: 'Get a short spoken answer',
    description:
      'CarPlay mode keeps answers brief and spoken automatically. A real AI response without touching the phone or taking eyes off the road.',
    icon: Car,
  },
  {
    title: 'Choose the model you need',
    description:
      'Switch providers and models by voice. 8 providers, 200+ models (plus Apple Intelligence and local Ollama). Bring your own keys.',
    icon: Layers3,
  },
  {
    title: 'Keep it private on device',
    description:
      'Keys in iOS Keychain. History stays local with SwiftData. No accounts or prompt analytics — only the provider you pick sees anything.',
    icon: ShieldCheck,
  },
];

// Comparison vs named competitors (#74): MILO vs ChatGPT, Claude, Gemini on iPhone.
// Refocused on core Siri job (#78): ask real AI hands-free. Advanced details subordinated.
export const comparisonRows = [
  {
    feature: 'Invoke by voice, system-wide (no app to open)',
    milo: 'Yes — through Siri',
    chatgpt: 'No — open app first',
    claude: 'No — open app first',
    gemini: 'No — open app first',
  },
  {
    feature: 'Short, spoken answers tuned for CarPlay',
    milo: 'Yes — automatic',
    chatgpt: 'Yes (iOS 26.4+)',
    claude: 'No',
    gemini: 'Limited',
  },
  {
    feature: 'Choice of AI provider & model',
    milo: '8 providers, 200+ models',
    chatgpt: 'OpenAI only',
    claude: 'Anthropic only',
    gemini: 'Google only',
  },
  {
    feature: 'Bring your own API keys',
    milo: 'Yes — Keychain',
    chatgpt: 'Subscription',
    claude: 'Account / sub',
    gemini: 'Account / sub',
  },
];

// PAS "agitate" beat — sits between the hero and the feature list so the
// features land as relief, not just a spec sheet.
export const problemSection = {
  eyebrow: 'The problem',
  title: 'Siri hears you. But the real AI can’t.',
  paragraphs: [
    'Ask Siri something real and you get “here’s what I found on the web.” You glance down, tap, read — exactly what you can’t do hands-free in the car or on the move.',
    'The smart models (GPT, Claude, Gemini) are locked behind taps. Siri is the only system-wide voice you can trigger — but it’s the one that gives up first. MILO is the bridge: Siri voice to real AI.',
  ],
};

export const founderStory = {
  eyebrow: 'Why I built MILO',
  name: 'Luong',
  paragraphs: [
    'On iOS, Siri has true hands-free, system-wide voice. No other assistant has that. The catch: Siri isn’t very smart. The models I rely on — GPT, Claude, Gemini — are locked behind taps you can’t make while driving.',
    `So I wired Siri to those models. I used it every day in the car and on the move. I wasn’t planning to release it.`,
    'The wait for a smarter built-in Siri kept slipping. I’d rather give you the bridge today: Siri voice to real AI. That’s MILO.',
  ],
  signoff: '— Luong, maker of MILO',
};

export const instructionFlow = {
  title: 'How to ask real AI via Siri',
  description:
    'Two moves: wake Siri, say “Ask MILO”. Siri hands off to the model you chose. The pause keeps the trigger reliable.',
  steps: [
    { speaker: 'user', text: 'Hey Siri' },
    { speaker: 'siri', text: 'Uh huh?' },
    { speaker: 'user', text: 'Ask MILO' },
    {
      speaker: 'siri',
      handoff: true,
      text: 'What is the prompt?',
      subtitle: '⚡️ MILO answers with the AI model you picked',
    },
    { speaker: 'user', text: 'What wine pairs with focaccia garlic bread?' },
    { speaker: 'siri', text: 'A crisp Vermentino or an herby Sauvignon Blanc keeps it bright.' },
  ],
  followUp:
    'Say “ask MILO” again to keep going — follow-ups remember the context. Short commands like “switch to Gemini” or “start a new chat” run before your next question.',
};

export const siriExamples = [
  {
    id: 'everyday',
    label: 'Everyday',
    items: [
      { prompt: 'Ask MILO → Give me a healthy breakfast recipe', helper: 'Cooking ideas' },
      { prompt: 'Ask MILO → Write an email about a meeting', helper: 'Writing help' },
      { prompt: 'Ask MILO → What’s 15% of 80?', helper: 'Quick calculations' },
    ],
  },
  {
    id: 'learning',
    label: 'Learning',
    items: [
      { prompt: 'Ask MILO → Explain quantum physics simply', helper: 'Learn topics out loud' },
      { prompt: 'Ask MILO → Give me an example', helper: 'Follow-ups keep context' },
      { prompt: 'Ask MILO → How is it different from JavaScript?', helper: 'Keep the thread going' },
    ],
  },
  {
    id: 'carplay',
    label: 'CarPlay',
    items: [
      { prompt: 'Ask MILO → Summarize the news', helper: 'Brief, spoken answers' },
      { prompt: 'Ask MILO → What’s the traffic like?', helper: 'Eyes on the road' },
      { prompt: 'Ask MILO → Find nearby gas stations', helper: 'Location-based help' },
    ],
  },
];

// In-app screenshots, grouped by theme (refocused on core Siri job #78).
// Power-user details (history, tuning) subordinated as supporting.
export const screenshotGroups = [
  {
    id: 'chat',
    title: 'Siri voice → real AI answer',
    description:
      'Ask by voice through Siri. Switch models mid-conversation. Short spoken answers tuned for the car.',
    shots: [
      {
        src: '1.0.0/car-play-mode.PNG',
        alt: 'MILO in CarPlay mode showing a hands-free chat answered by Gemini',
        caption: 'CarPlay mode — brief, spoken answers',
      },
      {
        src: '1.0.0/model-selection.PNG',
        alt: 'MILO model picker letting you choose between Google Gemini, Mistral AI, and OpenRouter models',
        caption: 'Switch models on the fly',
      },
    ],
  },
  {
    id: 'guide',
    title: 'How to ask via Siri',
    description:
      'Built-in guide for the two-step Siri handoff plus sidebar navigation.',
    shots: [
      {
        src: '1.0.0/help-guide.PNG',
        alt: 'MILO Help & Guide screen with example "Hey Siri, ask MILO" prompts',
        caption: 'Step-by-step Siri guide',
      },
      {
        src: '1.0.0/sidebar-menu.PNG',
        alt: 'MILO sidebar menu with History, Help & Guide, and Settings entries',
        caption: 'Sidebar navigation',
      },
    ],
  },
  {
    id: 'history',
    title: 'Power user: on-device history',
    description:
      'Full history with token counts and costs — stored locally (supporting the core flow).',
    shots: [
      {
        src: '1.0.0/history.PNG',
        alt: 'MILO history screen listing past conversations with the model used and response time',
        caption: 'Searchable conversation history',
      },
      {
        src: '1.0.0/detail-history-conversation.PNG',
        alt: 'MILO conversation detail showing provider, model, token usage, and estimated cost',
        caption: 'Per-conversation usage & cost',
      },
    ],
  },
  {
    id: 'providers',
    title: 'Power user: your keys & providers',
    description:
      'Configure providers and tune settings. Keys encrypted in Keychain (supporting the core flow).',
    shots: [
      {
        src: '1.0.0/setting-first.PNG',
        alt: 'MILO settings showing configured providers like Gemini, Mistral, and OpenRouter marked active',
        caption: 'Pick a default provider',
      },
      {
        src: '1.0.0/provider-setting-first.PNG',
        alt: 'MILO per-provider settings with model, temperature, max tokens, and system prompt controls',
        caption: 'Tune each model',
      },
      {
        src: '1.0.0/api-keys-management.PNG',
        alt: 'MILO API keys screen explaining keys are stored locally and encrypted in the iOS Keychain',
        caption: 'Keys stay in the Keychain',
      },
    ],
  },
];

export const providers = [
  {
    id: 'openai',
    title: 'OpenAI',
    color: 'text-green-400',
    icon: Zap,
    bullets: ['GPT-5.5, GPT-5.4 & mini', 'Strong all-round reasoning'],
  },
  {
    id: 'claude',
    title: 'Anthropic Claude',
    color: 'text-pink-400',
    icon: Brain,
    bullets: ['Claude Opus 4.8, Sonnet 4.6, Haiku', 'Great for long, careful analysis'],
  },
  {
    id: 'gemini',
    title: 'Google Gemini',
    color: 'text-blue-400',
    icon: Sparkles,
    bullets: ['Gemini 3.5 Flash & 3.1 Pro', 'Fast, with a generous free tier'],
  },
  {
    id: 'mistral',
    title: 'Mistral AI',
    color: 'text-orange-400',
    icon: Wind,
    bullets: ['Large, Medium & Small', 'European, multiple sizes for cost'],
  },
  {
    id: 'groq',
    title: 'Groq',
    color: 'text-red-400',
    icon: Zap,
    bullets: ['Llama, GPT-OSS, Qwen, Kimi', 'Extremely fast inference'],
  },
  {
    id: 'openrouter',
    title: 'OpenRouter',
    color: 'text-purple-400',
    icon: Layers3,
    bullets: ['200+ models behind one key', 'Many free models available'],
  },
  {
    id: 'apple',
    title: 'Apple Intelligence',
    color: 'text-slate-200',
    icon: Cpu,
    bullets: ['On-device foundation model', 'No key, nothing leaves the phone'],
  },
  {
    id: 'ollama',
    title: 'Ollama (Local)',
    color: 'text-teal-300',
    icon: Cpu,
    bullets: ['Run Llama, Mistral & more locally', 'Fully offline, fully private'],
  },
];

export const faqItems = [
  {
    question: 'Why can’t I just use the ChatGPT, Claude, or Gemini apps with my voice?',
    answer:
      'On iOS, only Siri can be triggered hands-free, system-wide. ChatGPT, Claude, and Gemini apps need you to open them first. MILO connects Siri’s exclusive voice access to any model you choose — ask while driving or hands full.',
  },
  {
    question: 'Which AI models can I use?',
    answer:
      'Eight providers: OpenAI (GPT-5.5), Anthropic (Claude Opus 4.8), Google (Gemini 3.5 Flash), Mistral, Groq, OpenRouter (200+ models), Apple’s on-device Intelligence, and local Ollama. Switch between them by voice.',
  },
  {
    question: 'How private is it?',
    answer:
      'Your API keys live in the iOS Keychain and your conversation history stays on your device with SwiftData. There are no accounts and no analytics on your prompts — only the provider you enable ever sees them. Apple Intelligence and Ollama never leave the phone at all.',
  },
  {
    question: 'Do I need my own API keys?',
    answer:
      'For the cloud providers, yes — that keeps costs transparent and under your control, and many offer generous free tiers. Apple Intelligence (on-device) and Ollama (local) need no key.',
  },
  {
    question: 'Is it free?',
    answer:
      'Download MILO free from the App Store with a 7-day trial. After trial, $39 one-time lifetime unlock. You bring your own API keys (pay providers directly — many free tiers); Apple Intelligence and Ollama stay free.',
  },
  {
    question: 'How do I install MILO?',
    answer:
      'MILO is on the App Store — open the listing on your iPhone and tap Get to download it like any other app. No invite or beta sign-up needed.',
  },
  {
    question: 'Where does it run?',
    answer:
      'iPhone and CarPlay on iOS 17.6+. It’s available now on the App Store.',
  },
];

export const socialLinks = [
  { label: 'X', href: 'https://x.com/luongnv89', icon: Twitter },
  { label: 'GitHub', href: 'https://github.com/luongnv89', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/luongnv89', icon: Linkedin },
  { label: 'Blog', href: 'https://medium.com/@luongnv89', icon: PenSquare },
  { label: 'Email', href: 'mailto:luongnv89@gmail.com', icon: Mail },
];
