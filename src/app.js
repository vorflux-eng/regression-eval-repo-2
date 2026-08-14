import express from "express";
import { SKILLS } from "./skills/skills.data.js";
import { createSkillsRouter } from "./skills/skills.routes.js";
import { searchSkills } from "./skills/skills.service.js";

function terminalNotFound(_req, res) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
}

export function createApp({ catalog = SKILLS, search = searchSkills } = {}) {
  const app = express();
  app.set("query parser", "simple");
  app.disable("x-powered-by");
  app.options("/api/v1/skills/search", terminalNotFound);
  app.use("/api/v1/skills", createSkillsRouter({ catalog, search }));
  app.use(terminalNotFound);
  app.use((_error, _req, res, _next) => {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  });
  return app;
}
