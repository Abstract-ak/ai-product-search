const logError = (label, error) => {
  const message = error && error.message ? error.message : "Unknown error";
  console.error(`${label}: ${message}`);
};

module.exports = {
  logError,
};
