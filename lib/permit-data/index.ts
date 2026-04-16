import { PermitRequirement, FloridaCounty, COUNTY_NAMES } from "@/lib/types";
import { getOrangeCountyPermits } from "./orange";
import { getSeminoleCountyPermits } from "./seminole";
import { getOsceolaCountyPermits } from "./osceola";

export function getPermitsForProject(
  county: FloridaCounty,
  projectType: string
): PermitRequirement[] {
  switch (county) {
    case "orange":
      return getOrangeCountyPermits(projectType);
    case "seminole":
      return getSeminoleCountyPermits(projectType);
    case "osceola":
      return getOsceolaCountyPermits(projectType);
    default:
      return [];
  }
}

export function getCountyDisplayName(county: FloridaCounty): string {
  return COUNTY_NAMES[county];
}

export function getAllCounties(): { value: FloridaCounty; label: string }[] {
  return Object.entries(COUNTY_NAMES).map(([value, label]) => ({
    value: value as FloridaCounty,
    label,
  }));
}

// Calculate total permit fees for a project
export function calculateTotalFees(permits: PermitRequirement[]): number {
  return permits
    .filter((p) => p.required)
    .reduce((sum, p) => sum + p.fee, 0);
}

// Get required permits only
export function getRequiredPermits(permits: PermitRequirement[]): PermitRequirement[] {
  return permits.filter((p) => p.required);
}

// Get optional permits
export function getOptionalPermits(permits: PermitRequirement[]): PermitRequirement[] {
  return permits.filter((p) => !p.required);
}