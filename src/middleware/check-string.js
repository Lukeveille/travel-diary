export default (input, alt) => {
  return input === ''? null : typeof input === 'string'? input : typeof input === 'number'? input.toString() : alt || null;
};
