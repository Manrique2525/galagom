"use client";

import { useEffect, useState } from "react";

const START_YEAR = 2007;

function getYearsOfExperience(referenceDate: Date = new Date()): number {
  const years = referenceDate.getUTCFullYear() - START_YEAR;
  return years < 0 ? 0 : years;
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
