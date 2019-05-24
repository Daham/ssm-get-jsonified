const paramJson = {};
let ref;

const recursiveJson = (value, keyArray) => {
  const currKey = keyArray.shift();

  if (!keyArray.length) {
    ref[currKey] = value;
    return;
  }

  if (!ref[currKey]) {
    ref[currKey] = {};
  }

  ref = ref[currKey];
  return recursiveJson(value, keyArray);
};

const hierachicalToJson = (hierachicalOutput, pathPrefix) => {
  const skipCount = pathPrefix.split('/')[1] === '' ? 1 : pathPrefix.split('/').length;
  hierachicalOutput.Parameters.forEach(param => {
    ref = paramJson;
    const keyArray = param.Name.split('/');
    keyArray.splice(0, skipCount);
    recursiveJson(param.Value, keyArray);
  });
  return paramJson;
};

module.exports = {
  hierachicalToJson: hierachicalToJson
};