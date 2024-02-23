export function validateParams(params, schema) {

  if(!params || !schema) {
    throw new Error("Request failed");
  }

  const schemaArr = Object.entries(schema);
  const paramsArr = Object.entries(params);

  const schemaFields = schemaArr.map(([key, value]) => {
    return key;
  });

  const paramsFields = paramsArr.map(([key, value]) => {
    return key;
  });

  const sameFields = schemaFields.sort().join(",") === paramsFields.sort().join(",");

  if(!sameFields) {
    const fields = schemaFields.join(", ");
    throw new Error(`Your requisition needs to have the following items: ${fields}`);
  }

  for(let i = 0; i < schemaArr.length; i++) {
    if(schemaArr[i].length !== paramsArr[i].length) {
      throw new Error("Request failed");
    }

    const compare = compareParamsAndschema(schemaArr[i], paramsArr[i]);
    if(typeof compare === "string") {
      throw new Error(compare);
    }
  }

  return true;
}

function compareParamsAndschema(schemaArr, paramsArr) {
  const field = schemaArr[0];
  const type = schemaArr[1].toLowerCase();
  const value = paramsArr[1];
  if(typeof value !== type) {
    return `The field ${field} must be of type ${type}`;
  }
  return true;
}