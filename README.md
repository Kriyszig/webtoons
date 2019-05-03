<div style="text-align:center"><img src="https://static01.nyt.com/images/2015/07/06/business/06webtoons/06webtoons-superJumbo.jpg" /></div>

<center> <h1>Webtoons</h1> </center>

"The only ones who don't like webtoons are the ones who never experienced it" - Anonymous

### About

This project uses Google's [Puppeteer](https://github.com/GoogleChrome/puppeteer) to scrape Line Webtoons on a headless Chrome session. Due to the obvious restrictions on large screenshots, the complete webtoons will be divided into parts. These cuts of webtoon may not be clean. It may go right in middle of a scene. I apologize for the compramised viewing experience but the current implementation works this way. 

### Running the Project

This project won't be hosted on NPM or any other similar services. The enthusiastic people who want to try it out can do so by running the commands below:

```bash
git clone https://github.com/Kriyszig/webtoons.git
cd webtoons
```

Once inside the directory, you will notice a file names `test.js`. Open the file and modify the `webtoon_id` and `episode` to whichever series you desire. Then run:

```bash
node test.js
```

<b>Note</b>: The render time for page may vary from system to system. If the page doesn't complete render within the set timeout, please change the values to your liking for perfection and to get complete result.

Once the execution fiishes, you will have your favourite webtoon in `./webtoons` directory under a seperate directory under the title of the weboo you wante to download.
