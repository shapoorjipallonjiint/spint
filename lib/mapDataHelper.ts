type BackendCity = {
  _id?: string;
  id?: "sp-group" | "sp-international";
  name?: string;
  left?: string;
  top?: string;
  x?: number;
  y?: number;
  completedProjects?: string;
  employees?: string;
  showInProjectFilter?: boolean
};

// true when the point was picked on the map in admin (x / y = % of the full map image)
export const hasMapPoint = (city: { x?: unknown; y?: unknown }) =>
  typeof city.x === "number" && typeof city.y === "number" &&
  Number.isFinite(city.x) && Number.isFinite(city.y);

export const mapBackendCitiesToMapCities = (
  cities: BackendCity[] = [],
  projectCities: Set<string>
) => {
  return cities.map((city) => {
    const hasProjects = projectCities.has(city.name ?? "");

    return {
      id: city._id ? String(city._id) : `${city.name}-${city.left}-${city.top}`,
      name: city.name || "",

      // legacy hand-typed position (used when no map point has been picked)
      left: `${city.left}%`,
      top: `${city.top}%`,

      // exact map point, positioned by the .map-point CSS on every screen size
      hasPoint: hasMapPoint(city),
      x: city.x,
      y: city.y,

      groupId: city.id,

      pjtcompleted: Number(city.completedProjects || 0),
      dedicatedemployees: Number(city.employees || 0),

      // ✅ NEW FLAGS
      hasProjects,
      isClickable:
        city.id === "sp-international" && hasProjects && city.showInProjectFilter === true,
    };
  });
};
