import Animation from "./assets/Animation.gif";

export const site = {
  title: "Sai’s Page",
  tagline: "Dreaming in algorithms, building the future in code.",
  basePath: "/Info/",
  favicon: "/favicon.svg",
  pfp: "https://i.imgur.com/i2cw7NA.jpeg",
  email: "Nothing-nappudae@proton.me",
  socials: {
    github: "https://github.com/NothinReal",
    discord: "https://discord.gg/",
  },
  ctas: [
    { label: "Valorant", href: "https://playvalorant.com" },
    { label: "Chess", href: "https://www.chess.com" },
  ],
  sections: [
    { id: "home", label: "Home" },
    { id: "featured", label: "Featured" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "now", label: "Now" },
    { id: "reading", label: "Reading" },
    { id: "hobbies", label: "Hobbies" },
    { id: "contact", label: "Contact" },
  ],

  featured: [
    {
      title: 'Personal AI Notes Reader ("Eriski")',
      slug: "eriski",
      blurb:
        "SLM trained on my physics notes. Offline: Ollama + LangChain + ChromaDB.",
      tech: ["Python", "LangChain", "Ollama", "ChromaDB"],
      repo: "https://github.com/Nothing-nappudae/Eriski",
      more: "I made Eriski because I was tired of AI giving me copy-pasted textbook answers. So I trained my own — one that actually reads my physics notes and talks back like a study partner. It runs offline using Ollama + LangChain + ChromaDB, and it can explain derivations, laws, and even my own messy thought process from my notes.",
      media: Animation,
      mediaAlt: "Eriski demo animation",
    },
    {
      title: "Quest Manager Discord Bot",
      blurb:
        "A Quest Bot that manages quests and tracks the progress of server members.",
      tech: ["Node.js", "Discord.js", "SQLite"],
      repo: "https://github.com/Nothing-nappudae/Quest-Tracker",
      more: "This was one of my first real projects — the one that got me hooked on building. I started using JSON files to store quest data before I even knew what a real database was. That experience taught me how data persistence works, how to organize information efficiently, and how APIs tie everything together.",
    },
    {
      title: "Pendula",
      blurb:
        "An interactive Python simulator for visualizing Newtonian motion single and double pendulums built with NumPy and Matplotlib.",
      tech: ["Python", "Ton of maths"],
      repo: "https://github.com/Nothing-nappudae/Pendula",
      more: "Pendula is an Interactive Python-based pendulum Simulation for single and double pendulums that uses real-time numerical integrations such as Runge-Kutta and energy analysis.",
    },
  ],

  projects: [
    {
      title: "Discord Study Bot",
      blurb: "Pomodoro and reminders.",
      tech: ["Node"],
      repo: "REPO_LINK_STUDY",
      more: "Timer, DM reminders, and daily streaks.",
    },
    {
      title: "Valorant Aim Logger",
      blurb: "Logs aim drills.",
      tech: ["Python"],
      repo: "REPO_LINK_AIM",
      more: "CSV logs + charts; routine tracking.",
    },
    {
      title: "Finance Tracker",
      blurb: "Personal finance tracking bot.",
      tech: ["Python"],
      repo: "REPO_LINK_FIN",
      more: "Budgets, categories, monthly summary.",
    },
    {
      title: "More on the way",
      blurb: "Will update the repo links soon.",
      tech: ["TBD"],
      repo: "#",
    },
  ],

  now: {
    heading: "Currently Working On",
    text: `Jarvis — my ongoing personal AI assistant project built in Python. 
It’s in its early development stage, where I’m designing its modular logic and groundwork for a custom-trained AI model. 
My goal is to create a fully personalized assistant that understands natural language, adapts to user behavior, and executes real-world tasks intelligently.`,
    details: `⚙️ Core Tech: Python, SpeechRecognition, pyttsx3, Custom LLM (in progress)
🚀 Focus: Local inference, modular architecture, personalized interaction logic
🎯 Next: Voice interface + long-term memory integration`,
    dm: {
      label: "💬 Quick DM",
      href: "https://discord.com/users/1423691181950504960",
    },
  },

  skills: {
    skills: ["Python", "C++", "Arduino", "Git"],
    learning: ["AI/ML", "Robotics"],
    tools: ["React", "Node.js", "Vite", "LangChain", "SQLite"],
  },

  reading: [
    {
      title:
        "Internal Trait of Deep Neural Network — Statistical AI Lab @ KAIST (interpretability)",
      url: "https://sehyun-lee288.github.io/",
    },
  ],

  hobbies: [
    {
      title: "CS2",
      img: "https://i.imgur.com/VjtjlTE.jpeg",
      alt: "Counter-Strike 2 screenshot placeholder",
    },
    {
      title: "Others",
      img: "https://i.imgur.com/YQrINgt.png",
      alt: "TFT screenshot placeholder",
    },
  ],
};
