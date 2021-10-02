import "module-alias/register";
import app, { start } from "./src/app";

start();

app.listen(app.get("PORT"), () =>
  console.log(`Server listening on port ${app.get("PORT")}`)
);
