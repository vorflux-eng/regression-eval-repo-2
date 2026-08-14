import { normalizeCatalogPlatform } from "./skills.validation.js";
import { compareRankedSkills, scoreSkill, toPhraseTokens } from "./relevance.js";

export function searchSkills({ query, platform, catalog }) {
  const queryTokens = toPhraseTokens(query);
  const normalizedPlatform = platform == null ? null : normalizeCatalogPlatform(platform);
  return catalog
    .filter((skill) => normalizedPlatform === null || skill.platforms.some(
      (value) => typeof value === "string" && normalizeCatalogPlatform(value) === normalizedPlatform
    ))
    .map((skill) => ({ ...skill, relevanceScore: scoreSkill(skill, queryTokens) }))
    .filter((skill) => skill.relevanceScore > 0)
    .sort(compareRankedSkills)
    .map(({ id, name, description, platforms, tags, relevanceScore }) => ({
      id,
      name,
      description,
      platforms: [...platforms],
      tags: [...tags],
      relevanceScore
    }));
}
