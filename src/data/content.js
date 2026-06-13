import {
  Brain,
  Car,
  CheckCircle2,
  Cpu,
  Github,
  Layers3,
  Linkedin,
  Mail,
  Mic,
  PenSquare,
  ShieldCheck,
  Sparkles,
  Twitter,
  Wind,
  Zap,
} from 'lucide-react';

// Primary download destination.
// TODO: replace '#' with the real App Store / TestFlight URL at launch.
export const APP_STORE_URL = '#';

// When MILO was first built and used daily by its maker.
export const MONTHS_IN_USE = 8;

export const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Story', href: '#story' },
  { label: 'Help', href: '#help' },
  { label: 'FAQ', href: '#faq' },
];

export const heroChecklist = [
  { label: 'Hands-free via Siri — no app to open', icon: CheckCircle2 },
  { label: 'CarPlay-optimized answers', icon: CheckCircle2 },
  { label: '8 providers, 200+ models', icon: CheckCircle2 },
];

export const heroBadges = [
  { label: 'iOS 17.6+' },
  { label: 'TestFlight beta open' },
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
      'OpenAI, Claude, Gemini, Mistral, Groq, OpenRouter (200+ models), Apple Intelligence on-device, and local Ollama. You bring your own keys and switch by voice.',
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
    question: 'Where does it run?',
    answer:
      'iPhone and CarPlay on iOS 17.6+. It’s in TestFlight beta now, with the App Store release coming soon.',
  },
];

export const socialLinks = [
  { label: 'Twitter', href: 'https://twitter.com/luongnv89', icon: Twitter },
  { label: 'GitHub', href: 'https://github.com/luongnv89', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/luongnv89', icon: Linkedin },
  { label: 'Blog', href: 'https://medium.com/@luongnv89', icon: PenSquare },
  { label: 'Email', href: 'mailto:luongnv89@gmail.com', icon: Mail },
];
