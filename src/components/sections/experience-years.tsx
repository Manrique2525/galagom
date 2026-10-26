"use client";

import { useEffect, useState } from "react";

const START_YEAR = 2007;
const ANNIVERSARY_MONTH = 6;
const ANNIVERSARY_DAY = 15;
const EXPERIENCE_TIME_ZONE = "America/Cancun";
const experienceDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: EXPERIENCE_TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

function getYearsOfExperience(referenceDate: Date = new Date()): number {
  const parts = experienceDateFormatter.formatToParts(referenceDate);
  const getPart = (type: "year" | "month" | "day") =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  const years = getPart("year") - START_YEAR;
  const month = getPart("month") - 1;
  const day = getPart("day");
  const beforeAnniversary =
    month < ANNIVERSARY_MONTH ||
    (month === ANNIVERSARY_MONTH && day < ANNIVERSARY_DAY);

  return Math.max(0, years - (beforeAnniversary ? 1 : 0));
}

export default function ExperienceYears() {
  const [years, setYears] = useState<number | null>(null);

  useEffect(() => {
    setYears(getYearsOfExperience());
  }, []);

  if (years === null) {
    return (
      <strong className="block text-3xl font-extrabold tracking-[-0.04em] text-primary">
        {START_YEAR}-
      </strong>
    );
  }

  return (
    <strong className="block text-3xl font-extrabold tracking-[-0.04em] text-primary">
      {years} años brindando soluciones logísticas
    </strong>
  );
}

export { getYearsOfExperience, START_YEAR };
