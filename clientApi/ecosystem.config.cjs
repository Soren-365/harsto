const os = require("os");
module.exports = {
  apps: [
    {
      name: "app",
      script: "index.cjs",
      exec_mode: "cluster",
      watch: true,
      instances: os.cpus().length/4,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
