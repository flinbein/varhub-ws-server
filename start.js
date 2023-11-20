import {WebSocketServer} from "ws";
import process from "process";
import {parse, serialize} from "xjmapper";
import VarHubServer from "varhub";
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';



const argv = yargs(hideBin(process.argv)).argv

const port = Number(argv.port ?? 8088)
const wss = new WebSocketServer({port});
const varhub = new VarHubServer();

console.log(`Start server on port ${port}`);
wss.on("connection", (connection) => {
    connection.binaryType = "nodebuffer";

    varhub.registerClient((call, exit) => {

        connection.on("close", () => exit());
        connection.on("message", async (data) => {
            try {
                const [callId, ...args] = parse(data);
                try {
                    const result = await call(...args);
                    connection.send(serialize(0, callId, result));
                } catch (error) {
                    connection.send(serialize(1, callId, error));
                }
            } catch (e) {
                connection.close(4000, "wrong data format");
            }
        });

        return {
            disconnect: (message) => connection.close(4000, message),
            sendEvent: (...data) => connection.send(serialize(2, ...data))
        };
    })
})
