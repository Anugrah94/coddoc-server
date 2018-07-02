const axios = require('axios');
const puppeteer = require('puppeteer');

function dataProcessing() {
  const array = [
    "function ruby", 
    "condition ruby", 
    "looping ruby",
    "class ruby",
    "output ruby",
    "input ruby",
    "constructor ruby",
    "method ruby",
    "return ruby",
    "variable ruby"
  ];
  array.forEach((value) => {
    run(value);
  });
};

async function run(keyword) {
  try {
    let doc = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    const SEARCH_FIELD = '#lst-ib';
  
    await page.goto('https://google.com');
    
    await page.click(SEARCH_FIELD);
    await page.keyboard.type(keyword);
    await page.keyboard.press("Enter");
    
    await page.waitForNavigation();
  
    for(let i=1; i<=5; i++) {
      const SELECTED_URL = `#rso > div > div > div:nth-child(${i}) > div > div > h3 > a`;
      let url = await page.evaluate((sel) => {
        if(document.querySelector(sel) !== null) {
          return document.querySelector(sel).getAttribute('href')
        }
      }, SELECTED_URL);
      doc.push(url);
    };

    let result = await axios.post('http://localhost:3000/graphql', {
      query:`
        mutation{
          saveDocumentation(syntax:"${keyword}", doc:"${doc}"){
            syntax
            doc
          }
        }
      `
    });
    console.log('-->', result)
    browser.close();
  } catch (error) {
    return error;
  }
};

dataProcessing();

module.exports = dataProcessing;