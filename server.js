const express = require("express");
const imageCompression = require("browser-image-compression");
const mammoth = require("mammoth");

const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
var bodyParser = require("body-parser");

const sharp = require("sharp");

const app = express();

const port = 4000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(fileUpload());

var finalHtml;
app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.post("/compress-image", upload.single("file"), async (req, res) => {
  try {
    console.log("entered.");
    // const arrayBuffer = req.file;
    const { buffer } = req.file;
    console.log("arrayBuffer: ", buffer);

    const timestamp = new Date().toISOString();

    const ref = `${timestamp}-image.jpeg`;

    const compressedImage = await sharp(buffer)
      .jpeg({ quality: 10 })
      .toBuffer();

    res.status(200).json({ imageBuffer: compressedImage });
  } catch (error) {
    return res.status(500).json({ message: "unexpected server error" + error });
  }
});
app.post("/convert-to-html", upload.single("file"), (req, res) => {
  try {
    console.log("entered.");
    console.log(req.body);
    const arrayBuffer = req.file;
    console.log("arrayBuffer: ", arrayBuffer);

    if (!arrayBuffer) {
      return res.status(400).json({ message: "bad request" });
    }
    const options = {
      styleMap: [
        "p[style-name='title'] => title",
        "p[style-name='شاعری'] => div.urduShair > p:fresh",
        "p[style-name='Quote'] => poetry",

        "p[style-name='ہیڈنگ'] => h1",
        "p[style-name='ayat'] => ayat",
        "p[style-name='Subtitle'] => subtitle",
        "p[style-name='Heading'] => h2",
        "p[style-name='Heading 2'] => h3",
        "p[style-name='Heading 3'] => h4",
        "p[style-name='Heading 4'] => h5",
        "p[style-name='Heading 5'] => h6",
        "p[style-name='Heading 6'] => h7",
        "p[style-name='hawala'] => hawala",
        "p[style-name='پہلا خطبہ'] => title",
        "p[style-name='عربی آیات ٹیکسٹ'] => ayat",
        "p[style-name='No Spacing'] => ayat",
        "p[style-name='NoSpacing'] => ayat",
        "p[style-name='riwayat'] => riwayat",
        "p[style-name='urduShair'] => div.urduShair > p:fresh",
        "p[style-name='عربی آیات'] => ayat",
        "p[style-name='farsi n arabic Shair'] => div.farsiShair > p:fresh",
      ],
    };
    i = "temp";
    var nameDocx = i + ".docx";
    var nameHTML = i + ".html";
    //Here the arrayBuffer is to be configured so that it can accept the bytes from flutter.
    var myHTML = mammoth
      .convertToHtml(arrayBuffer, options)
      .then(function (result) {
        var html = result.value;
        //html='<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>'+html+'</body></html>';
        html = html.replaceAll("<poetry>", '<p class="poetry">');
        html = html.replaceAll("</poetry>", "<p/>");
        html = html.replaceAll("<title>", '<p class="title">');
        html = html.replaceAll("</title>", "<p/>");
        html = html.replaceAll("<ayat>", '<p class="ayat">');
        html = html.replaceAll("</ayat>", "</p>");
        html = html.replaceAll("<subtitle>", '<p class="subtitle">');
        html = html.replaceAll("</subtitle>", "</p>");

        html = html.replaceAll("<hawala>", '<p class="hawala">');
        html = html.replaceAll("</hawala>", "</p>");

        html = html.replaceAll("<riwayat>", '<p class="riwayat">');
        html = html.replaceAll("</riwayat>", "</p>");

        html = html.replaceAll(
          "ﷺ",
          " صَلَّی اللہُ عَلَیْہِ وَاٰلِہٖ وَسَلَّمْ "
        );

        finalHtml =
          '<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>' +
          html +
          "</body></html>";
        return res.status(200).json({ message: finalHtml });
      });
  } catch (error) {
    return res.status(500).json({ message: "unexpected server error" + error });
  }
});

app.get("/get-html", (req, res) => {
  res.send(finalHtml);
});
app.listen(process.env.PORT || port, () =>
  console.log(`App listening on port ${port}!`)
);
