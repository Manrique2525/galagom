import { describe, expect, it } from "vitest";
import { getYearsOfExperience } from "@/components/sections/experience-years";

describe("getYearsOfExperience", () => {
  it("returns 19 years in 2026", () => {
    expect(getYearsOfExperience(new Date("2026-01-01T00:00:00Z"))).toBe(19);
  });

  it("returns 20 years in 2027", () => {
    expect(getYearsOfExperience(new Date("2027-06-15T00:00:00Z"))).toBe(20);
  });

  it("returns 21 years in 2028", () => {
    expect(getYearsOfExperience(new Date("2028-12-31T00:00:00Z"))).toBe(21);
  });

  it("does not return negative years for dates before start year", () => {
    expect(getYearsOfExperience(new Date("1999-01-01T00:00:00Z"))).toBe(0);
  });
});
