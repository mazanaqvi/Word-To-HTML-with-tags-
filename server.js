const express = require("express");
const mammoth = require("mammoth");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fileToArrayBuffer = require("file-to-array-buffer");
const fs = require("fs");
const app = express();

const port = 5001;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.post("/convert-to-html", (req, res) => {
  try {
    const arrayBuffer = req.files.file;
    console.log(arrayBuffer);

    fileToArrayBuffer(arrayBuffer).then((data) => {
      console.log(data);
    });

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
    i = "<_name>";
    var nameDocx = i + ".docx";
    var nameHTML = i + ".html";
    //Here the arrayBuffer is to be configured so that it can accept the bytes from flutter.
    var myHTML = mammoth
      .convertToHtml({ arrayBuffer: arrayBuffer }, options)
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

        var finalHtml =
          '<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>' +
          html +
          "</body></html>";

        finalHtml = finalHtml.replaceAll("<title>", '<h1 class="title">');
        finalHtml = finalHtml.replaceAll("</title>", "</h1>");
        console.log(finalHtml);
        //fs.writeFileSync(nameHTML, finalHtml, { encoding: "utf8", flag: "w" });
      });
    return res.status(200).json({ message: "hello world!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "unexpected server error" });
  }
});
app.listen(port, () => console.log(`App listening on port ${port}!`));
