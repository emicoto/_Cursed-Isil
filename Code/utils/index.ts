import "./efun";
import "./selectcase";
import os from "os";
import fs from "fs";
import path from "path";

console.log(`It's running on ${os.platform()} ${os.arch()} ${os.release()}`);
console.log("the user is", os.userInfo().username, "and the home directory is", os.homedir());

console.log("fs, path, child_process are loaded: ", fs, path);

console.log("running utils");
