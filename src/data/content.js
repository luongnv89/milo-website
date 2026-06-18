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

export const navLinks = [
  { label: 'Features', href: '#features' },
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
  { label: 'Hands-free via Siri — no app to open', icon: CheckCircle2 },
  { label: 'CarPlay-optimized answers', icon: CheckCircle2 },
  { label: '8 providers, 200+ models', icon: CheckCircle2 },
];

export const heroBadges = [
  { label: 'iOS 17.6+' },
  { label: 'On the App Store' },
  { label: `Built & used daily for ${MONTHS_IN_USE} months` },
];

export const featureCards = [
  {
    title: 'Talk to any AI, hands-free',
    description:
      'Say “Hey Siri, ask MILO…” from the lock screen, your headphones, or the car. iOS only lets Siri listen system-wide — MILO hands that voice off to the model you choose.',
    icon: Mic,
  },
  {
    title: 'Made for the car',
    description:
      'CarPlay mode automatically keeps answers short and spoken, so you get a real AI answer without taking your eyes off the road.',
    icon: Car,
  },
  {
    title: '8 providers, your keys',
    description:
      'Use the model that’s best for the question — and switch by voice mid-conversation. Eight providers, 200+ models, plus on-device Apple Intelligence and local Ollama. Bring your own keys.',
    icon: Layers3,
  },
  {
    title: 'Private by default',
    description:
      'Keys live in the iOS Keychain. Conversations stay on your device with SwiftData. No accounts, no analytics on your prompts — only the provider you pick ever sees them.',
    icon: ShieldCheck,
  },
];

// Slim comparison: what only MILO does on iOS, vs. the standalone AI apps.
export const comparisonRows = [
  {
    feature: 'Invoke by voice, system-wide (no app to open)',
    milo: 'Yes — through Siri',
    others: 'No — you must open the app first',
  },
  {
    feature: 'Short, spoken answers tuned for CarPlay',
    milo: 'Yes — automatic',
    others: 'No',
  },
  {
    feature: 'Choice of AI provider & model',
    milo: '8 providers, 200+ models',
    others: 'Locked to one model family',
  },
  {
    feature: 'Bring your own API keys',
    milo: 'Yes — stored in Keychain',
    others: 'Subscription only',
  },
];

// PAS "agitate" beat — sits between the hero and the feature list so the
// features land as relief, not just a spec sheet.
export const problemSection = {
  eyebrow: 'The problem',
  title: 'You already talk to your phone. It just talks back badly.',
  paragraphs: [
    'Ask Siri something real and you get “here’s what I found on the web.” So you glance down, tap, and read — exactly what you couldn’t do with your hands on the wheel.',
    'The smart models that could actually answer are locked behind taps you can’t make while driving, walking, or carrying groceries. The one assistant you can trigger by voice is the one that gives up first.',
  ],
};

export const founderStory = {
  eyebrow: 'Why I built MILO',
  name: 'Luong',
  paragraphs: [
    'I built MILO for myself. On iOS, Siri has something no other assistant has — true hands-free, system-wide voice. The catch is that Siri just isn’t very smart. The models I actually rely on every day — GPT, Claude, Gemini — are brilliant, but they’re locked behind taps. You can’t reach them with your hands on the wheel.',
    `So last October I wired Siri to those models and started using it every single day — in the car, on walks, with my hands full. I wasn’t planning to release it.`,
    'I changed my mind when it became clear the smarter, AI-powered Siri many of us were waiting for kept slipping — and that the wait looked especially long here in the EU. I’d rather hand you the bridge today than keep waiting for it. That’s MILO.',
  ],
  signoff: '— Luong, maker of MILO',
};

export const instructionFlow = {
  title: 'How to talk to MILO',
  description:
    'Always do it in two moves: wake Siri, then hand off to MILO. The pause is what tells Siri to open the app instead of calling a contact named “Milo”.',
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

// In-app screenshots, grouped by theme. File names map exactly (case included)
// to the PNGs in public/1.0.0/ — GitHub Pages serves from a case-sensitive
// filesystem, so the `.PNG` extension must match byte-for-byte.
export const screenshotGroups = [
  {
    id: 'chat',
    title: 'Talk to any model, hands-free',
    description:
      'Ask by voice through Siri, switch models mid-conversation, and get short spoken answers tuned for the car.',
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
    id: 'history',
    title: 'Every conversation, kept on device',
    description:
      'Browse your full history with token counts, response times, and per-message cost — all stored locally.',
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
    title: 'Bring your own keys',
    description:
      'Configure eight providers, tune temperature and tokens per model, and keep keys encrypted in the iOS Keychain.',
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
  {
    id: 'guide',
    title: 'Find your way around',
    description:
      'A built-in guide for talking to Siri, plus a sidebar for history, help, and settings.',
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
    question: 'Why can’t I just use the ChatGPT or Claude apps with my voice?',
    answer:
      'On iOS, only Siri can be triggered hands-free, system-wide. Every other AI app needs you to open it first. MILO connects Siri’s exclusive voice access to the model you choose — so you can ask while driving, walking, or multitasking.',
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
      'MILO itself is free. You bring your own API keys, so you pay the providers directly — many have free tiers, and Apple Intelligence (on-device) and Ollama (local) cost nothing at all.',
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
