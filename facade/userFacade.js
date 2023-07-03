const geolib = require('geolib');






function getNearestDistances(currentLocation, coordinates, count = 10) {
  const distances = coordinates.map(coord => {
    const distance = geolib.getDistance(currentLocation, coord);
    return { coord, distance };
  });

  distances.sort((a, b) => a.distance - b.distance);

  return distances.slice(0, count);
}
const listDistanceUserToStore = (userPos) =>{

}


const getPosAndSearchNearestStoreFacade = (userPos) =>{
    
    const listDistance = listDistanceUserToStore(userPos);

}

module.exports = {
  
}