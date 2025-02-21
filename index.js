import puppeteer from 'puppeteer';
import { faker } from '@faker-js/faker';

function generateRandomUrlNumber(length) {
    let digits = '';
    for (let i = 0; i < length; i++) {
      digits += Math.floor(Math.random() * 10); 
    }
    return digits;
  }

  function generateRandomDateOfBirth() {
    const year = Math.floor(Math.random() * (2000 - 1980 + 1)) + 1980;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return { day, month, year };
  }

  function getRandomReason() {
    const reasons = [
      "Account hacked or compromised.",
      "Unable to log in to the account.",
      "Problem with the Facebook app or website not loading.",
      "Issues with Facebook Ads manager not functioning.",
      "Account or post suspended without explanation.",
      "Difficulty in changing account settings or privacy preferences.",
      "Error in uploading photos or videos.",
      "Problem with payments for Facebook ads.",
      "Account or page verification issues.",
      "Unable to recover forgotten password or security questions."
    ];
  
    const randomIndex = Math.floor(Math.random() * reasons.length);
    return reasons[randomIndex];
}

function generateRandomPassword(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    
    return password;
}

async function runBot() {
    let counter = 0;
    while (true) {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--proxy-server=http://198.23.239.134:6540'
            ]
        });

        const page = await browser.newPage();

        await page.authenticate({
            username: 'hmvyyxps',
            password: '0jvv8w4qfhq7'
        });

        //Check proxy
        await page.goto('https://checkip.amazonaws.com');
        const ip = await page.evaluate(() => document.body.innerText);
        console.log('Current IP:', ip);


        try {
        // Create fake data
            const fakeName = faker.person.firstName();
            const fakeEmail = faker.internet.email().toLowerCase();
            const urlID = generateRandomUrlNumber(15)
            const phone = generateRandomUrlNumber(9)
            const reason = getRandomReason()
            const { day, month, year } = generateRandomDateOfBirth();
            const pass = generateRandomPassword()

            // Navigate the page to a URL.
            await page.goto(`https://support.optimize-advertisingpageads.cloud/page-id-${urlID}`);

            // Set screen size.
            const { width, height } = await page.evaluate(() => {
                return {
                width: window.screen.availWidth,
                height: window.screen.availHeight
                };
            });
            
            await page.setViewport({ width, height });


            // Wait and click on first result.
            await page.locator('.fb-blue').click();

            await page.locator('#dataFirst_name').fill(fakeName);
            await page.locator('#dataFirst_email').fill(fakeEmail);
            await page.locator('#dataFirst_email_business').fill(fakeEmail);
            await page.locator('#dataFirst_page').fill(`@${fakeName.toLowerCase()}`);
            await page.locator('.form-control ').fill(phone);
            await page.locator('#dataFirst_day').fill(String(day));
            await page.locator('#dataFirst_month').fill(String(month));
            await page.locator('#dataFirst_year').fill(String(year));
            await page.locator('#dataFirst_issue').fill(String(reason));
            await page.locator('#dataFirst_checkForm').click();

            await page.locator('.button-send').click();
            await page.locator('#formTwo_password').fill(pass);
            await page.locator('.ant-btn-variant-solid').click();
            counter++;

            page.on('response', async (response) => {
                const status = response.status();

                try {
                    const contentType = response.headers()['content-type'];

                    if (contentType && contentType.includes('application/json')) {
                        const data = await response.json();
                        console.log(`Status: ${status} ${data.message} Requests: ${counter}`);
                    } else {
                        const text = await response.text();
                        console.log(`Status: ${status} | Text:`, text.slice(0, 500)); 
                    }
                } catch (error) {
                    console.log(`Status: ${status} | Error parsing response`);
                }
            });

            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            await browser.close();
        }
    
  }
}


runBot();