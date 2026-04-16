import { PermitRequirement } from "@/lib/types";

// ============================================
// Osceola County Permit Requirements
// Osceola County, Florida (Orlando metro - Kissimmee, St. Cloud, Celebration)
// ============================================

export const osceolaCountyPermits: PermitRequirement[] = [
  {
    county: "osceola",
    permitType: "Building Permit - Screen Enclosure",
    description: "Required for all new screen enclosures, screen rooms, and pool enclosures",
    required: true,
    fee: 100,
    formName: "Building Permit Application",
    formUrl: "https://www.osceola.org/agencies-services/building-development/building-division",
    submissionMethod: "in_person",
    averageProcessingTime: "7-14 business days",
    notes: "Osceola County requires in-person or mail submission. Download forms from their website. Two sets of sealed plans required.",
  },
  {
    county: "osceola",
    permitType: "Electrical Permit",
    description: "Required if enclosure includes ceiling fans, lights, or outlets",
    required: false,
    fee: 60,
    formName: "Electrical Permit Application",
    submissionMethod: "in_person",
    averageProcessingTime: "3-5 business days",
    notes: "Submit at Osceola County Building Division office.",
  },
  {
    county: "osceola",
    permitType: "Zoning Clearance",
    description: "Verifies setback compliance and property zoning requirements",
    required: true,
    fee: 40,
    formName: "Zoning Clearance Application",
    submissionMethod: "in_person",
    averageProcessingTime: "5-7 business days",
    notes: "Must be approved before building permit. Osceola processes zoning separately.",
  },
  {
    county: "osceola",
    permitType: "Wind Load Certification",
    description: "Engineering certification meeting FBC wind load requirements (140 mph for coastal Osceola areas, 130 mph inland)",
    required: true,
    fee: 0,
    formName: "Wind Load Calculation Report",
    submissionMethod: "in_person",
    averageProcessingTime: "Included with building permit review",
    notes: "Prepared by FL-licensed engineer. Parts of Osceola County near the coast require 140 mph design. Confirm wind zone for specific address.",
  },
  {
    county: "osceola",
    permitType: "Foundation Inspection",
    description: "Inspection of foundation/slab before enclosure erection",
    required: true,
    fee: 0,
    formName: "N/A - Schedule by phone or in person",
    submissionMethod: "in_person",
    averageProcessingTime: "2-3 business days to schedule",
    notes: "Call Osceola County Building Division to schedule. No online portal for inspections.",
  },
  {
    county: "osceola",
    permitType: "Final Inspection",
    description: "Final structural and safety inspection",
    required: true,
    fee: 0,
    formName: "N/A - Schedule by phone or in person",
    submissionMethod: "in_person",
    averageProcessingTime: "2-3 business days to schedule",
    notes: "Schedule by calling Building Division. All work must be complete before final.",
  },
];

export const osceolaRescreenPermits: PermitRequirement[] = [
  {
    county: "osceola",
    permitType: "Rescreen Permit (Minor Repair)",
    description: "Permit for rescreening with no structural modifications",
    required: false,
    fee: 25,
    formName: "Minor Repair Permit Application",
    submissionMethod: "in_person",
    averageProcessingTime: "1-5 business days",
    notes: "Osceola may not require a permit for screen fabric replacement only. Check with Building Division.",
  },
  {
    county: "osceola",
    permitType: "Building Permit - Structural Repair",
    description: "Required for rescreen involving structural member replacement",
    required: true,
    fee: 80,
    formName: "Building Permit Application",
    formUrl: "https://www.osceola.org/agencies-services/building-development/building-division",
    submissionMethod: "in_person",
    averageProcessingTime: "7-14 business days",
    notes: "Any structural modification requires full building permit. In-person submission.",
  },
];

export const osceolaSecurityScreenPermits: PermitRequirement[] = [
  {
    county: "osceola",
    permitType: "Building Permit - Security Screen",
    description: "Required for security screen installation (structural modification)",
    required: true,
    fee: 80,
    formName: "Building Permit Application",
    formUrl: "https://www.osceola.org/agencies-services/building-development/building-division",
    submissionMethod: "in_person",
    averageProcessingTime: "7-14 business days",
    notes: "Security screens = structural modification per Osceola County. Must meet FBC impact resistance.",
  },
  {
    county: "osceola",
    permitType: "Zoning Clearance",
    description: "Verify security screens meet appearance/setback requirements",
    required: true,
    fee: 40,
    formName: "Zoning Clearance Application",
    submissionMethod: "in_person",
    averageProcessingTime: "5-7 business days",
    notes: "HOA approval needed first in most Osceola communities.",
  },
];

export function getOsceolaCountyPermits(projectType: string): PermitRequirement[] {
  switch (projectType) {
    case "new_screen":
    case "pool_enclosure":
      return [...osceolaCountyPermits];
    case "rescreen":
      return [...osceolaRescreenPermits];
    case "security_screen":
      return [...osceolaSecurityScreenPermits];
    default:
      return osceolaCountyPermits;
  }
}