// Load hashing algorithms
importScripts("hashers/hash-duco-s1.js")
importScripts("hashers/hash-duco-midstate.js")
importScripts("hashers/hash-wasm.js")

// Custom current time for logging purposes
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

// Make hashrate prettier
function formatHash(bytes, decimals = 2) {
    if (bytes === 0) return 'No hashrate';

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['H/s', 'kH/s', 'mH/s', 'gH/s', 'tH/s'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// When message is received from duinotize.js, read it and parse variables from it
onmessage = function(event) {
    if (event.data.startsWith("Start")) {
        let time_stop = performance.now();
        let getData = event.data.split(",");
        let result = 0;
        
        let username = getData[1];
        let rigid = getData[2];
        let wallet_id = getData[3];
        let difficulty = getData[4];
        let workerID = getData[5];
        let hasher = getData[6];
        
        if (rigid === "") {
            rigid = "Duinotize-";
        }

        rigid = rigid + wallet_id;
        
        function connect() {
            // fetch('https://server.duinocoin.com/getPool')
            // .then(response => response.json())
            // .then(data => {
            //     ip = data.ip;
            //     port = data.port;
            // })

            try {
                var socket = new WebSocket(`wss://magi.duinocoin.com:14808`);
            } 
            catch (error) {
                console.error('DUCO server is down?: ' + error);
            }

            socket.onopen = function(event) {
                console.log('%c' + `${getTime()} | ` + "CPU" + workerID + ": Connected to server as: '" + rigid + "'", 'color:green');
                socket.send("JOB," + username + "," + difficulty);
            }

            socket.onmessage = async function(event) {
                var serverMessage = event.data;
                if (serverMessage.includes("4.")) {
                console.log(`${getTime()} | ` + "CPU" + workerID + ": Debug info: " + username + " | " + "ID:" + wallet_id + " | " + difficulty + " | " + hasher + " | " + serverMessage);
                } else if (serverMessage.includes("GOOD")) {
                    console.log(`%c` + `${getTime()} | ` + "CPU" + workerID + ": Share accepted: " + result, 'color:#B1FFCA');
                    console.log("----------------------------------------");
                    socket.send("JOB," + username + "," + difficulty);
                } else if (serverMessage.includes("BAD")) {
                    console.log('%c' + `${getTime()} | ` + "CPU" + workerID + ": Share rejected: " + result, 'color:red');
                    socket.send("JOB," + username + "," + difficulty);
                } else if (serverMessage.includes("This user doesn't exist")) {
                    console.log(`${getTime()} | ` + "CPU" + workerID + ": User not found!", 'color:red');
                } else if (serverMessage.includes("Too many workers")) {
                    console.log(`${getTime()} | ` + "CPU" + workerID + ": Too many workers", 'color:red');
                } else if (serverMessage.length >= 40) {
                    console.log(`%c` + `${getTime()} | ` + "CPU" + workerID + ": Job received: " + serverMessage, 'color:yellow');
                    job = serverMessage.split(",");
                    difficulty = job[2];

                    startingTime = performance.now();
                    const midstate = new Rusha.createHash();
                    for (result = 0; result < 100 * difficulty + 1; result++) {
                        if (hasher == "DUCO-S1") {
                            hashresult = new duco.SHA1().hex(job[0] + result);
                        } else if (hasher == "DUCO-S1-MIDSTATE") {
                            hashresult = midstate.update(job[0] + result).digest('hex');
                        } else if (hasher == "hash-wasm") {
                            hashresult = await hashwasm.sha1(job[0] + result);
                        }

                        if (job[1] === hashresult) {
                            endingTime = performance.now();
                            timeDifference = (endingTime - startingTime) / 1000;
                            hashrate = (result / timeDifference).toFixed(2);

                            socket.send(result + "," + hashrate + ",Duinotize Web v1.4," + rigid + ",," + wallet_id);
                            console.log('%c' + `${getTime()} | ` + "CPU" + workerID + ": Nonce found: " + result + " Time: " + Math.round(timeDifference) + "s Hashrate: " + formatHash(hashrate), 'color:#76E7FF');
                        }
                    }
                } else {
                    console.log(`${getTime()} | ` + "CPU" + workerID + ": " + serverMessage);
                    console.log("Invalid message received from server.");
                }
            }
            socket.onerror = function(event) {
                console.error("CPU" + workerID + "WebSocket error observed, trying to reconnect: ", event);
                socket.close(1000, "Reason: Error occured in WebWorker.");
                console.log("----------------------------------------");
            }
            socket.onclose = function(event) {
                console.warn("CPU" + workerID + ": WebSocket close observed, trying to reconnect: ", event);
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
