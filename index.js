const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const jimp = require('jimp');

const app = express();
const PORT = 8080;

const backgroundsFolderPath = path.join(__dirname, 'backgrounds/photos');

app.use((req, res, next) => {
  const startTime = new Date();

  res.on('finish', () => {
    const endTime = new Date();
    const responseTime = endTime - startTime;
    const statusCode = res.statusCode;

    console.log(
      '\x1b[36m[INFO]\x1b[0m',
      'Incoming request:',
      req.method,
      req.url,
      'Status:',
      statusCode,
      'Response Time:',
      responseTime, 'ms'
    );
  });

  next();
});

app.get('/api/generate', async (req, res) => {
  const { type, category, image } = req.query; // Extract the 'image' parameter

  console.log('\x1b[32m[+]\x1b[0m', 'Received a request to generate a quote with type:', type);
  let quote
  try {
    if (category === "Authors") {
      const authors = [
        {
          name: 'Narendra_Modi',
          filePath: './authors/narendra_modi.txt'
        },
        {
          name: 'Sundar_Pichai',
          filePath: './authors/sundar_pichai.txt'
        },
        {
          name: 'Mukesh_Ambani',
          filePath: './authors/mukesh_ambani.txt'
        },
        {
          name: 'Vikram_Sarabhai',
          filePath: './authors/vikram_sarabhai.txt'
        },
        {
          name: 'Srinivasa_Ramanujan',
          filePath: './authors/srinivasa_ramanujan.txt'
        },
        {
          name: 'Ratan_Tata',
          filePath: './authors/ratan_tata.txt'
        },
        {
          name: 'APJ_Abdul_Kalam',
          filePath: './authors/apj_abdul_kalam.txt'
        },
        {
          name: 'Satyendra_Nath_Bose',
          filePath: './authors/satyendra_nath_bose.txt'
        },
        {
          name: 'Subhash_Chandra_Bose',
          filePath: './authors/subhash_chandra_bose.txt'
        },
        {
          name: 'Har_Gobind_Khorana',
          filePath: './authors/har_gobind_khorana.txt'
        },
        {
          name: 'Mahendra_Singh_Dhoni',
          filePath: './authors/mahendra_singh_dhoni.txt'
        },
        {
          name: 'Angela_Merkel',
          filePath: './authors/Angela_Merkel.txt'
        },
        {
          name: 'Barack_Obama',
          filePath: './authors/Barack_Obama.txt'
        },
        {
          name: 'Bill_Gates',
          filePath: './authors/Bill_Gates.txt'
        },
        {
          name: 'Elon_Musk',
          filePath: './authors/Elon_musk.txt'
        },
        {
          name: 'Jeff_Bezos',
          filePath: './authors/Jeff_Bezos.txt'
        },
        {
          name: 'Malala_Yousafzai',
          filePath: './authors/Malala_Yousafzai.txt'
        },
        {
          name: 'Mark_Zuckerberg',
          filePath: './authors/Mark_Zuckerberg.txt'
        },
        {
          name: 'Michelle_Obama',
          filePath: './authors/Michelle_Obama.txt'
        },
        {
          name: 'Pope_Francis',
          filePath: './authors/Pope_Francis.txt'
        },
        {
          name: 'Warren_Buffet',
          filePath: './authors/Warren_Buffet.txt'
        },
        {
          name: 'Audrey_Hepburn',
          filePath: './authors/Audrey_Hepburn.txt'
        },
        {
          name: 'Beyonce',
          filePath: './authors/Beyonce.txt'
        },
        {
          name: 'David_Attenborough',
          filePath: './authors/David_Attenborough.txt'
        },
        {
          name: 'JK_Rowling',
          filePath: './authors/JK_Rowling.txt'
        },
        {
          name: 'Nelson_Mandela',
          filePath: './authors/Nelson_Mandela.txt'
        },
        {
          name: 'Stephen_Hawking',
          filePath: './authors/Stephen_Hawking.txt'
        },
        {
          name: 'Steve_Jobs',
          filePath: './authors/Steve_Jobs.txt'
        },
        {
          name: 'Winnie_Mandela',
          filePath: './authors/Winnie_Mandela.txt'
        },
        {
          name: 'Sachin_Tendulkar',
          filePath: './authors/Sachin_Tendulkar.txt'
        }
      ];

      if (!type) {
        type = authors[Math.floor(Math.random * (authors.length - 1))]
      }

      const author = authors.filter(author => author.name === type)[0].filePath

      quote = await fs.readFile(path.join(__dirname, author), "utf-8")

      quote = quote.split("\n")
      quote = quote[Math.floor(Math.random() * (quote.length - 1))]
    } else {
      const subjects = [
        {
          name: 'Life',
          filePath: './subjects/Life.txt'
        },
        {
          name: 'Failure',
          filePath: './subjects/Failure.txt'
        },
        {
          name: 'War',
          filePath: './subjects/War.txt'
        },
        {
          name: 'Friendship',
          filePath: './subjects/Friendship.txt'
        },
        {
          name: 'Happiness',
          filePath: './subjects/Happiness.txt'
        },
        {
          name: 'Family',
          filePath: './subjects/Family.txt'
        },
        {
          name: 'Future',
          filePath: './subjects/Future.txt'
        },
        {
          name: 'Motivation',
          filePath: './subjects/Motivation.txt'
        },
        {
          name: 'Past',
          filePath: './subjects/Past.txt'
        },
        {
          name: 'Peace',
          filePath: './subjects/Peace.txt'
        }
      ];

      if (!type) {
        type = subjects[Math.floor(Math.random * (subjects.length - 1))]
      }

      const subject = subjects.filter(subject => subject.name === type)[0].filePath

      quote = await fs.readFile(path.join(__dirname, subject), "utf-8")

      quote = quote.split("\n")
      quote = quote[Math.floor(Math.random() * (quote.length - 1))]
    }


    console.log('\x1b[32m[+]\x1b[0m', 'Fetched quote:', quote);

    if (image === 'false') {
      res.json({ quote });
      return;
    }


    const backgroundImages = await fs.readdir(backgroundsFolderPath);
    console.log('\x1b[32m[+]\x1b[0m', 'List of background images:', backgroundImages.length, 'files');

    const randomImageFileName = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    console.log('\x1b[32m[+]\x1b[0m', 'Chosen random image:', randomImageFileName);

    const imagePath = path.join(backgroundsFolderPath, randomImageFileName);
    const backgroundImage = await jimp.read(imagePath);

    console.log('\x1b[32m[+]\x1b[0m', 'Opened background image');

    backgroundImage.resize(600, 337.5);

    const combinedImage = new jimp(600, 337.5);

    combinedImage.composite(backgroundImage, 0, 0);

    const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);

    const quoteWidth = combinedImage.getWidth() - 40;
    let formattedQuote = quote;

    if (quote.includes('-')) {
      const quoteParts = quote.split('-')
      formattedQuote = quoteParts.join('\n-')
    }

    const quoteHeight = jimp.measureTextHeight(font, formattedQuote, quoteWidth);

    const x = 20;
    const y = (combinedImage.getHeight() - quoteHeight) / 2;

    combinedImage.print(font, x, y, {
      text: formattedQuote,
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_TOP
    }, quoteWidth, quoteHeight);

    console.log('\x1b[32m[+]\x1b[0m', 'Generated combined image with quote');


    const imageDataUrl = await combinedImage.getBase64Async(jimp.MIME_PNG);

    res.json({ quote, imageUrl: imageDataUrl });
  } catch (error) {
    console.error('\x1b[33m[-]\x1b[0m', 'Error fetching quote:', error.message);
    res.status(500).json({ error: 'Error fetching quote' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log('\x1b[32m[+]\x1b[0m', `Server is running on port ${PORT}`);
});

// Startup message
const startupMessage = `

\x1b[35m┏━━┓╋╋╋╋╋╋╋╋╋╋╋╋╋╋┏┓╋╋╋╋╋╋╋╋┏━━━┓╋╋╋┏┓
┗┫┣┛╋╋╋╋╋╋╋╋╋╋╋╋╋┏┛┗┓╋╋╋╋╋╋╋┗┓┏┓┃╋╋╋┃┃
╋┃┃┏━┓┏━━┳━━┳┳━┳━┻┓┏╋┳━━┳━┓╋╋┃┃┃┣━━┳┫┃┏┓╋┏┓
╋┃┃┃┏┓┫━━┫┏┓┣┫┏┫┏┓┃┃┣┫┏┓┃┏┓┓╋┃┃┃┃┏┓┣┫┃┃┃╋┃┃
┏┫┣┫┃┃┣━━┃┗┛┃┃┃┃┏┓┃┗┫┃┗┛┃┃┃┃┏┛┗┛┃┏┓┃┃┗┫┗━┛┃
┗━━┻┛┗┻━━┫┏━┻┻┛┗┛┗┻━┻┻━━┻┛┗┛┗━━━┻┛┗┻┻━┻━┓┏┛
╋╋╋╋╋╋╋╋╋┃┃╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋┏━┛┃
╋╋╋╋╋╋╋╋╋┗┛╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋╋┗━━┛\x1b[0m

  \x1b[33m                      by \x1b[36mTʜᴇ Bɪɴᴀʀʏ Asᴛᴇʀᴏᴠs\x1b[33m

    \x1b[0mThe Binary Asterovs. All rights reserved. \x1b[35m©2023\x1b[0m
      \x1b[32mAsish (Head Developer) , Sai Shreyansh (Frontend)\x1b[0m
               
`;

console.log(startupMessage);
