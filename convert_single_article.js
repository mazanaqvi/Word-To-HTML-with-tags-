var mammoth = require("mammoth");
var fs = require('fs');

var options = {
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

    ]
}; 
i = '01_154_nifaq-o-munafiqat-09';
        var nameDocx = i + '.docx';
        var nameHTML = i + '.html';
        // var article_name = '71_1';
        // var nameDocx=article_name+'.docx';
        // var nameHTML=article_name+'.html';
var myHTML = mammoth.convertToHtml({ path: nameDocx }, options)
    .then(function (result) {
        var html = result.value;
        //html='<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>'+html+'</body></html>';
        html = html.replaceAll('<poetry>', '<h4 class="poetry">');
        html = html.replaceAll('</poetry>', '</h4>');
        html = html.replaceAll('<ayat>', '<p class="ayat">');
        html = html.replaceAll('</ayat>', '</p>');
        html = html.replaceAll("ﷺ", " صَلَّی اللہُ عَلَیْہِ وَاٰلِہٖ وَسَلَّمْ ");
        
        var finalHtml='<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>'+html+'</body></html>';

        finalHtml = finalHtml.replaceAll('<title>', '<h1 class="title">');
        finalHtml = finalHtml.replaceAll('</title>', '</h1>');
         

            fs.writeFileSync(nameHTML , finalHtml, { encoding: 'utf8', flag: 'w' })  
    })

