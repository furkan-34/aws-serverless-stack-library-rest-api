import { UserStack } from "./UserStack";
import { NoteStack } from "./NoteStack";
import { ResourceStack } from "./ResourceStack";
import { App } from "@serverless-stack/resources";

/**
 * @param {App} app
 */
export default  function main(app) {

  app.setDefaultFunctionProps({
    environment: { 
      STAGE: process.env.STAGE,
      DB_URL: process.env.DB_URL 
    },
    runtime: "nodejs16.x",
    srcPath: "src",
    bundle: {
      format: "esm",
    },
  });
  
  app
  .stack(ResourceStack, { id: `resource-stack` })
  .stack(UserStack, { id: `user-stack` })
  .stack(NoteStack, { id: `note-stack` })

}
