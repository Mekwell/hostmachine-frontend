const fs = require('fs');
const path = require('path');
const https = require('https');

const bannersDir = path.join(__dirname, '../public/banners');

if (!fs.existsSync(bannersDir)) {
    fs.mkdirSync(bannersDir, { recursive: true });
}

// Map shortcodes to reliable Image URLs
const mapping = {
    'ac': 'https://cdn.akamai.steamstatic.com/steam/apps/244210/header.jpg',
    'ahl': 'https://cdn.akamai.steamstatic.com/steam/apps/70/header.jpg',
    'ahl2': 'https://cdn.akamai.steamstatic.com/steam/apps/240/header.jpg',
    'ark': 'https://cdn.akamai.steamstatic.com/steam/apps/346110/header.jpg',
    'arma3': 'https://cdn.akamai.steamstatic.com/steam/apps/107410/header.jpg',
    'armar': 'https://cdn.akamai.steamstatic.com/steam/apps/1874880/header.jpg',
    'ats': 'https://cdn.akamai.steamstatic.com/steam/apps/270880/header.jpg',
    'av': 'https://cdn.akamai.steamstatic.com/steam/apps/445220/header.jpg',
    'bb': 'https://cdn.akamai.steamstatic.com/steam/apps/70/header.jpg',
    'bb2': 'https://cdn.akamai.steamstatic.com/steam/apps/346330/header.jpg',
    'bmdm': 'https://cdn.akamai.steamstatic.com/steam/apps/362890/header.jpg',
    'bo': 'https://cdn.akamai.steamstatic.com/steam/apps/296300/header.jpg',
    'bs': 'https://cdn.akamai.steamstatic.com/steam/apps/225600/header.jpg',
    'bt': 'https://cdn.akamai.steamstatic.com/steam/apps/602960/header.jpg',
    'btl': 'https://cdn.akamai.steamstatic.com/steam/apps/1106930/header.jpg',
    'cc': 'https://cdn.akamai.steamstatic.com/steam/apps/355180/header.jpg',
    'ck': 'https://cdn.akamai.steamstatic.com/steam/apps/1621690/header.jpg',
    'cmw': 'https://cdn.akamai.steamstatic.com/steam/apps/219640/header.jpg',
    'cod': 'https://cdn.akamai.steamstatic.com/steam/apps/2620/header.jpg',
    'cod2': 'https://cdn.akamai.steamstatic.com/steam/apps/2630/header.jpg',
    'cod4': 'https://cdn.akamai.steamstatic.com/steam/apps/7940/header.jpg',
    'coduo': 'https://cdn.akamai.steamstatic.com/steam/apps/2640/header.jpg',
    'codwaw': 'https://cdn.akamai.steamstatic.com/steam/apps/10090/header.jpg',
    'col': 'https://cdn.akamai.steamstatic.com/steam/apps/466450/header.jpg',
    'cs': 'https://cdn.akamai.steamstatic.com/steam/apps/10/header.jpg',
    'cs2': 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
    'cscz': 'https://cdn.akamai.steamstatic.com/steam/apps/80/header.jpg',
    'csgo': 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
    'css': 'https://cdn.akamai.steamstatic.com/steam/apps/240/header.jpg',
    'ct': 'https://cdn.akamai.steamstatic.com/steam/apps/1307550/header.jpg',
    'dab': 'https://cdn.akamai.steamstatic.com/steam/apps/291550/header.jpg',
    'dayz': 'https://cdn.akamai.steamstatic.com/steam/apps/221100/header.jpg',
    'dmc': 'https://cdn.akamai.steamstatic.com/steam/apps/40/header.jpg',
    'dod': 'https://cdn.akamai.steamstatic.com/steam/apps/30/header.jpg',
    'dodr': 'https://cdn.akamai.steamstatic.com/steam/apps/1043390/header.jpg',
    'dods': 'https://cdn.akamai.steamstatic.com/steam/apps/300/header.jpg',
    'doi': 'https://cdn.akamai.steamstatic.com/steam/apps/447820/header.jpg',
    'dst': 'https://cdn.akamai.steamstatic.com/steam/apps/322330/header.jpg',
    'dys': 'https://cdn.akamai.steamstatic.com/steam/apps/17520/header.jpg',
    'eco': 'https://cdn.akamai.steamstatic.com/steam/apps/382310/header.jpg',
    'em': 'https://cdn.akamai.steamstatic.com/steam/apps/17740/header.jpg',
    'ets2': 'https://cdn.akamai.steamstatic.com/steam/apps/227300/header.jpg',
    'fctr': 'https://cdn.akamai.steamstatic.com/steam/apps/427520/header.jpg',
    'fof': 'https://cdn.akamai.steamstatic.com/steam/apps/265630/header.jpg',
    'gmod': 'https://cdn.akamai.steamstatic.com/steam/apps/4000/header.jpg',
    'hcu': 'https://cdn.akamai.steamstatic.com/steam/apps/523330/header.jpg',
    'hl2dm': 'https://cdn.akamai.steamstatic.com/steam/apps/320/header.jpg',
    'hldm': 'https://cdn.akamai.steamstatic.com/steam/apps/70/header.jpg',
    'hldms': 'https://cdn.akamai.steamstatic.com/steam/apps/240/header.jpg',
    'hw': 'https://cdn.akamai.steamstatic.com/steam/apps/393420/header.jpg',
    'hz': 'https://cdn.akamai.steamstatic.com/steam/apps/1264280/header.jpg',
    'ins': 'https://cdn.akamai.steamstatic.com/steam/apps/222880/header.jpg',
    'inss': 'https://cdn.akamai.steamstatic.com/steam/apps/581320/header.jpg',
    'ios': 'https://cdn.akamai.steamstatic.com/steam/apps/354540/header.jpg',
    'jc2': 'https://cdn.akamai.steamstatic.com/steam/apps/259080/header.jpg',
    'jc3': 'https://cdn.akamai.steamstatic.com/steam/apps/434030/header.jpg',
    'jk2': 'https://cdn.akamai.steamstatic.com/steam/apps/6030/header.jpg',
    'kf': 'https://cdn.akamai.steamstatic.com/steam/apps/1250/header.jpg',
    'kf2': 'https://cdn.akamai.steamstatic.com/steam/apps/232090/header.jpg',
    'l4d': 'https://cdn.akamai.steamstatic.com/steam/apps/500/header.jpg',
    'l4d2': 'https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg',
    'mh': 'https://cdn.akamai.steamstatic.com/steam/apps/629760/header.jpg',
    'nd': 'https://cdn.akamai.steamstatic.com/steam/apps/17710/header.jpg',
    'nec': 'https://cdn.akamai.steamstatic.com/steam/apps/1203620/header.jpg',
    'nmrih': 'https://cdn.akamai.steamstatic.com/steam/apps/224260/header.jpg',
    'ns2': 'https://cdn.akamai.steamstatic.com/steam/apps/4920/header.jpg',
    'ns2c': 'https://cdn.akamai.steamstatic.com/steam/apps/4920/header.jpg',
    'ohd': 'https://cdn.akamai.steamstatic.com/steam/apps/1133680/header.jpg',
    'onset': 'https://cdn.akamai.steamstatic.com/steam/apps/1105810/header.jpg',
    'opfor': 'https://cdn.akamai.steamstatic.com/steam/apps/50/header.jpg',
    'pc': 'https://cdn.akamai.steamstatic.com/steam/apps/234630/header.jpg',
    'pc2': 'https://cdn.akamai.steamstatic.com/steam/apps/378860/header.jpg',
    'pvkii': 'https://cdn.akamai.steamstatic.com/steam/apps/17570/header.jpg',
    'pvr': 'https://cdn.akamai.steamstatic.com/steam/apps/555160/header.jpg',
    'pw': 'https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg',
    'pz': 'https://cdn.akamai.steamstatic.com/steam/apps/108600/header.jpg',
    'q2': 'https://cdn.akamai.steamstatic.com/steam/apps/2320/header.jpg',
    'q3': 'https://cdn.akamai.steamstatic.com/steam/apps/2200/header.jpg',
    'q4': 'https://cdn.akamai.steamstatic.com/steam/apps/2210/header.jpg',
    'ql': 'https://cdn.akamai.steamstatic.com/steam/apps/282440/header.jpg',
    'qw': 'https://cdn.akamai.steamstatic.com/steam/apps/2310/header.jpg',
    'ricochet': 'https://cdn.akamai.steamstatic.com/steam/apps/60/header.jpg',
    'ro': 'https://cdn.akamai.steamstatic.com/steam/apps/1200/header.jpg',
    'rtcw': 'https://cdn.akamai.steamstatic.com/steam/apps/9010/header.jpg',
    'rust': 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg',
    'rw': 'https://cdn.akamai.steamstatic.com/steam/apps/324080/header.jpg',
    'sb': 'https://cdn.akamai.steamstatic.com/steam/apps/211820/header.jpg',
    'sbots': 'https://cdn.akamai.steamstatic.com/steam/apps/675080/header.jpg',
    'scpsl': 'https://cdn.akamai.steamstatic.com/steam/apps/700330/header.jpg',
    'scpslsm': 'https://cdn.akamai.steamstatic.com/steam/apps/700330/header.jpg',
    'sdtd': 'https://cdn.akamai.steamstatic.com/steam/apps/251570/header.jpg',
    'sf': 'https://cdn.akamai.steamstatic.com/steam/apps/526870/header.jpg',
    'sm': 'https://cdn.akamai.steamstatic.com/steam/apps/1370100/header.jpg',
    'squad': 'https://cdn.akamai.steamstatic.com/steam/apps/393380/header.jpg',
    'squad44': 'https://cdn.akamai.steamstatic.com/steam/apps/736220/header.jpg',
    'st': 'https://cdn.akamai.steamstatic.com/steam/apps/544550/header.jpg',
    'stn': 'https://cdn.akamai.steamstatic.com/steam/apps/824510/header.jpg',
    'sven': 'https://cdn.akamai.steamstatic.com/steam/apps/225840/header.jpg',
    'terraria': 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg',
    'tf': 'https://cdn.akamai.steamstatic.com/steam/apps/1610420/header.jpg',
    'tf2': 'https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg',
    'tfc': 'https://cdn.akamai.steamstatic.com/steam/apps/20/header.jpg',
    'ti': 'https://cdn.akamai.steamstatic.com/steam/apps/376210/header.jpg',
    'tu': 'https://cdn.akamai.steamstatic.com/steam/apps/394690/header.jpg',
    'unt': 'https://cdn.akamai.steamstatic.com/steam/apps/304930/header.jpg',
    'ut': 'https://cdn.akamai.steamstatic.com/steam/apps/13240/header.jpg',
    'ut2k4': 'https://cdn.akamai.steamstatic.com/steam/apps/13230/header.jpg',
    'ut3': 'https://cdn.akamai.steamstatic.com/steam/apps/13210/header.jpg',
    'ut99': 'https://cdn.akamai.steamstatic.com/steam/apps/13240/header.jpg',
    'vh': 'https://cdn.akamai.steamstatic.com/steam/apps/892970/header.jpg',
    'wf': 'https://cdn.akamai.steamstatic.com/steam/apps/922710/header.jpg',
    'wurm': 'https://cdn.akamai.steamstatic.com/steam/apps/366220/header.jpg',
    'zmr': 'https://cdn.akamai.steamstatic.com/steam/apps/299040/header.jpg',
    'zps': 'https://cdn.akamai.steamstatic.com/steam/apps/17500/header.jpg',
    
    // Fallbacks
    'mc': 'https://wallpapers.com/images/featured/minecraft-ohsrsh0628896gbp.jpg',
    'mcb': 'https://wallpapers.com/images/featured/minecraft-ohsrsh0628896gbp.jpg',
    'pmc': 'https://wallpapers.com/images/featured/minecraft-ohsrsh0628896gbp.jpg',
    'vpmc': 'https://wallpapers.com/images/featured/minecraft-ohsrsh0628896gbp.jpg',
    'wmc': 'https://wallpapers.com/images/featured/minecraft-ohsrsh0628896gbp.jpg',
    'nginx': 'https://www.f5.com/content/dam/f5/corp/global/f5-nginx-logo.png',
    'nodejs': 'https://miro.medium.com/v2/resize:fit:1200/1*u5_Z6IdZey9v9v9v9v9v9v.png',
    'ghost': 'https://ghost.org/changelog/content/images/2023/01/ghost-og.png',
    'wordpress': 'https://s.w.org/style/images/about/WordPress-logotype-wmark.png',
    'ts3': 'https://www.teamspeak.com/static/teamspeak-og.png',
    'mumble': 'https://www.mumble.info/img/mumble-logo.png'
};

console.log('>>> Starting Ultra Asset Synchronization...');

const sync = async () => {
    for (const [id, url] of Object.entries(mapping)) {
        const filePath = path.join(bannersDir, `${id}.jpg`);
        // if (fs.existsSync(filePath)) continue;

        console.log(`- Syncing: ${id}`);
        
        await new Promise((resolve) => {
            const file = fs.createWriteStream(filePath);
            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    console.error(`  ! Status ${response.statusCode} for ${id}`);
                    fs.unlinkSync(filePath);
                    resolve();
                    return;
                }
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlinkSync(filePath);
                console.error(`  ! Failed ${id}: ${err.message}`);
                resolve();
            });
        });
    }
    console.log('>>> Synchronization Complete.');
};

sync();
