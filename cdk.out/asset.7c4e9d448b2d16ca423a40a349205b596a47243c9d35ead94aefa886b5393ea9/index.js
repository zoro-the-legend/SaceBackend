var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// services/ReservationsTable/Read.ts
var Read_exports = {};
__export(Read_exports, {
  handler: () => handler
});
var import_aws_sdk = require("aws-sdk");

// services/Shared/Utils.ts
function addCorsHeader(result) {
  result.headers = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
  };
}
function isIncludedInGroup(group, event) {
  var _a;
  const groups = (_a = event.requestContext.authorizer) == null ? void 0 : _a.claims["cognito:groups"];
  if (groups) {
    return groups.includes(group);
  } else {
    return false;
  }
}

// services/ReservationsTable/Read.ts
var TABLE_NAME = process.env.TABLE_NAME;
var PRIMARY_KEY = process.env.PRIMARY_KEY;
var dbClient = new import_aws_sdk.DynamoDB.DocumentClient();
async function handler(event, context) {
  const result = {
    statusCode: 200,
    body: "Hello from DYnamoDb"
  };
  addCorsHeader(result);
  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY in event.queryStringParameters) {
        result.body = await queryWithPrimaryPartition(event.queryStringParameters);
      } else {
        result.body = await queryWithSecondaryPartition(event.queryStringParameters);
      }
    } else {
      if (isIncludedInGroup("admins", event)) {
        result.body = await scanTable();
      } else {
        result.body = JSON.stringify("Not authorized!");
        result.statusCode = 403;
      }
    }
  } catch (error) {
    result.statusCode = 500;
    console.error(error);
  }
  return result;
}
async function queryWithSecondaryPartition(queryParams) {
  const queryKey = Object.keys(queryParams)[0];
  const queryValue = queryParams[queryKey];
  const queryResponse = await dbClient.query({
    TableName: TABLE_NAME,
    IndexName: queryKey,
    KeyConditionExpression: "#zz = :zzzz",
    ExpressionAttributeNames: {
      "#zz": queryKey
    },
    ExpressionAttributeValues: {
      ":zzzz": queryValue
    }
  }).promise();
  return JSON.stringify(queryResponse.Items);
}
async function queryWithPrimaryPartition(queryParams) {
  const keyValue = queryParams[PRIMARY_KEY];
  const queryResponse = await dbClient.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: "#zz = :zzzz",
    ExpressionAttributeNames: {
      "#zz": PRIMARY_KEY
    },
    ExpressionAttributeValues: {
      ":zzzz": keyValue
    }
  }).promise();
  return JSON.stringify(queryResponse.Items);
}
async function scanTable() {
  const queryResponse = await dbClient.scan({
    TableName: TABLE_NAME
  }).promise();
  return JSON.stringify(queryResponse.Items);
}
module.exports = __toCommonJS(Read_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
