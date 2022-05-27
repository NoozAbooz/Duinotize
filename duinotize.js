function Duinotize(opts, onstart) {
  /* Def opts */
  var defopts = {
    rigid: "Duinotize Miner",
    username: "rpinews",
    difficulty: "LOW",
    threads: 1,
    hasher: "DUCO-S1"
  };
  /* Set opts */
  if (typeof opts == 'undefined' || opts == null) {
    var opts = defopts;
    console.log("No options object passed, using default settings, coins will be recived by duinotize developer rpinews");
  } else {
    /* Set empty options*/
    if (typeof opts.username == 'undefined' || opts.username == null) {
      opts.username = defopts.username;
      console.log("No username selected, using default username, coins will be recived by duinotize developer rpinews");
    };
    if (typeof opts.hasher == 'undefined' || opts.hasher == null) {
      opts.hasher = defopts.hasher;
      console.log("No hasher selected, using default hasher");
    };
    if (typeof opts.threads == 'undefined' || opts.threads == null) {
      opts.threads = defopts.threads;
      console.log("No threads set, using default amount: 1");
    };
    if (typeof opts.rigid == 'undefined' || opts.rigid == null) {
      opts.rigid = defopts.rigid;
      console.log("No rigid set, using default: Duinotize Miner");
    };
    if (typeof opts.difficulty == 'undefined' || opts.difficulty == null) {
      opts.difficulty = defopts.difficulty;
      console.log("No difficulty set, using default: LOW");
    };
  };
  /* Variables */
  wallet_id = Math.floor(Math.random() * 2811);
  let workerVer = 0;
  /* Start mining */
  if (typeof Callback != 'undefined' && Callback != null) {
    Callback();
  };
  for (let workersAmount = 0; workersAmount < opts.threads; workersAmount++) {
    let socketWorker = new Worker("https://oxmc.github.io/Duinotize/main.js");
    socketWorker.postMessage('Start,' + opts.username + "," + opts.rigid + "," + wallet_id + "," + opts.difficulty + "," + workerVer + "," + opts.hasher);
    workerVer++;
  };
};
