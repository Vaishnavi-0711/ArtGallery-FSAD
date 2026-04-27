const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 302 || response.statusCode === 301) {
            https.get(response.headers.location, (res) => {
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            }).on('error', reject);
        } else {
            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
        }
    }).on('error', reject);
  });
};

async function main() {
    console.log("Downloading 25 images...");
    for(let i=1; i<=25; i++) {
        await download(`https://picsum.photos/seed/art${i}/800/600`, path.join(dir, `art${i}.jpg`));
        console.log(`Downloaded image ${i}`);
    }
    console.log("Done.");
}

main();
