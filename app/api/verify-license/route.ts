import { NextResponse } from "next/server";
import { validateLicenseFormat, generateMockDBPRData } from "@/lib/dbpr-mock";

// ============================================
// POST /api/verify-license
// Verifies a Florida contractor license number.
// In demo mode (placeholder Supabase URL), returns mock data.
// In production, will scrape real DBPR site (TODO).
// ============================================

function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("placeholder");
}

export async function POST(request: Request) {
  // Parse request body
  let body: { licenseNumber?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const raw = body.licenseNumber;
  if (typeof raw !== "string" || !raw.trim()) {
    return NextResponse.json(
      { success: false, error: "licenseNumber is required." },
      { status: 400 }
    );
  }

  // Validate format
  const validation = validateLicenseFormat(raw);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    );
  }

  const normalized = validation.normalized!;

  // Demo mode: return mock data
  if (isDemoMode()) {
    const mock = generateMockDBPRData(normalized);
    return NextResponse.json({
      success: true,
      source: "mock",
      license: {
        licenseNumber: mock.licenseNumber,
        businessName: mock.businessName,
        status: mock.status,
        licenseType: mock.licenseType,
        issueDate: mock.issueDate,
        expirationDate: mock.expirationDate,
        specialtyEndorsements: mock.specialtyEndorsements,
        disciplinaryActions: mock.disciplinaryActions,
        verifiedAt: new Date().toISOString(),
      },
    });
  }

  // Production mode: real DBPR verification
  // TODO: Implement scraping of https://www.myfloridalicense.com/
  // The DBPR site uses a multi-step ASP form with session management.
  // Full implementation requires:
  //   1. GET the search form page to obtain session cookies
  //   2. POST the search form with the license number
  //   3. Parse the result page for license details
  //   4. Follow the license detail link for full information
  // For now, return a placeholder indicating this is coming soon.
  return NextResponse.json({
    success: false,
    source: "dbpr",
    error: "Real DBPR verification is not yet implemented. Please use demo mode for mock data.",
    license: {
      licenseNumber: normalized,
      businessName: null,
      status: null,
      licenseType: null,
      issueDate: null,
      expirationDate: null,
      specialtyEndorsements: [],
      disciplinaryActions: [],
      verifiedAt: new Date().toISOString(),
    },
  });
}