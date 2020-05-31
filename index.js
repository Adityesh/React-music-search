const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const PORT = process.env.PORT || 5000;
const app = express();
const cors = require('cors')

app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use(cors())
app.post('/scrape', async (req, res) => {
    let urlSearch = req.body.search;
    urlSearch = urlSearch.replace(/ /g, "_")
    const url = `http://mp3guild.com/mp3/${urlSearch}.html`;
    let urls = [];
    let titles = [];
    let error = false
    request(url, async (err, response, html) => {
        if(!err) {
            var $ = cheerio.load(html);
            try {
                $(".unplaying").find('div > div > div > li > a').each((index, element) => {
                    urls.push(element.attribs.href);
                })
                for(let i =1;i<=11;i++) {
                    titles.push(Object.values($(".mp3list-play")[i].attribs)[3])
                }
            }catch(e) {
                error = true;   
            }
            
        } 

        let result = [];
        for(let i=1;i<=11;i++) {
            result.push({
                url : urls[i],
                title : titles[i]
            })
        }
        result.pop()
        !error ? res.json({error : false,result}) : res.json({error : true})
    })

    

    
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})