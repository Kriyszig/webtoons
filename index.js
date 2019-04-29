const puppeteer = require('puppeteer');
const fs = require('fs');

async function webtoons(page, title, episode, progress = false) {
  /*
   * As mentioned above, the URL changes dynamically.
   * Splitting the URL at every "/" and comapring with the URL above, we see the new URL will
   * give the name of the series at index 5
   */
  const url = await page.url();
  const name = url.split('/')[5];

  /*
   * MAking sure directories exist to store the webtoon.
   * Current saving path is of the format:
   * ./webtoons/name_of_the_webtoon_series/episode_number/part_x.jpg
   */
  if (progress) {
    console.log('Session: Checking folder structure');
  }
  if (!fs.existsSync(`./webtoons/`)) {
    fs.mkdirSync(`./webtoons/`);
  }
  if (!fs.existsSync(`./webtoons/${name}/`)) {
    fs.mkdirSync(`./webtoons/${name}/`);
  }
  if (!fs.existsSync(`./webtoons/${name}/ep${episode}/`)) {
    fs.mkdirSync(`./webtoons/${name}/ep${episode}/`);
  }

  // Fetching the height of the webtoon
  const height = await page.evaluate(() => {
    /*
     * At the end of every webtoon is an ad. This ad is bound to a HTML div with Id
     * "viewerAdWrapper". Getting the offset of this div from top is same as finding 
     * the net height of the webtoon
     */
    let adDiv = document.getElementById('viewerAdWrapper')
    if (adDiv != null) {
      return adDiv.offsetTop
    }

    /*
     * In case there exists no ad (weird!), we approximate the webtoon to end 4800px from
     * the bottom of the page.
     */
    return document.documentElement.scrollHeight - 4800;
  });

  /*
   * Iterating over the entire height of webtoon and capturing screenshots of size of viewport
   * in chunks until we finally capture the entire webtoon
   */
  let chunks = Math.ceil(height / 10000);
  for (let i = 0; i < height; i += 10000) {
    /*
     * For the final chunk, the height may not be equal to the height of the current viewport.
     * Hence changing height to fit the final part exactly within the screen
     */
    if (progress) {
      console.log(`Session Progress: ${((Math.floor((i) / 10000)) / chunks) * 100}%`);
    }
    if (height - i < 10000) {
      await page.setViewport({ width: 1280, height: height - i });
      await page.evaluate(() => {
        document.documentElement.scrollBy(0, 10000);
      });
    }
    await page.waitFor(1500); // Awaiting render after scrolldown action
    await page.screenshot({
      path: `./webtoons/${name}/ep${episode}/p${Math.floor(i / 10000) + 1}.jpg`,
      type: 'jpeg'
    });

    // No need to scroll after the final part
    if (height - (i + 10000) >= 10000) {
      await page.evaluate(() => {
        document.documentElement.scrollBy(0, 10000);
      });
    }
  }
  if (progress) {
    console.log('Session Progress: 100%');
  }
}

async function download(webtoonID, start, end, progress = false) {
  /*
     * Starting a headleess session of chromium with Puppeteer
     * Note: Alter {headless: true} to {headless: flase} to see automated operations in action
     * Setting Viewport to 1280 * 10000
     * Note: 10000 was found to be a safe limit for long screenshot rendering. Somewhere between
     * 10000px and 15000px, chrome fails to grab a complete screenshot of the page 
     */
  if (progress) {
    console.log('Download Session: Started');
    console.log('Seesion: Starting Chromium');
  }
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  for (let i = start; i <= end; ++i) {
    await page.setViewport({ width: 1280, height: 10000 });
    /*
   * Setting the target webtoon URL.
   * The url format is exactly as shown below. 
   * On Line Webtoons, just changing the title_no and episode_no params will automatically
   * redirect to the specified webtoon at the specified episode and implicitly changes the URL
   * to match the webtoon 
   */
    if (progress) {
      console.log('Session: Launching Line Webtoon');
    }
    await page.goto(
      `https://www.webtoons.com/en/fantasy/tower-of-god/season-1-ep-0/viewer?title_no=${
      webtoonID}&episode_no=${i}`);
    await page.waitFor(2000); // Allowing time to complete render
    await webtoons(page, webtoonID, i, progress);
  }

  // Closing page and the chromium session
  await page.close();
  await browser.close();
  if (progress) {
    console.log('Download Session: Finished');
  }
}

async function downloadSingle(webtoonID, episode, progress) {
  await download(webtoonID, episode, episode, progress);
}

module.exports.webtoons = downloadSingle;
module.exports.batchDownload = download;