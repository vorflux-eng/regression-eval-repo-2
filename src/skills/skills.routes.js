import express from "express";
import { validateSearchQuery } from "./skills.validation.js";

export function createSkillsRouter({ catalog, search }) {
  const router = express.Router();

  router.get("/search", async (req, res) => {
    const validation = validateSearchQuery(req.query, catalog);
    if (!validation.valid) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid query parameters",
          details: validation.details
        }
      });
    }

    const { query, platform, sort } = validation.value;
    const data = await search({ query, platform, catalog });
    return res.json({
      data,
      meta: { query, platform, sort, count: data.length }
    });
  });

  return router;
}
