export default (geotag, alt) => {
  return geotag && geotag.lat < 85 && geotag.lat > -85.05115 && geotag.long < 180 && geotag.long > -180 && geotag.lat !== '' && geotag.long !== ''? geotag : alt || { lat: null, long: null };
}