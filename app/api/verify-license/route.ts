import { NextResponse } from "next/server";
import { validateLicenseFormat, generateMockDBPRData } from "@/lib/dbpr-mock";
import { verifyLicenseWithStateCred } from "@/lib/statecred";
import { lookupLicenseInLocalData } from "@/lib/dbpr-csv-sync";

// ============================================
// POST /api/verify-license
// Verifies a Florida contractor license number.
//
// Verification chain (in order):
//   1. Format validation
//   2. StateCred API (if STATECRED_API_KEY is set)
//   3. Local CSV index (if data/fl-licenses.json exists)
//   4. Mock data (fallback — always available)
// ============================================

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

  // --- Attempt 1: StateCred API ---
  const stateCredResult = await verifyLicenseWithStateCred(normalized);
  if (stateCredResult) {
    return NextResponse.json({
      success: true,
      source: "statecred",
      license: {
        licenseNumber: stateCredResult.license_number,
        businessName: stateCredResult.licensee_name,
        status: stateCredResult.status,
        licenseType: stateCredResult.profession,
        issueDate: null, // StateCred doesn't provide original issue date
        expirationDate: stateCredResult.expiration_date,
        specialtyEndorsements: [], // Not provided by StateCred
        disciplinaryActions: [], // Not provided by StateCred
        verifiedAt: new Date().toISOString(),
      },
    });
  }

  // --- Attempt 2: Local CSV index ---
  const localResult = await lookupLicenseInLocalData(normalized);
  if (localResult) {
    return NextResponse.json({
      success: true,
      source: "dbpr_csv",
      license: {
        licenseNumber: localResult.license_number,
        businessName: localResult.licensee_name,
        status: localResult.status,
        licenseType: localResult.license_type_code,
        issueDate: null,
        expirationDate: localResult.expiration_date,
        specialtyEndorsements: [],
        disciplinaryActions: [],
        verifiedAt: new Date().toISOString(),
      },
    });
  }

  // --- Attempt 3: Mock data (always available) ---
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