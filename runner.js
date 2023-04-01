const concurrently = require("concurrently");
const { result } = concurrently(["node app.js", "node server/server.js","node cleaner.js"], {
  prefix: "name",
  killOthers: ["failure", "success"],
  restartTries: 3,
  cwd: "./",
});

result.then((idk) => {
  console.log(idk);
});
