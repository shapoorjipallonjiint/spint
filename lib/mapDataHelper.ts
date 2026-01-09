type BackendCity = {
  id?: "sp-group" | "sp-international";
  name?: string;
  left?: string;
  top?: string;
  completedProjects?: string;
  employees?: string;
};

export const mapBackendCitiesToMapCities = (
  cities: BackendCity[] = [],
  projectCities: Set<string>
) => {
  return cities.map((city) => {
    const hasProjects = projectCities.has(city.name ?? "");

    return {
      id: `${city.name}-${city.left}-${city.top}`,
      name: city.name || "",

      left: `${city.left}%`,
      top: `${city.top}%`,

      groupId: city.id,

      pjtcompleted: Number(city.completedProjects || 0),
      dedicatedemployees: Number(city.employees || 0),

      // ✅ NEW FLAGS
      hasProjects,
      isClickable:
        city.id === "sp-international" && hasProjects,
    };
  });
};

