var paramJson = {};
var ref;

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

const recursiveJson = (value, keyArray) => {
  var currKey = keyArray.shift();

  if (!keyArray.length) {
    ref[currKey] = value;
    return;
  } else {
    if (!ref[currKey]) {
      ref[currKey] = {};
    }

    ref = ref[currKey];
    return recursiveJson(value, keyArray);
  }
};

module.exports = {
  hierachicalToJson: hierachicalToJson
};