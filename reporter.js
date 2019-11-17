const { exec } = require('child_process');
const axios = require('axios');

const URL = 'https://pazerty.000webhostapp.com/macs/'
function postMacs(params) {
    exec('nmap -sP 192.168.1.0/24', (er, out) => {
        let res = out.replace(/Starting Nmap.*stand.\r\n/gi, '');
        res = res.replace(/Stats:.*?\r\n/gi, '');
        res = res.replace(/\r\nHost is/gi, '');
        res = res.replace(/up.*?\r\n/gi, '');
        res = res.replace(/MAC Address: /gi, '');
        res = res.replace(/Nmap scan report for .*?(\d)/gi, '$1');
        res = res.replace(/Nmap done: .*/gi, '');
        res = res.replace(/ +/gi, ' ');
        arr = res.split('\r\n');
        arr = arr.map(el => el.trim().split(' '))
        arr = arr.map(el => {
            let [ip, mac, ...rest] = el;
            let desc = rest.join(' ').slice(0, 63);

            ip = ip.replace(/[)()]/g, '');
            desc = desc.replace(/[)()]/g, '');
            if (!mac) {
                mac = 'FF:FF:FF:FF:FF:FF',
                    desc = 'THIS COMPUTER'
            }
            return [ip, mac, desc];
        })

        axios.post(URL, arr).then(resp => {
        })
    });
}

function update(params) {
    const filename = __filename.slice(__dirname.length + 1);
    get('https://raw.githubusercontent.com/pazerty/tp/master/'+filename)
        .then(
            ({ data }) => {
                let current = '';
                try {
                    current = readFileSync(filename, 'utf8')
                } catch (error) { }
                if (current != data) {
                    try {
                        writeFileSync(filename, data)
                    } catch (error) { }
                }
            }
        )
}

setInterval(postMacs, 20 * 60 * 1000);
setTimeout(postMacs, 5 * 60 * 1000);
setTimeout(update, 10 * 60 * 1000);

