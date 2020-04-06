
// Important: The distance traveled by a person on foot in 15 minutes.
export const FIFTEEN_DIST = 0.8;

//UTM string for converting Boston UTM coords into latitude and longitude
export const UTM_STRING = "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs ";

export const UTM_STRING_2 = "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000.0001016002 +y_0=750000 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs "

//Proj4js string for converting into Lat/Long
export const WGS_STRING = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

// Usage: proj4(UTM_STRING, WGS_STRING,[parseFloat(x), parseFloat(y)]) 
