import tnai from "tnai";
import config from "./config";

var OBtnai = new tnai(config.tnaiToken);

export async function init() {
    try {
        console.log("tnai client is starting");
        await OBtnai.sfw.hug();
        console.log("tnai client is started!");
    } catch (err) {
        console.error("the tnai client did not start correctly", err);
        process.exit(1);
    }
}

export const tnaiClient = OBtnai;
export default tnaiClient;
