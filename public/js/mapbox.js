/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
// export const displayMap = (locations) => {
mapboxgl.accessToken =
  'pk.eyJ1IjoiYXMtMDMwMTAiLCJhIjoiY2t5bjBmMjRhMTZnaTJudWZiY3E5Zmd6MSJ9.rLgbBLZKPvt4qBrBmI92Dg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/as-03010/clmojurhc004001ns99ij5dg3',
  scrollZoom: false,
  zoom: 8,
  interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
// };
