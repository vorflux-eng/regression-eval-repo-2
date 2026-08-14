import assert from "node:assert/strict";
import test from "node:test";
import {
  compareRankedSkills,
  containsTokenSequence,
  hasExactTokenSequence,
  scoreSkill,
  toPhraseTokens
} from "../src/skills/relevance.js";
import { SKILLS } from "../src/skills/skills.data.js";

const skill = (overrides = {}) => ({ id: "one", name: "Alpha Beta", description: "Alpha beta details", tags: ["alpha beta"], ...overrides });

test("phrase views are punctuation neutral and token sequences handle negative and repeated cases", () => {
  assert.deepEqual(toPhraseTokens("node.js"), ["node", "js"]);
  assert.equal(containsTokenSequence(["node", "js"], ["node", "js"]), true);
  assert.equal(containsTokenSequence(["node", "js"], ["js", "node"]), false);
  assert.equal(containsTokenSequence(["node", "js"], []), false);
  assert.equal(containsTokenSequence(["node", "js"], ["node", "node"]), false);
  assert.equal(containsTokenSequence(["node", "node", "js"], ["node", "node"]), true);
  assert.equal(hasExactTokenSequence(["node", "js"], ["node", "js"]), true);
  assert.equal(hasExactTokenSequence(["node", "js"], ["node"]), false);
});

test("score uses cumulative phrase and exact token weights", () => {
  const express = SKILLS.find((item) => item.id === "skill-express-routing");
  assert.equal(scoreSkill(express, ["express"]), 121);
  assert.equal(scoreSkill(skill(), ["alpha", "beta"]), 207);
  assert.equal(scoreSkill(skill({ name: "x", tags: ["x"], description: "alpha" }), ["alpha"]), 14);
});

test("exact matches beat prefixes per field and prefix needs two code points", () => {
  const prefixOnly = skill({ name: "alphabet", tags: ["alphabet"], description: "alphabet" });
  assert.equal(scoreSkill(prefixOnly, ["al"]), 18);
  assert.equal(scoreSkill(prefixOnly, ["a"]), 0);
  const exact = skill({ name: "al alphabet", tags: ["al alphabet"], description: "al alphabet" });
  assert.equal(scoreSkill(exact, ["al"]), 96);
});

test("zero tokens guard and locale-independent tie breakers are deterministic", () => {
  assert.equal(scoreSkill(skill(), []), 0);
  const ranked = [
    { id: "b", name: "Beta", relevanceScore: 1 },
    { id: "a", name: "Alpha", relevanceScore: 1 },
    { id: "c", name: "Alpha", relevanceScore: 1 },
    { id: "z", name: "Zulu", relevanceScore: 2 }
  ].sort(compareRankedSkills);
  assert.deepEqual(ranked.map((item) => item.id), ["z", "a", "c", "b"]);
});
