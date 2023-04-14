export const starWarsStore = {
  starWarsFavorites: [
    { uid: "algo", name: "test1" },
    { uid: "algo2", name: "test2" },
  ],
  initialFetch: [],
};

export function starWarsActions(getStore, getActions, setStore) {
  return {
    addFavorite: (item) => {
      let store = getStore();
      const nameExists = store.starWarsFavorites.some(
        (favorite) => favorite.name === item.name
      );
      if (nameExists) {
        alert(`"${item.name}" already exists in favorites.`);
        return;
      }
      const updatedFavorites = [...store.starWarsFavorites, item];
      setStore({ starWarsFavorites: updatedFavorites });

      return;
    },
    removeFavorite: (i) => {
      let store = getStore();
      let arrTemp = store.starWarsFavorites.filter((item, index) => {
        return index != i;
      });
      setStore({ ...store, starWarsFavorites: arrTemp });

      return;
    },
    initialFetchSwapi: async () => {
      try {
        let store = getStore();
        let responsePeople = fetch("https://www.swapi.tech/api/people");
        let responseVehicles = fetch("https://www.swapi.tech/api/vehicles");
        let responsePlanets = fetch("https://www.swapi.tech/api/planets");

        let [respuestaJsonPeople, respuestaJsonVehicles, respuestaJsonPlanets] =
          await Promise.all([
            responsePeople,
            responseVehicles,
            responsePlanets,
          ]).then((responses) =>
            Promise.all(responses.map((response) => response.json()))
          );

        console.log(respuestaJsonPeople);
        console.log(respuestaJsonVehicles);
        console.log(respuestaJsonPlanets);

        setStore({
          ...store,
          initialFetch: [
            respuestaJsonPeople.results,
            respuestaJsonVehicles.results,
            respuestaJsonPlanets.results,
          ],
        });
      } catch (error) {
        console.error(error);
      }
    },

    // initialFetch: async () => {
    //   let store = getStore();
    //   let responsePeople = fetch("https://www.swapi.tech/api/people");
    //   let responseVehicles = fetch("https://www.swapi.tech/api/vehicles");
    //   let responsePlanets = fetch("https://www.swapi.tech/api/planets");

    //   let [a, b, c] = await Promise.all([
    //     responsePeople,
    //     responseVehicles,
    //     responsePlanets,
    //   ]);

    //   let respuestaJsonPeople = await a.json();
    //   console.log(respuestaJsonPeople);
    //   let respuestaJsonVehicles = await b.json();
    //   let respuestaJsonPlanets = await c.json();
    //   setStore(store.initialFetch.push(respuestaJsonPeople));
    // },
  };
}
