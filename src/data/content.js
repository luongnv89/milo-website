import {
  Brain,
  Bug,
  Car,
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

// Centralized primary CTA for consistency (used by AppStoreButton default + CTAs).
export const PRIMARY_CTA_LABEL = 'Download on the App Store';

export const PRICE_LINE = '$8.99 one-time · US price, Apple sets local pricing';

export const pricing = {
  eyebrow: 'Pricing',
  title: 'One purchase. No subscription.',
  price: '$8.99',
  priceLine: 'One-time purchase · US price, Apple sets local pricing',
  features: [
    'Unlimited conversations with any model',
    'Siri, CarPlay, lock screen and headphones',
    'GPT-5.5, Claude Opus 4.8, Gemini 3.5 Flash, Mistral, Groq, OpenRouter, Apple Intelligence',
    'Your keys, your data — nothing logged or sold',
  ],
  finePrint:
    'Cloud providers are billed by the provider on your own key — many have free tiers. On-device Apple Intelligence needs no key.',
};

export const heroContent = {
  eyebrow: 'For iPhone & CarPlay · iOS 17.6+',
  headline: 'Ask real AI through Siri. Hands-free.',
  emphasis: 'real AI',
  subhead:
    'Say “Hey Siri, ask MILO” from the lock screen, your headphones, or the car — and get a short spoken answer from GPT, Claude, Gemini, or 200+ other models. No app to open. No typing.',
};

export const navLinks = [
  { label: 'How it works', href: '#how' },
  { label: 'Models', href: '#models' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const footerLinks = {
  product: [
    { label: 'How it works', href: '#how' },
    { label: 'Screens', href: '#screens' },
    { label: 'Models', href: '#models' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Pricing', href: '#pricing' },
  ],
  company: [
    { label: 'Story', href: '#story' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Feedback', href: '#feedback' },
    { label: 'Changelog', href: 'changelog.html' },
  ],
  legal: [
    { label: 'Privacy Policy', href: 'privacy-policy.html' },
    { label: 'Terms of Service', href: 'terms.html' },
  ],
};

// Bugs and feature requests are filed as issues on the public GitHub repo
// that also hosts this site. Each card below deep-links to a guided issue
// form defined in .github/ISSUE_TEMPLATE/.
export const FEEDBACK_REPO = 'luongnv89/milo-website';
const FEEDBACK_ISSUE_URL = `https://github.com/${FEEDBACK_REPO}/issues/new`;

export const feedbackIntro = {
  eyebrow: 'Feedback',
  title: 'Help shape MILO',
  description:
    'MILO is built and used daily by one person. Bugs, ideas and questions go to a public GitHub issue tracker — each link below opens a pre-filled form. A free GitHub account is all you need.',
  repoUrl: `https://github.com/${FEEDBACK_REPO}`,
};

export const feedbackOptions = [
  {
    id: 'bug',
    icon: Bug,
    label: 'Report a bug',
    description: 'Something broken or behaving oddly? Tell me what happened.',
    href: `${FEEDBACK_ISSUE_URL}?template=bug_report.yml&labels=bug`,
  },
  {
    id: 'feature',
    icon: Lightbulb,
    label: 'Request a feature',
    description: 'Have an idea for a model, shortcut, or workflow? Pitch it.',
    href: `${FEEDBACK_ISSUE_URL}?template=feature_request.yml&labels=enhancement`,
  },
  {
    id: 'general',
    icon: MessageSquare,
    label: 'General feedback',
    description: 'Questions, praise, or anything that doesn’t fit the others.',
    href: `${FEEDBACK_ISSUE_URL}?template=feedback.yml`,
  },
];

export const featureCards = [
  {
    title: 'Ask by voice through Siri',
    description: 'The only system-wide, hands-free trigger on iOS, routed to the model you choose.',
    icon: Mic,
  },
  {
    title: 'Short spoken answers in the car',
    description: 'CarPlay mode keeps replies brief and reads them aloud, so your eyes stay on the road.',
    icon: Car,
  },
  {
    title: 'Any model, switched by voice',
    description: '7 providers and 200+ models, including on-device Apple Intelligence.',
    icon: Layers3,
  },
  {
    title: 'Private by design',
    description: 'Keys live in the iOS Keychain, history stays on-device, no accounts, no prompt analytics.',
    icon: ShieldCheck,
  },
];

export const featuresSection = {
  eyebrow: 'What you get',
  title: 'Built for the car. Private by default.',
};

// Comparison vs named competitors: MILO vs ChatGPT, Claude, Gemini on iPhone.
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
    milo: '7 providers, 200+ models',
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

export const problemSection = {
  eyebrow: 'The problem',
  quote: '“Here’s what I found on the web.”',
  title: 'Siri hears you. The real AI can’t.',
  body: 'Ask Siri anything real and you get a web search you have to glance down and tap. GPT, Claude, and Gemini are far smarter — but on iOS only Siri can be triggered hands-free, system-wide. MILO is the bridge: Siri’s voice, your model’s answer.',
};

// #24 requested a short founder video/voice clip narrating the "Hey Siri,
// ask MILO" flow. No real one exists yet — recording it requires the actual
// human founder, which is out of scope for an automated agent (fabricating
// one would be deceptive). Once a real, human-recorded clip exists, set
// `founderStory.videoUrl` (or `audioUrl` for a voice-only clip) to activate
// the <FounderClip> embed in FounderStory.jsx with zero further code
// changes. Optional companions: `videoPosterUrl`, `videoCaptionsUrl` (a
// .vtt file), `clipTranscript`, `clipLabel`.
export const founderStory = {
  eyebrow: 'Why I built MILO',
  name: 'Luong',
  photo: 'https://github.com/luongnv89.png',
  personalNote: 'If Siri has ever answered with a web search while your hands were full — that’s exactly why MILO exists. Built in public, used daily by one person.',
  paragraphs: [
    'On iOS, Siri has true hands-free, system-wide voice. No other assistant has that. The catch: Siri isn’t very smart. The models I rely on — GPT, Claude, Gemini — are locked behind taps you can’t make while driving.',
    `So I wired Siri to those models. I used it every day in the car and on the move. I wasn’t planning to release it.`,
    'The wait for a smarter built-in Siri kept slipping. I’d rather give you the bridge today: Siri voice to real AI. That’s MILO.',
  ],
  signoff: 'Luong, maker of MILO',
};

export const howItWorks = {
  eyebrow: 'How it works',
  title: 'Two words, then your question.',
  lead: 'Wake Siri, say “Ask MILO”, and Siri hands the conversation to the model you chose. The short pause keeps the trigger reliable.',
  steps: [
    { n: '01', title: '“Hey Siri”', text: 'Works from the lock screen, AirPods, or CarPlay.' },
    { n: '02', title: '“Ask MILO”', text: 'Siri hands off to MILO. Say your question.' },
    { n: '03', title: 'A spoken answer', text: 'Short, read aloud, from GPT, Claude, Gemini or 200+ models.' },
  ],
};

export const instructionFlow = {
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

export const screensSection = {
  eyebrow: 'The app',
  title: 'Everything else lives in the app.',
  lead: 'The core job is voice in, answer out. The screens below are where you pick models, add keys, and review history.',
};

// In-app screenshots, grouped by theme.
export const screenshotGroups = [
  {
    id: 'chat',
    title: 'Siri voice, real answer',
    description: 'Ask by voice through Siri and switch models mid-conversation — answers stay short and spoken.',
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
    title: 'Built-in Siri guide',
    description: 'Built-in guide for the two-step Siri handoff plus sidebar navigation.',
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
    title: 'On-device history',
    description: 'Full history with token counts and costs, stored locally.',
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
    title: 'Your keys and providers',
    description: 'Configure providers and tune settings — keys stay encrypted in the Keychain.',
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

export const modelsSection = {
  eyebrow: 'Models',
  title: 'Your keys. Any model. One voice.',
  lead: 'Pick from 7 providers, including on-device Apple Intelligence. Switch by voice mid-conversation. Only the provider you choose ever sees a prompt.',
};

export const providers = [
  {
    id: 'openai',
    title: 'OpenAI',
    icon: Zap,
    bullets: ['GPT-5.5, GPT-5.4 & mini', 'Strong all-round reasoning'],
  },
  {
    id: 'claude',
    title: 'Anthropic Claude',
    icon: Brain,
    bullets: ['Claude Opus 4.8, Sonnet 4.6, Haiku', 'Great for long, careful analysis'],
  },
  {
    id: 'gemini',
    title: 'Google Gemini',
    icon: Sparkles,
    bullets: ['Gemini 3.5 Flash & 3.1 Pro', 'Fast, with a generous free tier'],
  },
  {
    id: 'mistral',
    title: 'Mistral AI',
    icon: Wind,
    bullets: ['Large, Medium & Small', 'European, multiple sizes for cost'],
  },
  {
    id: 'groq',
    title: 'Groq',
    icon: Zap,
    bullets: ['Llama, GPT-OSS, Qwen, Kimi', 'Extremely fast inference'],
  },
  {
    id: 'openrouter',
    title: 'OpenRouter',
    icon: Layers3,
    bullets: ['200+ models behind one key', 'Many free models available'],
  },
  {
    id: 'apple',
    title: 'Apple Intelligence',
    icon: Cpu,
    bullets: ['On-device foundation model', 'No key, nothing leaves the phone'],
  },
  {
    id: 'ollama',
    title: 'Ollama (Local)',
    icon: Cpu,
    comingSoon: true,
    bullets: ['Coming soon — not in this release', 'Local models when it ships'],
  },
];

export const comparisonSection = {
  eyebrow: 'Compared',
  title: 'The apps are smart. They just can’t hear you.',
  lead: 'On iPhone, ChatGPT, Claude and Gemini all need a tap first.',
};

export const faqItems = [
  {
    question: 'Why can’t I just use the ChatGPT, Claude, or Gemini apps with my voice?',
    answer:
      'On iOS, only Siri can be triggered hands-free, system-wide. ChatGPT, Claude, and Gemini apps need you to open them first. MILO connects Siri’s exclusive voice access to any model you choose — ask while driving or hands full.',
  },
  {
    question: 'Which AI models can I use?',
    answer:
      'Seven providers you can use today: OpenAI (GPT-5.5), Anthropic (Claude Opus 4.8), Google (Gemini 3.5 Flash), Mistral, Groq, OpenRouter (200+ models), and Apple’s on-device Intelligence. Local Ollama is coming soon and is not available in this release. Switch between the shipped providers by voice.',
  },
  {
    question: 'How private is it?',
    answer:
      'Your API keys live in the iOS Keychain and your conversation history stays on your device with SwiftData. There are no accounts and no analytics on your prompts — only the provider you enable ever sees them. On-device Apple Intelligence does not send prompts to a third-party AI service.',
  },
  {
    question: 'Do I need my own API keys?',
    answer:
      'For the cloud providers, yes — that keeps costs transparent and under your control, and many offer generous free tiers. Apple Intelligence (on-device) needs no key.',
  },
  {
    question: 'Is it free?',
    answer:
      'MILO is a one-time purchase ($8.99 USD in the US; Apple sets the local price in your country — no subscriptions). Download the app and use Apple Intelligence where it is available — no API key needed. For cloud providers (OpenAI, Anthropic, Google, etc.), you bring your own keys and pay the providers directly — many offer generous free tiers.',
  },
  {
    question: 'How do I install MILO?',
    answer:
      'MILO is on the App Store — open the listing on your iPhone and tap Buy to download it like any other paid app. No invite or beta sign-up needed.',
  },
  {
    question: 'Where does it run?',
    answer: 'iPhone and CarPlay on iOS 17.6+. It’s available now on the App Store.',
  },
];

export const socialLinks = [
  { label: 'X', href: 'https://x.com/luongnv89', icon: Twitter },
  { label: 'GitHub', href: 'https://github.com/luongnv89', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/luongnv89', icon: Linkedin },
  { label: 'Blog', href: 'https://medium.com/@luongnv89', icon: PenSquare },
  { label: 'Email', href: 'mailto:luongnv89@gmail.com', icon: Mail },
];
