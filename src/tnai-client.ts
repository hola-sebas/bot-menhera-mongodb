import tnai from "tnai";
import config from "./config";

console.log("tnai client is starting");
var OBtnai = new tnai(config.tnaiToken);


OBtnai.sfw.hug().then(() => {
    console.log("tnai client is started!");
}).catch(() => {
    console.error(new Error("the tnai client did not start correctly"));
    process.exit(1);
});

export const tnaiClient = OBtnai;
export default tnaiClient;
