'use strict';
/* --------------------------------------------------------------------------------
 * remove existing flow from this blueprint
 * --------------------------------------------------------------------------------
 */
const assert = require("assert");
exports.handler = async function (context, event, callback) {
  const THIS = 'remove-flow:';

  const assert = require('assert');
  const { isValidAppToken } = require(Runtime.getFunctions()["authentication-helper"].path);
  const { get_flow_sid }  = require(Runtime.getFunctions()['list-flows'].path);
  const { undeploy_studio_flow }  = require(Runtime.getFunctions()['installer/deploy'].path);

  /* Following code checks that a valid token was sent with the API call */
  if (!isValidAppToken(event.token, context)) {
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');
    response.setStatusCode(401);
    response.setBody({message: 'Invalid or expired token'});
    return callback(null, response);
  }

  console.time(THIS);
  try {
    assert(event.flowName, 'missing event.flowName!!!');
    assert(event.flowName.startsWith('Outreach'), `flowName=${event.flowName} does NOT start with 'Outreach' !!!`);

    const flowExists = await get_flow_sid(context, event.flowName);
    assert(flowExists, `flowName=${event.flowName} is not deployed !!!`);

    const flow = await undeploy_studio_flow(context, event.flowName);

    console.log(THIS, flow);
    return callback(null, flow);

  } catch (err) {
    console.log(THIS, err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
};