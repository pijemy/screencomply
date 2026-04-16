// ============================================
// StateCred API Client
// Verifies Florida contractor licenses via the StateCred API.
// Falls back to null on any error so callers can use mock data.
// ============================================

export interface StateCredResult {
  license_number: string;
  licensee_name: string;
  status: string;
  expiration_date: string;
  profession: string;
  is_active: boolean;
  board: string;
}

const STATECRED_BASE_URL = "https://statecred.com/api/v1/verify/FL";
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Verify a Florida contractor license via the StateCred API.
 *
 * Returns the verification result on success, or null if:
 *   - No STATECRED_API_KEY env var is set
 *   - The request fails (network error, timeout, etc.)
 *   - The API returns 401 (bad key), 404 (not found), 429 (rate limited), or other non-2xx
 *
 * The caller should fall back to mock/local data when this returns null.
 */
export async function verifyLicenseWithStateCred(
  licenseNumber: string,
): Promise<StateCredResult | null> {
  const apiKey = process.env.STATECRED_API_KEY;
  if (!apiKey) {
    return null;
  }

  const url = `${STATECRED_BASE_URL}/${encodeURIComponent(licenseNumber)}/`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Accept": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 401 — invalid or expired API key
    if (response.status === 401) {
      console.error("[StateCred] 401 Unauthorized — check STATECRED_API_KEY");
      return null;
    }

    // 404 — license not found in their system
    if (response.status === 404) {
      return null;
    }

    // 429 — rate limited
    if (response.status === 429) {
      console.error("[StateCred] 429 Rate Limited — backing off");
      return null;
    }

    // Any other non-2xx
    if (!response.ok) {
      console.error(
        `[StateCred] Unexpected status ${response.status} for ${licenseNumber}`,
      );
      return null;
    }

    const data: unknown = await response.json();

    // Basic shape validation — ensure we got a usable object
    if (
      typeof data === "object" &&
      data !== null &&
      "license_number" in data &&
      "licensee_name" in data &&
      "status" in data &&
      "expiration_date" in data &&
      "profession" in data &&
      "is_active" in data &&
      "board" in data
    ) {
      return data as StateCredResult;
    }

    console.error("[StateCred] Response JSON missing required fields");
    return null;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error(`[StateCred] Request timed out for ${licenseNumber}`);
    } else {
      console.error(`[StateCred] Request failed for ${licenseNumber}:`, err);
    }
    return null;
  }
}