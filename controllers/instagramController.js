
const puppeteer = require("puppeteer");

async function scrapeInstagram(username) {
    const url = `https://www.instagram.com/${username}/`;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
        const script = Array.from(document.scripts).find(s => s.textContent.includes("window._sharedData"));
        const jsonText = script.textContent.match(/window\._sharedData\s=\s(.*);/)[1];
        const data = JSON.parse(jsonText);
        const user = data.entry_data.ProfilePage[0].graphql.user;

        return {
            username: user.username,
            full_name: user.full_name,
            bio: user.biography,
            external_url: user.external_url,
            followers: user.edge_followed_by.count,
            following: user.edge_follow.count,
            posts: user.edge_owner_to_timeline_media.count,
            profile_pic_url: user.profile_pic_url_hd,
            is_private: user.is_private
        };
    });

    await browser.close();
    return data;
}

module.exports = { scrapeInstagram };
