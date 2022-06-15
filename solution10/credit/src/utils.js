function filteredClone(document, ...excludedFields) {
  const copy = Object.assign({}, document._doc);
  for (const idx in excludedFields) {
    delete copy[excludedFields[idx]];
  }
  return copy;
} 

function cleanClone(document) {
  return filteredClone(document, "_id", "__v");
}

function unversionedClone(document) {
  return filteredClone(document, "__v");
}

module.exports = {
  filteredClone,
  cleanClone,
  unversionedClone
};
