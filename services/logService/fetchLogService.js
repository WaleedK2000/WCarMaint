async function getExecutedScripts(timeframe) {
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

  const executedScripts = await scriptLogModel.find({
    timestamp: { $gte: startDate },
  });

  return executedScripts;
}
