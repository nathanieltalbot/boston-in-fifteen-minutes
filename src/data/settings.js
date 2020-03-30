// Default coloring for neighborhoods
export const neighborhoodColors = {
        "Beacon Hill": '#172a3a',
        "Mission Hill": '#3e517a',
        "Fenway/Kenmore": '#09e85e',
        "Allston/Brighton": '#214f4b',
        "East Boston": '#70cad1',
        "South Boston": '#09bc8a',
        "West End": '#004346',
        "South End": '#FFFF00',
        "Charlestown": '#4B0082',
        "North End": '#BC8F8F',
        "Government Center/Faneuil Hall": '#778899',
        "Roxbury": '#2afc98',
        "Chinatown": '#5F9EA0',
        "Financial District/Downtown": '#BC8F8F',
        "Bay Village": '#508991',
        "Dorchester": '#65743a',
        "Jamaica Plain": '#a8e0ff',
        "West Roxbury": '#7B68EE',
        "Hyde Park": '#00FF00',
        "Roslindale": '#00FFFF',
        "Mattapan": '#74b3ce',
        "Back Bay": '#044B7F'
    }

// The default mapSettings

export const defaultLocations = {
    location: {
        lat: 42.340260,
        lng: -71.089109
    },
    default_zoom: 11
}

export const mapSettings = {
    center: [defaultLocations.location.lat, defaultLocations.location.lng],
    defaultBaseMap: 'OpenStreetMap',
    zoom: defaultLocations.default_zoom,
    //mapEffect
  };
