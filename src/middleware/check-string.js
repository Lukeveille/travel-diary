export default (input, alt) => {
  return typeof input === 'string'? input : typeof input === 'number'? input.toString() : alt || null;
};
