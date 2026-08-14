export const VALIDATION_ISSUES = deepFreeze({
  Q_REQUIRED: "q is required",
  Q_SCALAR: "q must be provided exactly once as a string",
  Q_RAW_TOO_LONG: "q must not exceed 512 UTF-16 code units",
  Q_BLANK: "q must not be blank",
  Q_NORMALIZED_TOO_LONG: "q must not exceed 100 Unicode code points after normalization",
  Q_NOT_MEANINGFUL: "q must contain at least one letter or number token and at least 2 letter or number characters",
  PLATFORM_SCALAR: "platform must be provided at most once as a string",
  PLATFORM_RAW_TOO_LONG: "platform must not exceed 256 UTF-16 code units",
  PLATFORM_BLANK: "platform must not be blank",
  PLATFORM_NORMALIZED_TOO_LONG: "platform must not exceed 50 Unicode code points after normalization",
  PLATFORM_UNKNOWN: "platform must be one of the catalog platforms",
  SORT_SCALAR: "sort must be provided at most once as a string",
  SORT_RAW_TOO_LONG: "sort must not exceed 64 UTF-16 code units",
  SORT_UNSUPPORTED: "sort must be relevance",
  UNKNOWN_QUERY_KEYS: "query contains unsupported parameters"
});

function deepFreeze(value) {
  Object.freeze(value);
  for (const child of Object.values(value)) {
    if (child && typeof child === "object" && !Object.isFrozen(child)) {
      deepFreeze(child);
    }
  }
  return value;
}

export function normalizeText(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .normalize("NFKC")
    .trim()
    .replace(/\s+/gu, " ");
}

export function tokenizeNormalizedText(normalizedText) {
  return normalizedText.match(/[\p{L}\p{N}]+/gu) ?? [];
}

export function codePointLength(value) {
  return Array.from(value).length;
}

export function normalizeCatalogPlatform(value) {
  return normalizeText(value);
}

export function getCatalogPlatforms(catalog) {
  const platforms = new Set();
  for (const skill of catalog) {
    for (const platform of skill.platforms ?? []) {
      if (typeof platform !== "string") continue;
      const normalized = normalizeCatalogPlatform(platform);
      if (normalized) platforms.add(normalized);
    }
  }
  return platforms;
}

function firstFieldError(field, value, catalog) {
  if (field === "q") {
    if (value === undefined) return VALIDATION_ISSUES.Q_REQUIRED;
    if (typeof value !== "string") return VALIDATION_ISSUES.Q_SCALAR;
    if (value.length > 512) return VALIDATION_ISSUES.Q_RAW_TOO_LONG;
    const normalized = normalizeText(value);
    if (!normalized) return VALIDATION_ISSUES.Q_BLANK;
    if (codePointLength(normalized) > 100) {
      return VALIDATION_ISSUES.Q_NORMALIZED_TOO_LONG;
    }
    const tokens = tokenizeNormalizedText(normalized);
    if (!tokens.length || tokens.reduce((count, token) => count + codePointLength(token), 0) < 2) {
      return VALIDATION_ISSUES.Q_NOT_MEANINGFUL;
    }
    return null;
  }

  if (field === "platform") {
    if (typeof value !== "string") return VALIDATION_ISSUES.PLATFORM_SCALAR;
    if (value.length > 256) return VALIDATION_ISSUES.PLATFORM_RAW_TOO_LONG;
    const normalized = normalizeCatalogPlatform(value);
    if (!normalized) return VALIDATION_ISSUES.PLATFORM_BLANK;
    if (codePointLength(normalized) > 50) {
      return VALIDATION_ISSUES.PLATFORM_NORMALIZED_TOO_LONG;
    }
    if (!getCatalogPlatforms(catalog).has(normalized)) {
      return VALIDATION_ISSUES.PLATFORM_UNKNOWN;
    }
    return null;
  }

  if (typeof value !== "string") return VALIDATION_ISSUES.SORT_SCALAR;
  if (value.length > 64) return VALIDATION_ISSUES.SORT_RAW_TOO_LONG;
  return normalizeText(value) === "relevance" ? null : VALIDATION_ISSUES.SORT_UNSUPPORTED;
}

export function validateSearchQuery(query, catalog) {
  const source = query && typeof query === "object" && !Array.isArray(query) ? query : {};
  const details = [];
  const qIssue = firstFieldError("q", source.q, catalog);
  if (qIssue) details.push({ field: "q", issue: qIssue });

  let platform = null;
  if (source.platform !== undefined) {
    const platformIssue = firstFieldError("platform", source.platform, catalog);
    if (platformIssue) details.push({ field: "platform", issue: platformIssue });
    else platform = normalizeCatalogPlatform(source.platform);
  }

  let sort = "relevance";
  if (source.sort !== undefined) {
    const sortIssue = firstFieldError("sort", source.sort, catalog);
    if (sortIssue) details.push({ field: "sort", issue: sortIssue });
    else sort = normalizeText(source.sort);
  }

  const unknownKeys = Object.keys(source)
    .filter((key) => !["q", "platform", "sort"].includes(key))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  if (unknownKeys.length) {
    details.push({ field: "query", issue: VALIDATION_ISSUES.UNKNOWN_QUERY_KEYS, keys: unknownKeys });
  }

  if (details.length) return { valid: false, details };
  return { valid: true, value: { query: normalizeText(source.q), platform, sort } };
}
