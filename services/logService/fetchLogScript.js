const Node = require("../../models/Node");
const scriptLogModel = require("../../models/ScriptLogModel");

const getTimeFrame = (timeframe) => {
  let startDate;

  switch (timeframe) {
    case "24h":
      startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case "1w":
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "1m":
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      throw new Error("Invalid timeframe");
  }

  return startDate;
};

async function getExecutedScripts(timeframe) {
  let startDate = getTimeFrame(timeframe);

  const executedScripts = await scriptLogModel.find({
    timestamp: { $gte: startDate },
  });

  return executedScripts;
}

async function getSucessfulScripts(timeframe) {
  let startDate = getTimeFrame(timeframe);

  const executedScripts = await scriptLogModel.find({
    timestamp: { $gte: startDate },
  });

  const successfulScripts = executedScripts.filter((script) => script.success);
  const failedScripts = executedScripts.filter((script) => !script.success);

  return { sucessful: successfulScripts.length, failed: failedScripts.length };
}

async function getSucessfulScriptsBreakdownByNodeId(timeframe) {
  let startDate = getTimeFrame(timeframe);

  const executedScripts = await scriptLogModel.find({
    timestamp: { $gte: startDate },
  });

  // Use an empty object as the initial value for the breakdown
  const breakdownByNodeId = {};

  // Use a for loop to iterate over the executed scripts
  for (const script of executedScripts) {
    // Await the result of finding the node by id
    const node = await Node.findById(script.nodeId);
    const nodeName = node.name;

    // Check if the node id is already in the breakdown object
    if (!breakdownByNodeId[script.nodeId]) {
      // If not, initialize it with zero counts and node name
      breakdownByNodeId[script.nodeId] = {
        successfulCount: 0,
        failedCount: 0,
        node_name: nodeName,
      };
    }
    // Increment the counts based on the script success
    if (script.success) {
      breakdownByNodeId[script.nodeId].successfulCount++;
    } else {
      breakdownByNodeId[script.nodeId].failedCount++;
    }
  }

  return breakdownByNodeId;
}

async function getLineChartData(timeframe) {
  let startDate = getTimeFrame(timeframe);

  const executedScripts = await scriptLogModel.find({
    timestamp: { $gte: startDate },
  });

  const data = executedScripts.reduce((acc, script) => {
    const date = script.timestamp.toISOString().split("T")[0];
    const item = acc.find(
      (item) => item.nodeId === script.nodeId && item.date === date
    );
    if (item) {
      if (script.success) {
        item.successfulCount++;
      } else {
        item.failedCount++;
      }
    } else {
      acc.push({
        nodeId: script.nodeId,
        date,
        successfulCount: script.success ? 1 : 0,
        failedCount: script.success ? 0 : 1,
      });
    }
    return acc;
  }, []);

  return data;
}

module.exports = {
  getExecutedScripts,
  getSucessfulScripts,
  getSucessfulScriptsBreakdownByNodeId,
  getLineChartData,
};
