function getFromId (entityModels, id) {
  return entityModels[id]
}

function add (entityModels, entityModel) {
  entityModels[entityModel.id] = entityModel
}

function remove (entityModels, entityModel) {
  delete entityModels[entityModel.id]
}

exports.getFromId = getFromId
exports.add = add
exports.remove = remove
