const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const ytdl = require("ytdl-core");
const fs = require("fs");


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const app = express();

app.use(helmet());

app.use("/ytd", apiLimiter);
const path = require("path");

app.get("/videos/:filename", (req, res) => {
  const filename = req.params.filename; // Get the filename from the URL parameter
  // Set the headers for the response
  res.setHeader("Content-disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-type", "application/octet-stream");

  // Set the file path and stream it to the response
  res.sendFile(filename, { root: "./videos" }, function (err) {
    if (err) {
      console.log(err);
    } else {
      try {
        fs.unlink(`./videos/${filename}`, (err) => {
          if (err) console.log(err);
          else {
            console.log(`\nDeleted file:${filename}` );

            // Get the files in current directory
            // after deletion
          }
        });
      } catch (e) {
        console.log(e);
        console.log("error removing ", filename);
      }
    }
  });
});

app.use(bodyParser.json());
app.post("/ytd", function (req, res) {
  const videoUrl = req.body.url;
  if (req.body.url.includes("https://www.youtube.com")) {
    const { BufferList } = require("bl");
    const buffer = new BufferList();
    const r = (Math.random() + 1).toString(36).substring(2);
    const options = {
      quality: "highest",
      filter: "videoandaudio",
    };
    ytdl(videoUrl, options).pipe(fs.createWriteStream(`./videos/${r}.mp4`));
    res.json({ url: r });
  } else {
    res.json({ error: "Wrong URL format" });
  }
});

app.listen(30212, "0.0.0.0", () => {
  console.log("Server started on port 30212");
});
