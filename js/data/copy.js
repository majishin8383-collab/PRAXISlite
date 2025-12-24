export const COPY = {
  home: {
    title: "What do you need right now?",
    subtitle: "Choose one. Praxis will guide the next step.",
    actions: [
      { title: "Calm Me Down", sub: "2 minutes", hint: "Start small. Continue longer inside the flow if needed.", zone: "yellow", to: "#/yellow/calm" },
      { title: "Focus Sprint", sub: "10–25 minutes", hint: "A timer-based sprint to convert intention into action.", zone: "green", to: "#/green/focus" },
      { title: "No-Contact Shield", sub: "Pause the urge", hint: "Add friction. Regulate. Choose what protects you.", zone: "yellow", to: "#/yellow/nocontact" },
      { title: "Today’s Plan", sub: "3 steps only", hint: "Not a to-do list. Just the next three moves.", zone: "green", to: "#/green/today" },
      { title: "Reflect (Optional)", sub: "Only if helpful", hint: "Voice or short note. Never required.", zone: "green", to: "#/reflect" },
      { title: "Emergency", sub: "Immediate help", hint: "Crisis Interruption Mode. Pause action and reach support.", zone: "red", to: "#/red/emergency" },
    ]
  }
};
