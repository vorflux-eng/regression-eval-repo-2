import { codePointLength, normalizeText, tokenizeNormalizedText } from "./skills.validation.js";

export { tokenizeNormalizedText };

export function toPhraseTokens(value) {
  return tokenizeNormalizedText(normalizeText(value));
}

export function containsTokenSequence(fieldTokens, queryTokens) {
  if (!queryTokens.length || queryTokens.length > fieldTokens.length) return false;
  for (let index = 0; index <= fieldTokens.length - queryTokens.length; index += 1) {
    if (queryTokens.every((token, offset) => fieldTokens[index + offset] === token)) return true;
  }
  return false;
}

export function hasExactTokenSequence(fieldTokens, queryTokens) {
  return fieldTokens.length === queryTokens.length
    && queryTokens.length > 0
    && fieldTokens.every((token, index) => token === queryTokens[index]);
}

function uniqueTokens(tokens) {
  return [...new Set(tokens)];
}

function fieldTokenScore(fieldTokens, queryToken, exactWeight, prefixWeight) {
  if (fieldTokens.includes(queryToken)) return exactWeight;
  if (codePointLength(queryToken) >= 2 && fieldTokens.some((token) => token.startsWith(queryToken))) {
    return prefixWeight;
  }
  return 0;
}

export function scoreSkill(skill, queryTokens) {
  if (!queryTokens.length) return 0;
  const nameTokens = toPhraseTokens(skill.name);
  const tagTokenLists = skill.tags.map(toPhraseTokens);
  const allTagTokens = tagTokenLists.flat();
  const descriptionTokens = toPhraseTokens(skill.description);
  let score = 0;

  if (hasExactTokenSequence(nameTokens, queryTokens)) {
    score += 100;
  } else if (containsTokenSequence(nameTokens, queryTokens)) {
    score += 50;
  }
  if (tagTokenLists.some((tokens) => hasExactTokenSequence(tokens, queryTokens))) {
    score += 25;
  }
  if (containsTokenSequence(descriptionTokens, queryTokens)) score += 10;

  for (const token of uniqueTokens(queryTokens)) {
    score += fieldTokenScore(nameTokens, token, 20, 10);
    score += fieldTokenScore(allTagTokens, token, 12, 6);
    score += fieldTokenScore(descriptionTokens, token, 4, 2);
  }
  return score;
}

export function compareRankedSkills(a, b) {
  if (a.relevanceScore !== b.relevanceScore) return b.relevanceScore - a.relevanceScore;
  const aName = normalizeText(a.name);
  const bName = normalizeText(b.name);
  if (aName < bName) return -1;
  if (aName > bName) return 1;
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;
  return 0;
}
