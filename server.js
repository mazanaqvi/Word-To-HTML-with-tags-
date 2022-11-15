const express = require("express");
const mammoth = require("mammoth");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();

const port = 4000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

var finalHtml;
app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.post("/convert-to-html", (req, res) => {
  try {
    const arrayBuffer = req.files.file;
    if (!arrayBuffer) {
      return res.status(400).json({ message: "bad request" });
    }
    const options = {
      styleMap: [
        "p[style-name='title'] => title",
        "p[style-name='شاعری'] => poetry",
        "p[style-name='Quote'] => poetry",

        "p[style-name='ہیڈنگ'] => h2",
        "p[style-name='پہلا خطبہ'] => title",
        "p[style-name='عربی آیات ٹیکسٹ'] => ayat",
        "p[style-name='No Spacing'] => ayat",
        "p[style-name='NoSpacing'] => ayat",
        "p[style-name='عربی آیات'] => ayat",
      ],
    };
    i = "temp";
    var nameDocx = i + ".docx";
    var nameHTML = i + ".html";
    //Here the arrayBuffer is to be configured so that it can accept the bytes from flutter.
    var myHTML = mammoth
      .convertToHtml({ buffer: arrayBuffer.data }, options)
      .then(function (result) {
        var html = result.value;
        //html='<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>'+html+'</body></html>';
        html = html.replaceAll("<poetry>", '<h4 class="poetry">');
        html = html.replaceAll("</poetry>", "</h4>");
        html = html.replaceAll("<ayat>", '<p class="ayat">');
        html = html.replaceAll("</ayat>", "</p>");
        html = html.replaceAll(
          "ﷺ",
          " صَلَّی اللہُ عَلَیْہِ وَاٰلِہٖ وَسَلَّمْ "
        );

        finalHtml =
          '<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>' +
          html +
          "</body></html>";

        finalHtml = finalHtml.replaceAll("<title>", '<h1 class="title">');
        finalHtml = finalHtml.replaceAll("</title>", "</h1>");

        fs.writeFileSync(nameHTML, finalHtml, { encoding: "utf8", flag: "w" });
        return res.status(200).json({ message: finalHtml });
      });
  } catch (error) {
    return res.status(500).json({ message: "unexpected server error" });
  }
});
app.get("/get-html", (req, res) => {
  res.send(finalHtml);
});
app.listen(process.env.PORT || port, () =>
  console.log(`App listening on port ${port}!`)
);
