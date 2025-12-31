type BackendCity = {
  id?: "sp-group" | "sp-international";
  name?: string;
  left?: string;
  top?: string;
  completedProjects?: string;
  employees?: string;
};

export const mapBackendCitiesToMapCities = (cities: BackendCity[] = []) => {
  return cities.map((city) => ({
    // stable id for map interactions
    id: `${city.name}-${city.left}-${city.top}`,

    name: city.name || "",

    left: `${city.left}%`,
    top: `${city.top}%`,

    groupId: city.id,

    // only two stats (as decided)
    pjtcompleted: Number(city.completedProjects || 0),
    dedicatedemployees: Number(city.employees || 0),
  }));
};
