const { app } = require("electron");

let mainWindow = null;

const isSecondInstance = app.makeSingleInstance(function(
  commandLine,
  workingDirectory
) {
  if (mainWindow) {
    if (process.platform === "win32") {
      mainWindow.minimize();
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
  }
  return true;
});

if (isSecondInstance) {
  app.exit();
}

app.on("ready", () => {
  mainWindow = require("./app-window")(app);
});
