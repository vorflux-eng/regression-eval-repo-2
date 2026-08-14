function freezeRecord(record) {
  return Object.freeze({
    ...record,
    platforms: Object.freeze([...record.platforms]),
    tags: Object.freeze([...record.tags])
  });
}

export const SKILLS = Object.freeze([
  freezeRecord({
    id: "skill-javascript-fundamentals",
    name: "JavaScript Fundamentals",
    description: "Learn core JavaScript language features and patterns.",
    platforms: ["web", "api"],
    tags: ["javascript", "language", "basics"]
  }),
  freezeRecord({
    id: "skill-node-api-development",
    name: "Node.js API Development",
    description: "Build REST APIs with Node.js.",
    platforms: ["api", "web"],
    tags: ["node.js", "rest", "backend"]
  }),
  freezeRecord({
    id: "skill-express-routing",
    name: "Express Routing",
    description: "Define HTTP routes and middleware with Express.",
    platforms: ["api"],
    tags: ["express", "routing", "middleware"]
  }),
  freezeRecord({
    id: "skill-react-ui-development",
    name: "React UI Development",
    description: "Build interactive user interfaces with React.",
    platforms: ["web"],
    tags: ["react", "ui", "frontend"]
  }),
  freezeRecord({
    id: "skill-ios-development",
    name: "iOS Development",
    description: "Create native mobile applications for iOS.",
    platforms: ["ios"],
    tags: ["ios", "mobile", "swift"]
  }),
  freezeRecord({
    id: "skill-android-development",
    name: "Android Development",
    description: "Create native mobile applications for Android.",
    platforms: ["android"],
    tags: ["android", "mobile", "kotlin"]
  }),
  freezeRecord({
    id: "skill-command-line-automation",
    name: "Command-Line Automation",
    description: "Automate repeatable tasks from the command line.",
    platforms: ["cli"],
    tags: ["cli", "automation", "shell"]
  }),
  freezeRecord({
    id: "skill-cross-platform-testing",
    name: "Cross-Platform Testing",
    description: "Test software consistently across supported platforms.",
    platforms: ["web", "ios", "android"],
    tags: ["testing", "cross-platform", "quality"]
  })
]);
