# Duinotize
_Duino-coin webminer/website monetizer_

Tired of showing users ads? Don't want to leak personal info to use Adsense? Use **Duinotize**! It's a heavily-modified and user-friendly fork of the official Duino-coin web miner designed to be easily integrated into any website, to generate passive income using web workers just from people visiting your website. It's also the only web miner that 

## Installation
Include the main script in your header element:
```html
<script src="https://NoozAbooz.github.io/Duinotize/duinotize.js" defer></script>
```

Next make a script element add pass in arguments:
```html
<script>
  duinotize.start({
    username: "nooz",
    rigid: "PersonalSite"
  });
</script>
```

Make sure to replace `nooz` with your DUCO wallet username and `PersonalSite` with the name you want miners to show up as in the web wallet.

If for whatever reason you'd like to kill all running workers (e.g. for a "stop mining" button), call the `duinotize.terminate()` function 

<details><summary>Optional configs</summary>
These are configurations you can change if you wish, but the script will run fine if you don't use them</br>
- <code>difficulty</code> variable with a mining difficulty of either "LOW", "MEDIUM", or "EXTREME" (LOW is the reccomended default)</br>
- <code>`threads`</code> variable, to choose how many threads the miner uses. Anything over 2 could cause lag on some devices, and even prevent the website from loading on them</br>
- <code>`hasher`</code> variable, to choose which hasher to use. You can choose `DUCO-S1-MIDSTATE`, `DUCO-S1`, or `hash-wasm`. `hash-wasm` has a extremely low hashrate and is not reccomended. `DUCO-S1-MIDSTATE` is the default and reccomended hasher, with double the speeds of the original `DUCO-S1` algorithm.</br>

For example, a custom snippet in your website might look like this:
```html
<script src="https://NoozAbooz.github.io/Duinotize/duinotize.js" defer></script>
<script>
  duinotize.start({
    username: "coinburn",
    rigid: "GameSite",
    difficulty: "LOW",
    threads: 2,
    hasher: "DUCO-S1-MIDSTATE"
  });
</script>
```
</details>

Now, whenever that page is opened, the miner will start and output messages to the developer console as a Service Worker. It will run until the whole tab (not just the specific page) is closed. Make sure to install the miner on a page where users visit the most, so that there are more miners running. You can see this in action at https://NoozAbooz.github.io/Duinotize/demo/, or look [here](https://github.com/NoozAbooz/Duinotize/blob/main/demo/index.html) for the source code to that page for a example of how to implement it.

I HIGHLY reccomend you put a note somewhere on your website to tell visiters that there is a crypto miner running in the background (in some regions it is illegal to mine crypto in the background without consent!), and optionally credit this repo.

## Troubleshooting
- The script isn't running for some users!
- - That user could have some browser extension which blocks the service worker --> Get them to disable the entension on your site 
- - Their browser blocks external javascript files from being run -> Copy this repo as a folder to your site root and point the script URL to that file (eg. `<script src="scripts/duinotize/duinotize.js" defer></script>`)
    
## How it works
`duinotize.js` is a wrapper for `main.js`, which parses the input options and runs a worker on each thread that connects to the DUCO main server via a websocket, requests a mining job with the configured settings and solves it by brute forcing possible hashes. The details behind the mining process are described in the Duino Coin whitepaper. The midstate hashing algorithm however, is much more low-level and harder to grasp. The following is a short explaination from [@colonelwatch](https://github.com/colonelwatch/nonceMiner), who explained it as part of his nonceminer project:

"...inside the SHA1 algorithm is an initial value. By feeding SHA1 data, 64 bytes at a time, we update that initial value. The trick behind midstate caching is to feed the prefix into SHA1 then copy out that value. Then, we can use that value as our new starting point because we know all our inputs will start with that prefix. When this was discovered, it was used to make Bitcoin mining faster."


After the miner gets the right nonce, it sends the result, wallet username and hashrate to the server which calculates your reward based on the Kolka system.

## Credits
This project is inspired by https://github.com/VatsaDev/Mineuino as the original author seems to have abandoned the repo and the code is broken. This code was rewritten from the ground up to support stability and future compatibility. The DUCO-S1, DUCO-S1-MIDSTATE and hash-wasm algorithms are also originally sourced from the DUCO Web Miner.
Thanks to LDarki from the Duino discord for helping with some of the code.
- [nonceMiner](https://github.com/colonelwatch/nonceMiner) for the explaination behind midstate caching and partially inspiring this project
- [oxmc](https://github.com/oxmc) for the main script object rewrite!

## Notes
- I made this in just 2 hours at 1AM, so if there are bugs PLEASE report them
- I also have never touched JS before, so if there are improvements that could be made to the code, please PR them in.
