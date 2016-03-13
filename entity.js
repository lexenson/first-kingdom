
function getFromId (entityModels, id) {
  return entityModels[id]
}

function add (entityModels, entityModel) {
  entityModels[entityModel.id] = entityModel
}

exports.getFromId = getFromId
exports.add = add
