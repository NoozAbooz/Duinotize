// Wrapper script for Duinotize Miner

/* Global list to keep track of service workers */
var workersList = [];

/* Duinotize namespace */
var duinotize = {
	start: function(opts) {
		/* Default options */
		var defopts = {
			rigid: "Duinotize Miner",
			username: "coinburn",
			difficulty: "LOW",
			threads: 1,
			hasher: "DUCO-S1"
		};

		/* Set options to default if not given */
		if (typeof opts == 'undefined' || opts == null) {
			var opts = defopts;
			console.log("No options object passed, using default settings, coins will be INCINERATED (sent to coinburn account)");
		} else {
			/* Set empty options*/
			if (typeof opts.username == 'undefined' || opts.username == null) {
				opts.username = defopts.username;
				console.log("No username selected, using default username, coins will be INCINERATED (sent to coinburn account)");
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

		/* Generate randomized ID to differentiate from other Duinotize instances*/
		wallet_id = Math.floor(Math.random() * 2811);

		/* Start mining */
		if (typeof Callback != 'undefined' && Callback != null) {
			Callback();
		};

		/* Create worker for each thread */
		for (let workerID = 0; workerID < opts.threads; workerID++) {
			let socketWorker = new Worker("../main.js");
			socketWorker.postMessage('Start,' + opts.username + "," + opts.rigid + "," + wallet_id + "," + opts.difficulty + "," + workerID + "," + opts.hasher);

			/* Append workers to list */
			workersList.push(socketWorker);
		};
		console.log("List of active workers:", workersList);
	},

	terminate: function() {
		/* Terminate all workers */
		for(let socketWorker of workersList) {
			console.log("Terminating worker:", socketWorker);
	        socketWorker.terminate();
	    }
	    // Clear the array
	    workersList = [];
	}
}
