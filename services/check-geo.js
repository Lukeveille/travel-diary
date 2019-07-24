const checkGeo = (geotag, alt) => {
  return geotag && geotag.lat < 85 && geotag.lat > -85.05115 && geotag.long < 180 && geotag.long > -180? geotag : alt || { lat: null, long: null };
}

export default checkGeo;