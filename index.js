var mammoth = require("mammoth");
var fs = require('fs');

var options = {
    styleMap: [

        "p[style-name='title'] => title",
        "p[style-name='شاعری'] => poetry",
        "p[style-name='ہیڈنگ'] => h2",
        "p[style-name='پہلا خطبہ'] => title",
        "p[style-name='عربی آیات ٹیکسٹ'] => ayat",
        "p[style-name='عربی آیات'] => ayat",

    ]
}; 
var i=80;
var nameDocx=i.toString()+'.docx';
var nameHTML=i.toString()+'.html';

var myHTML=mammoth.convertToHtml({path: nameDocx},options)
    .then(function(result){
        var html = result.value; 
            //html='<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>'+html+'</body></html>';
            html=html.replaceAll('<poetry>','<h4 class="poetry">');
            html=html.replaceAll('</poetry>','</h4>');
            html=html.replaceAll('<ayat>','<p class="ayat">');
            html=html.replaceAll('</ayat>','</p>');
        const htmlFullText = html.split("<title>");
        var htmlTitles = []; 


        htmlTitles.push(htmlFullText[0]);
        var splittedHTML;
        for (var i = 1; i < htmlFullText.length; i++){
            
            
            if (i < htmlFullText.length - 1) {
                htmlFullText[i] = '<title>' + htmlFullText[i];
                var lastIndex=htmlFullText[i].lastIndexOf("<p>");
                if (lastIndex > 0) {
                    htmlTitles.push(htmlFullText[i].substring(lastIndex, htmlFullText[i].length));
                    htmlFullText[i] = htmlFullText[i].substring(0, lastIndex);
                }
            }
            else {
                var swalIndex = -1;

                if (htmlFullText[i].indexOf("SAWA")>0)
                {
                    swalIndex = htmlFullText[i].indexOf("SAWA");
                }
                else if (htmlFullText[i].indexOf("sawa") > 0)
                {
                    swalIndex = htmlFullText[i].indexOf("sawa");

                }

                
                if (swalIndex > 0) { 
                    
                   console.log(swalIndex);
                    var beforeString = htmlFullText[i].substring(0, swalIndex);
                        var paraIndex = beforeString.lastIndexOf("<p>");
                   
                    if (paraIndex > 0) {

                        console.log(paraIndex);
                     beforeString = htmlFullText[i].substring(0, paraIndex);
                        
                    var afterString = htmlFullText[i].substring(paraIndex, htmlFullText[i].length);

                        htmlFullText[i] = beforeString;
                        var parEndString = "</p>";
                        var titleEnd = afterString.indexOf(parEndString);
                        titleEnd = titleEnd + parEndString.length;
                        var afterStrTitle = afterString.substring(0, titleEnd);
                        htmlTitles.push(afterStrTitle);
                        var afterStrText = afterString.substring(titleEnd, afterString.length);
                        htmlFullText.push(afterStrText);
                        

                        

                        


                    }
                }


            }

            
        }
        for (var i = 0; i < htmlTitles.length; i++) { 
            htmlTitles[i] = htmlTitles[i].replaceAll('<p>', '');
            htmlTitles[i] = htmlTitles[i].replaceAll('</p>', '');
        }

       
        console.log(htmlFullText.length.toString() + ' ' + htmlTitles.length.toString());
        for (var i = 0;i<htmlTitles.length;i++)
        { 
            console.log(htmlTitles[i]);  
            
            
                var finalHtml='<html dir="rtl" lang="ur"><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>'+htmlFullText[i+1]+'</body></html>';
                    finalHtml=finalHtml.replaceAll('title','h1');
            fs.writeFileSync(htmlTitles[i] + '.html', finalHtml, { encoding: 'utf8', flag: 'w' })
            };
            //

        var messages = result.messages; // Any messages, such as warnings during conversion
    })
    .done();
