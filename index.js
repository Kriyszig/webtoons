const puppeteer = require('puppeteer');

async function run(title, episode) {

  let browser = await puppeteer.launch({headless: true});
  let page = await browser.newPage();
  await page.setViewport({width: 1280, height: 10000});

  await page.goto(
      `https://www.webtoons.com/en/fantasy/tower-of-god/season-1-ep-0/viewer?title_no=${
          title}&episode_no=${episode}`);
  await page.waitFor(2000);
  
  const height = await page.evaluate(() => {

    let adDiv = document.getElementById('viewerAdWrapper')
    if (adDiv != null) {
      return adDiv.offsetTop
    }

    return document.documentElement.scrollHeight - 4800;
  });

  for (let i = 0; i < height; i += 10000) {

    if (height - i < 10000) {
      await page.setViewport({width: 1280, height: height - i});
    }

    await page.waitFor(1000);
    await page.screenshot({
      path: `./webtoons/lookism/ep${episode}/p${Math.floor(i / 10000) + 1}.jpg`,
      type: 'jpeg'
    });

    if (height - i >= 10000) {
      await page.evaluate(() => {
        document.documentElement.scrollBy(0, 10000);
      });
    }
  }
  
  await page.close();
  await browser.close();
}

run(1049, 1);