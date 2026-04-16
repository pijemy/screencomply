import { PermitRequirement } from "@/lib/types";

// ============================================
// Seminole County Permit Requirements
// Seminole County, Florida (Orlando metro - Sanford, Lake Mary, Altamonte)
// ============================================

export const seminoleCountyPermits: PermitRequirement[] = [
  {
    county: "seminole",
    permitType: "Building Permit - Screen Enclosure",
    description: "Required for all new screen enclosures, screen rooms, and pool enclosures",
    required: true,
    fee: 115,
    formName: "Building Permit Application",
    formUrl: "https://www.seminolecountyfl.gov/departments-services/building-development/building-division/",
    submissionMethod: "online",
    averageProcessingTime: "5-10 business days",
    notes: "Submit via Seminole County ePlan system. Requires two sets of sealed plans.",
  },
  {
    county: "seminole",
    permitType: "Electrical Permit",
    description: "Required for ceiling fans, lights, or outlets in the enclosure",
    required: false,
    fee: 65,
    formName: "Electrical Permit Application",
    submissionMethod: "online",
    averageProcessingTime: "3-5 business days",
    notes: "Only required when electrical scope is included.",
  },
  {
    county: "seminole",
    permitType: "Zoning Clearance",
    description: "Verifies setback compliance for the property zoning district",
    required: true,
    fee: 45,
    formName: "Zoning Clearance Application",
    submissionMethod: "online",
    averageProcessingTime: "3-5 business days",
    notes: "Must be approved before building permit issuance.",
  },
  {
    county: "seminole",
    permitType: "Wind Load Certification",
    description: "Engineering certification meeting FBC wind load requirements (130 mph for Seminole County)",
    required: true,
    fee: 0,
    formName: "Wind Load Calculation Report",
    submissionMethod: "in_person",
    averageProcessingTime: "Included with building permit review",
    notes: "Prepared by FL-licensed engineer. Seminole County is 130 mph wind zone per FBC.",
  },
  {
    county: "seminole",
    permitType: "Foundation Inspection",
    description: "Inspection of foundation/slab before enclosure erection",
    required: true,
    fee: 0,
    formName: "N/A - Schedule via ePlan portal",
    submissionMethod: "online",
    averageProcessingTime: "1-2 business days",
    notes: "Schedule via Seminole County ePlan portal after foundation is poured.",
  },
  {
    county: "seminole",
    permitType: "Final Inspection",
    description: "Final structural and safety inspection",
    required: true,
    fee: 0,
    formName: "N/A - Schedule via ePlan portal",
    submissionMethod: "online",
    averageProcessingTime: "1-2 business days",
    notes: "All work complete. Inspector verifies structural integrity and code compliance.",
  },
];

export const seminoleRescreenPermits: PermitRequirement[] = [
  {
    county: "seminole",
    permitType: "Rescreen Permit (Minor Repair)",
    description: "Permit for rescreening where no structural changes are made",
    required: false,
    fee: 30,
    formName: "Minor Repair Permit Application",
    submissionMethod: "online",
    averageProcessingTime: "1-3 business days",
    notes: "May not be required for fabric-only replacement. Confirm with Seminole County Building Division.",
  },
  {
    county: "seminole",
    permitType: "Building Permit - Structural Repair",
    description: "Required for rescreen involving structural member replacement",
    required: true,
    fee: 85,
    formName: "Building Permit Application",
    formUrl: "https://www.seminolecountyfl.gov/departments-services/building-development/building-division/",
    submissionMethod: "online",
    averageProcessingTime: "5-10 business days",
    notes: "Any structural modification requires a full building permit.",
  },
];

export const seminoleSecurityScreenPermits: PermitRequirement[] = [
  {
    county: "seminole",
    permitType: "Building Permit - Security Screen",
    description: "Required for security screen installation (structural modification)",
    required: true,
    fee: 85,
    formName: "Building Permit Application",
    formUrl: "https://www.seminolecountyfl.gov/departments-services/building-development/building-division/",
    submissionMethod: "online",
    averageProcessingTime: "5-10 business days",
    notes: "Security screens require building permit. Must meet FBC impact resistance standards.",
  },
  {
    county: "seminole",
    permitType: "Zoning Clearance",
    description: "Verify security screens meet appearance/setback requirements",
    required: true,
    fee: 45,
    formName: "Zoning Clearance Application",
    submissionMethod: "online",
    averageProcessingTime: "3-5 business days",
    notes: "HOA approval may be needed first.",
  },
];

export function getSeminoleCountyPermits(projectType: string): PermitRequirement[] {
  switch (projectType) {
    case "new_screen":
    case "pool_enclosure":
      return [...seminoleCountyPermits];
    case "rescreen":
      return [...seminoleRescreenPermits];
    case "security_screen":
      return [...seminoleSecurityScreenPermits];
    default:
      return seminoleCountyPermits;
  }
}