import assert from "node:assert/strict";
import test from "node:test";
import {
  getCatalogPlatforms,
  normalizeCatalogPlatform,
  normalizeText,
  tokenizeNormalizedText,
  VALIDATION_ISSUES,
  validateSearchQuery
} from "../src/skills/skills.validation.js";
import { SKILLS } from "../src/skills/skills.data.js";

const issueFor = (query, field) => validateSearchQuery(query, SKILLS).details.find((detail) => detail.field === field)?.issue;

test("normalization and tokenization have specified Unicode behavior", () => {
  assert.equal(normalizeText("  ＡＰＩ\t"), "api");
  assert.equal(normalizeText("e\u0301"), normalizeText("é"));
  assert.deepEqual(tokenizeNormalizedText(normalizeText("node.js node-js")), ["node", "js", "node", "js"]);
  assert.deepEqual(tokenizeNormalizedText(normalizeText("a\u034Fb")), ["a", "b"]);
  assert.equal(normalizeCatalogPlatform("ＡＰＩ"), "api");
});

test("catalog platforms normalize injected display values", () => {
  assert.deepEqual([...getCatalogPlatforms([{ platforms: ["Api", "ＡＰＩ", " ", 1, null, {}] }])], ["api"]);
  const catalog = [{ platforms: ["ＡＰＩ"] }];
  assert.equal(validateSearchQuery({ q: "ok", platform: "Api" }, catalog).valid, true);
});

test("validation issues are a frozen public canonical map", () => {
  assert.equal(Object.isFrozen(VALIDATION_ISSUES), true);
  assert.throws(() => { VALIDATION_ISSUES.Q_REQUIRED = "changed"; }, TypeError);
});

test("q validation observes caps and meaningful-query semantics", () => {
  assert.equal(issueFor({}, "q"), VALIDATION_ISSUES.Q_REQUIRED);
  assert.equal(issueFor({ q: ["ok", "again"] }, "q"), VALIDATION_ISSUES.Q_SCALAR);
  assert.equal(issueFor({ q: " ".repeat(513) }, "q"), VALIDATION_ISSUES.Q_RAW_TOO_LONG);
  assert.equal(issueFor({ q: "\t " }, "q"), VALIDATION_ISSUES.Q_BLANK);
  assert.equal(issueFor({ q: "é".repeat(101) }, "q"), VALIDATION_ISSUES.Q_NORMALIZED_TOO_LONG);
  for (const q of ["!", "a", "\u0301"]) assert.equal(issueFor({ q }, "q"), VALIDATION_ISSUES.Q_NOT_MEANINGFUL);
  assert.equal(validateSearchQuery({ q: "a\u034Fb" }, SKILLS).valid, true);
  assert.equal(validateSearchQuery({ q: "éx" }, SKILLS).value.query, "éx");
  assert.equal(validateSearchQuery({ q: "e\u0301x" }, SKILLS).value.query, "éx");
});

test("platform and sort validation use caps then normalized rules", () => {
  assert.equal(issueFor({ q: "ok", platform: ["api"] }, "platform"), VALIDATION_ISSUES.PLATFORM_SCALAR);
  assert.equal(issueFor({ q: "ok", platform: " ".repeat(257) }, "platform"), VALIDATION_ISSUES.PLATFORM_RAW_TOO_LONG);
  assert.equal(issueFor({ q: "ok", platform: " " }, "platform"), VALIDATION_ISSUES.PLATFORM_BLANK);
  assert.equal(issueFor({ q: "ok", platform: "é".repeat(51) }, "platform"), VALIDATION_ISSUES.PLATFORM_NORMALIZED_TOO_LONG);
  assert.equal(issueFor({ q: "ok", platform: "unknown" }, "platform"), VALIDATION_ISSUES.PLATFORM_UNKNOWN);
  assert.equal(issueFor({ q: "ok", sort: ["relevance"] }, "sort"), VALIDATION_ISSUES.SORT_SCALAR);
  assert.equal(issueFor({ q: "ok", sort: " ".repeat(65) }, "sort"), VALIDATION_ISSUES.SORT_RAW_TOO_LONG);
  assert.equal(issueFor({ q: "ok", sort: " " }, "sort"), VALIDATION_ISSUES.SORT_UNSUPPORTED);
  assert.equal(validateSearchQuery({ q: "ok", sort: "ReLeVaNcE" }, SKILLS).value.sort, "relevance");
});

test("validation emits fixed field order and sorted unknown keys", () => {
  const result = validateSearchQuery({ q: "!", platform: "no", sort: "date", zebra: "1", apple: "2" }, SKILLS);
  assert.deepEqual(result.details, [
    { field: "q", issue: VALIDATION_ISSUES.Q_NOT_MEANINGFUL },
    { field: "platform", issue: VALIDATION_ISSUES.PLATFORM_UNKNOWN },
    { field: "sort", issue: VALIDATION_ISSUES.SORT_UNSUPPORTED },
    { field: "query", issue: VALIDATION_ISSUES.UNKNOWN_QUERY_KEYS, keys: ["apple", "zebra"] }
  ]);
});
