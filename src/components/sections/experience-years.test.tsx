import { describe, expect, it } from "vitest";
import { getYearsOfExperience } from "@/components/sections/experience-years";

describe("getYearsOfExperience", () => {
  it("keeps 18 years before the July 15 anniversary in 2026", () => {
    expect(getYearsOfExperience(new Date("2026-07-15T04:59:59Z"))).toBe(18);
  });

  it("increments to 19 years exactly on July 15, 2026 in Cancún", () => {
    expect(getYearsOfExperience(new Date("2026-07-15T05:00:00Z"))).toBe(19);
  });

  it("keeps 19 years before the July 15 anniversary in 2027", () => {
    expect(getYearsOfExperience(new Date("2027-07-15T04:59:59Z"))).toBe(19);
  });

  it("increments to 20 years exactly on July 15, 2027 in Cancún", () => {
    expect(getYearsOfExperience(new Date("2027-07-15T05:00:00Z"))).toBe(20);
  });

  it("does not return negative years for dates before start year", () => {
    expect(getYearsOfExperience(new Date("1999-01-01T00:00:00Z"))).toBe(0);
  });
});
