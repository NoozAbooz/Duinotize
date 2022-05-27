// Load in hashers

importScripts("https://mobilegmyt.github.io/Duinotize/hashers/hash-duco-s1.js")
importScripts("https://mobilegmyt.github.io/Duinotize/hashers/hash-wasm.js")

// Custom functions to get current time and make hashrate prettier
function getTime() {
    let date = new Date();
    let h = date.getHours();
    var AmOrPm = h >= 12 ? 'PM' : 'AM';
    h = (h % 12) || 12;
    let m = date.getMinutes();
    let s = date.getSeconds();

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    return `${h}:${m}:${s}${AmOrPm}`;
}

function formatHash(bytes, decimals = 2) {
    if (bytes === 0) return 'No hashrate';

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['H/s', 'kH/s', 'mH/s', 'gH/s', 'tH/s'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// When message is received, read it and parse variables from it
onmessage = function(event) {
    if (event.data.startsWith("Start")) {
        let getData = event.data.split(",");
        let result = 0;
        
        let username = getData[1];
        let rigid = getData[2];
        let wallet_id = getData[3];
        let difficulty = getData[4];
        let workerVer = getData[5];
        let hasher = getData[6];
        
        if (rigid === "") {
            rigid = Duinotize + wallet_id;
        }

        rigid = rigid + wallet_id;
        
        function connect() {
            var socket = new WebSocket("wss://magi.duinocoin.com:14808");
            socket.onopen = function(event) {
                console.log('%c' + `${getTime()} | ` + "CPU" + workerVer + ": Connected to server as: '" + rigid + "'", 'color:green');
                socket.send("JOB," + username + "," + difficulty);
            }

            socket.onmessage = async function(event) {
                var serverMessage = event.data;
                if (serverMessage.includes("3.")) {
                console.log(`${getTime()} | ` + "CPU" + workerVer + ": Debug info: " + username + " | " + wallet_id + " | " + difficulty + " | " + hasher + " | " + serverMessage);
                } else if (serverMessage.includes("GOOD")) {
                    console.log(`%c` + `${getTime()} | ` + "CPU" + workerVer + ": Share accepted: " + result, 'color:#B1FFCA');
                    socket.send("JOB," + username + "," + difficulty);
                } else if (serverMessage.includes("BAD")) {
                    console.log('%c' + `${getTime()} | ` + "CPU" + workerVer + ": Share rejected: " + result, 'color:red');
                    socket.send("JOB," + username + "," + difficulty);
                } else if (serverMessage.includes("This user doesn't exist")) {
                    console.log(`${getTime()} | ` + "CPU" + workerVer + ": User not found!");
                } else if (serverMessage.includes("Too many workers")) {
                    console.log(`${getTime()} | ` + "CPU" + workerVer + ": Too many workers");
                } else if (serverMessage.length >= 40) {
                    console.log(`%c` + `${getTime()} | ` + "CPU" + workerVer + ": Job received: " + serverMessage.replace(/(\r\n|\n|\r)/gm, ""), 'color:yellow');
                    job = serverMessage.split(",");
                    let miningDifficulty = job[2];
                    startingTime = performance.now();
                    for (result = 0; result < 100 * miningDifficulty + 1; result++) {

                        if (hasher == "DUCO-S1") {
                            hashresult = new duco.SHA1().hex(job[0] + result);
                        } else if (hasher == "hashwasm") {
                            hashresult = await hashwasm.sha1(job[0] + result);
                        }

                        if (job[1] === hashresult) {
                            endingTime = performance.now();
                            timeDifference = (endingTime - startingTime) / 1000;
                            hashrate = (result / timeDifference).toFixed(2);
                            console.log('%c' + `${getTime()} | ` + "CPU" + workerVer + ": Nonce found: " + result + " Time: " + Math.round(timeDifference) + "s Hashrate: " + formatHash(hashrate), 'color:#76E7FF');
                            socket.send(result + "," + hashrate + ",Duinotize v1.3," + rigid + ",," + wallet_id);
                            console.log("----------------------------------------");
                        }
                    }
                } else {
                    console.log(`${getTime()} | ` + "CPU" + workerVer + ": " + serverMessage);
                    console.log("Invalid message received from server.");
                }
            }
            socket.onerror = function(event) {
                console.error("CPU" + workerVer + "WebSocket error observed, trying to reconnect: ", event);
                socket.close(1000, "Reason: Error occured in WebWorker.");
                console.log("----------------------------------------");
            }
            socket.onclose = function(event) {
                console.warn("CPU" + workerVer + ": WebSocket close observed, trying to reconnect: ", event);
                setTimeout(function() {
                    connect();
                }, 15000);
            }
        }
        connect();
    } else if (event.data.startsWith("Stop")) {
        self.close();
    }
}
