const mammoth = require("mammoth");
const fs = require("fs");

const options = {
  styleMap: [
    "p[style-name='title'] => title",
    "p[style-name='شاعری'] => poetry",
    "p[style-name='Quote'] => poetry",

    "p[style-name='ہیڈنگ'] => h2",
    "p[style-name='Heading 2'] => h2",

    "p[style-name='پہلا خطبہ'] => title",
    "p[style-name='عربی آیات ٹیکسٹ'] => ayat",
    "p[style-name='No Spacing'] => ayat",
    "p[style-name='farsiShair'] => ayat",
    "p[style-name='urduShair'] => ayat",
    "p[style-name='NoSpacing'] => ayat",
    "p[style-name='عربی آیات'] => ayat",
  ],
};
i = "sample_fomate";
var nameDocx = i + ".docx";
var nameHTML = i + ".html";
var myHTML = mammoth.convertToHtml().then(function (result) {
  var html = result.value;
  //html='<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>'+html+'</body></html>';
  html = html.replaceAll("<poetry>", '<h4 class="poetry">');
  html = html.replaceAll("</poetry>", "</h4>");
  html = html.replaceAll("<ayat>", '<p class="ayat">');
  html = html.replaceAll("</ayat>", "</p>");

  html = html.replaceAll("<farsiShair>", '<p class="farsiShair">');
  html = html.replaceAll("</farsiShair>", "</p>");
  html = html.replaceAll("<riwayat>", '<p class="riwayat">');
  html = html.replaceAll("</riwayat>", "</p>");
  html = html.replaceAll("<hawala>", '<p class="hawala">');
  html = html.replaceAll("</hawala>", "</p>");
  html = html.replaceAll("<Subtitle>", '<p class="Subtitle">');
  html = html.replaceAll("</Subtitle>", "</p>");
  html = html.replaceAll("ﷺ", " صَلَّی اللہُ عَلَیْہِ وَاٰلِہٖ وَسَلَّمْ ");

  var finalHtml =
    '<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>' +
    html +
    "</body></html>";

  finalHtml = finalHtml.replaceAll("<title>", '<h1 class="title">');
  finalHtml = finalHtml.replaceAll("</title>", "</h1>");

  fs.writeFileSync(nameHTML, finalHtml, { encoding: "utf8", flag: "w" });
});
