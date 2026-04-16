import { PermitRequirement, FloridaCounty } from "@/lib/types";

// ============================================
// Orange County Permit Requirements
// Orange County, Florida (Orlando metro)
// ============================================

export const orangeCountyPermits: PermitRequirement[] = [
  // --- Screen Enclosure Permits ---
  {
    county: "orange",
    permitType: "Building Permit - Screen Enclosure",
    description: "Required for all new screen enclosures, screen rooms, and pool enclosures",
    required: true,
    fee: 125,
    formName: "Building Permit Application",
    formUrl: "https://www.ocfl.net/Permits",
    submissionMethod: "online",
    averageProcessingTime: "5-10 business days",
    notes: "Can be submitted via Orange County Permitting Portal. Requires two sets of plans.",
  },
  {
    county: "orange",
    permitType: "Electrical Permit",
    description: "Required if the screen enclosure includes ceiling fans, lights, or outlets",
    required: false,
    fee: 75,
    formName: "Electrical Permit Application",
    formUrl: "https://www.ocfl.net/Permits",
    submissionMethod: "online",
    averageProcessingTime: "3-5 business days",
    notes: "Only needed when electrical work is included in the scope.",
  },
  {
    county: "orange",
    permitType: "Zoning Clearance",
    description: "Verifies the enclosure meets setback requirements for the property zoning",
    required: true,
    fee: 50,
    formName: "Zoning Clearance Application",
    submissionMethod: "online",
    averageProcessingTime: "3-5 business days",
    notes: "Required before building permit can be issued. Check setback requirements for your zoning district.",
  },
  // --- Wind Load Requirements ---
  {
    county: "orange",
    permitType: "Wind Load Certification",
    description: "Engineering certification that enclosure meets Florida Building Code wind load requirements (130 mph gust for Orange County)",
    required: true,
    fee: 0,
    formName: "Wind Load Calculation Report",
    submissionMethod: "in_person",
    averageProcessingTime: "Included with building permit review",
    notes: "Must be prepared by a FL-licensed engineer. Orange County is in 130 mph wind zone per FBC.",
  },
  // --- Inspections ---
  {
    county: "orange",
    permitType: "Foundation Inspection",
    description: "Inspection of the slab/foundation before enclosure erection begins",
    required: true,
    fee: 0,
    formName: "N/A - Schedule via permitting portal",
    submissionMethod: "online",
    averageProcessingTime: "Scheduled within 1-2 business days",
    notes: "Schedule via Orange County Permitting Portal after foundation is complete.",
  },
  {
    county: "orange",
    permitType: "Final Inspection",
    description: "Final structural and safety inspection before the enclosure can be used",
    required: true,
    fee: 0,
    formName: "N/A - Schedule via permitting portal",
    submissionMethod: "online",
    averageProcessingTime: "Scheduled within 1-2 business days",
    notes: "All work must be complete. Inspector will verify wind load compliance and structural integrity.",
  },
];

// --- Rescreen-specific requirements ---
export const orangeRescreenPermits: PermitRequirement[] = [
  {
    county: "orange",
    permitType: "Rescreen Permit (Minor Repair)",
    description: "Permit for rescreening an existing enclosure where no structural changes are made",
    required: false,
    fee: 35,
    formName: "Minor Repair Permit Application",
    submissionMethod: "online",
    averageProcessingTime: "1-3 business days",
    notes: "May not be required if only replacing screen fabric (no structural change). Check with Orange County Building Dept for your specific project.",
  },
  {
    county: "orange",
    permitType: "Building Permit - Structural Repair",
    description: "Required if rescreen involves replacing structural members (beams, posts, fasteners)",
    required: true,
    fee: 95,
    formName: "Building Permit Application",
    formUrl: "https://www.ocfl.net/Permits",
    submissionMethod: "online",
    averageProcessingTime: "5-10 business days",
    notes: "Any structural modification requires a full building permit.",
  },
];

// --- Security Screen Requirements ---
export const orangeSecurityScreenPermits: PermitRequirement[] = [
  {
    county: "orange",
    permitType: "Building Permit - Security Screen",
    description: "Required for security screen installation on windows/doors (structural modification)",
    required: true,
    fee: 95,
    formName: "Building Permit Application",
    formUrl: "https://www.ocfl.net/Permits",
    submissionMethod: "online",
    averageProcessingTime: "5-10 business days",
    notes: "Security screens are considered a structural modification. Must meet Florida Building Code for impact resistance.",
  },
  {
    county: "orange",
    permitType: "Zoning Clearance",
    description: "Verify security screens meet appearance/setback requirements",
    required: true,
    fee: 50,
    formName: "Zoning Clearance Application",
    submissionMethod: "online",
    averageProcessingTime: "3-5 business days",
    notes: "HOA approval may also be required before zoning clearance.",
  },
];

export function getOrangeCountyPermits(projectType: string): PermitRequirement[] {
  switch (projectType) {
    case "new_screen":
    case "pool_enclosure":
      return [...orangeCountyPermits];
    case "rescreen":
      return [...orangeRescreenPermits];
    case "security_screen":
      return [...orangeSecurityScreenPermits];
    default:
      return orangeCountyPermits;
  }
}