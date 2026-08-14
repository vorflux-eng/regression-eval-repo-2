import assert from "node:assert/strict";
import test from "node:test";
import { searchSkills } from "../src/skills/skills.service.js";
import { SKILLS } from "../src/skills/skills.data.js";

test("service filters platform before scoring and projects public ranked data", () => {
  const results = searchSkills({ query: "express", platform: "api", catalog: SKILLS });
  assert.deepEqual(results, [{
    id: "skill-express-routing", name: "Express Routing",
    description: "Define HTTP routes and middleware with Express.",
    platforms: ["api"], tags: ["express", "routing", "middleware"], relevanceScore: 121
  }]);
  assert.deepEqual(searchSkills({ query: "express", platform: "web", catalog: SKILLS }), []);
  assert.deepEqual(
    searchSkills({ query: "express", catalog: SKILLS }),
    searchSkills({ query: "express", platform: null, catalog: SKILLS })
  );
});

test("service normalizes injected platforms and uses score/name/id ordering", () => {
  const catalog = [
    { id: "b", name: "Beta", description: "", platforms: ["ＡＰＩ"], tags: ["match"] },
    { id: "a", name: "Alpha", description: "", platforms: ["Api"], tags: ["match"] }
  ];
  assert.deepEqual(searchSkills({ query: "match", platform: "Api", catalog }).map((item) => item.id), ["a", "b"]);
});
