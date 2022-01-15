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

// services/ReservationsTable/Create.ts
var Create_exports = {};
__export(Create_exports, {
  handler: () => handler
});
var import_aws_sdk = require("aws-sdk");

// services/Shared/InputValidator.ts
var MissingFieldError = class extends Error {
};
function validateAsReservationEntry(arg) {
  if (arg.reservationId == void 0) {
    throw new MissingFieldError("Value for reservationId required!");
  }
  if (arg.spaceId == void 0) {
    throw new MissingFieldError("Value for spaceId required!");
  }
  if (arg.state == void 0) {
    throw new MissingFieldError("Value for state required!");
  }
  if (arg.user == void 0) {
    throw new MissingFieldError("Value for user required!");
  }
}

// services/Shared/Utils.ts
function generateRandomId() {
  return Math.random().toString(36).slice(2);
}
function getEventBody(event) {
  return typeof event.body == "object" ? event.body : JSON.parse(event.body);
}
function addCorsHeader(result) {
  result.headers = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
  };
}

// services/ReservationsTable/Create.ts
var TABLE_NAME = process.env.TABLE_NAME;
var dbClient = new import_aws_sdk.DynamoDB.DocumentClient();
async function handler(event, context) {
  const result = {
    statusCode: 200,
    body: "Hello from DYnamoDb"
  };
  addCorsHeader(result);
  try {
    const item = getEventBody(event);
    item.state = "PENDING";
    item.reservationId = generateRandomId();
    validateAsReservationEntry(item);
    await dbClient.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();
    result.body = JSON.stringify({
      id: item.reservationId
    });
  } catch (error) {
    if (error instanceof MissingFieldError) {
      result.statusCode = 400;
    } else {
      result.statusCode = 500;
    }
    result.body = JSON.stringify(console.error(error));
  }
  return result;
}
module.exports = __toCommonJS(Create_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
