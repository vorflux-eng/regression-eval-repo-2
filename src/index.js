const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
    process.exitCode = 1;
    return;
  }

  console.log(`Server listening on port ${PORT}`);
});

module.exports = server;
