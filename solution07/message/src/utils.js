export function filteredClone({ _doc }, ...excludedFields) {
  return Object.keys(_doc)
    .filter((key) => excludedFields.includes(key))
    .reduce(
      (newCopy, key) => ({
        ...newCopy,
        [key]: _doc[key],
      }),
      {}
    );
}

export function cleanClone(document) {
  return filteredClone(document, "_id", "__v");
}

export function unversionedClone(document) {
  return filteredClone(document, "__v");
}
