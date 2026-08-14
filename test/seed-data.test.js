import assert from "node:assert/strict";
import test from "node:test";
import { SKILLS } from "../src/skills/skills.data.js";
import { normalizeCatalogPlatform, normalizeText } from "../src/skills/skills.validation.js";

test("seed catalog is immutable and satisfies shape and uniqueness invariants", () => {
  assert.equal(Object.isFrozen(SKILLS), true);
  assert.ok(SKILLS.length >= 8);
  assert.equal(new Set(SKILLS.map((skill) => skill.id)).size, SKILLS.length);
  for (const skill of SKILLS) {
    assert.equal(Object.isFrozen(skill), true);
    assert.equal(Object.isFrozen(skill.platforms), true);
    assert.equal(Object.isFrozen(skill.tags), true);
    assert.match(skill.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(skill.name.trim() && skill.description.trim());
    assert.ok(skill.platforms.length && skill.tags.length);
    assert.equal(new Set(skill.platforms.map(normalizeCatalogPlatform)).size, skill.platforms.length);
    assert.equal(new Set(skill.tags.map(normalizeText)).size, skill.tags.length);
  }
});

test("the normative Express seed record is exact and unique for api searches", () => {
  const expressSkills = SKILLS.filter((skill) =>
    skill.platforms.includes("api") && [skill.name, skill.description, ...skill.tags]
      .flatMap((value) => normalizeText(value).match(/[\p{L}\p{N}]+/gu) ?? [])
      .includes("express")
  );
  assert.deepEqual(expressSkills, [SKILLS.find((skill) => skill.id === "skill-express-routing")]);
  assert.deepEqual(expressSkills[0], {
    id: "skill-express-routing",
    name: "Express Routing",
    description: "Define HTTP routes and middleware with Express.",
    platforms: ["api"],
    tags: ["express", "routing", "middleware"]
  });
});
