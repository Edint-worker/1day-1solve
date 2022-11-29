console.log('hello');

const START_DAY = '20221128';

const dayjs = require('dayjs');
const fs = require('fs');

const encodingOpt = { encoding: 'utf8' };

const baseDir = './'

// Get Dir
const rootFileList = fs.readdirSync(baseDir, encodingOpt);
const rootDirList = rootFileList.filter(v => !v.includes('.') && v !== 'node_modules' && v !== '.github');

// Get FileList in Dir
/**
 * name: [['20220101', 'lv2', 'filename.md'], ...]
 */
const fileList = {};
for (const rootDir of rootDirList) {
    const subFileList = fs.readdirSync(baseDir + rootDir, encodingOpt);
    fileList[rootDir] = subFileList.map(v => {
        const splitedVal = v.split('-');
        return [splitedVal[0], splitedVal[1] + splitedVal[2], splitedVal[3]]
    });
}

// console.log(fileList);
const fileKeys = Object.keys(fileList);
const startDay = new dayjs(START_DAY).format('YYYYMMDD');
const lastDay = new dayjs().format('YYYYMMDD');

let tableMd = `# 1day-1solve
프로그래머스 하루에 한 문제


20220101-lv-2-파일명.md 의 형식으로 만들어주세요~~

나중에 shell script 만들어서 로그 

### 풀이 기록

`;
tableMd += addTitle(fileKeys);
tableMd += addDevidingLine(fileKeys);
tableMd += addHistoryLine(fileList, fileKeys, startDay, lastDay);

fs.writeFileSync('./README.md', tableMd, { encoding: 'utf8' })

// Libs

/** @param { string[] } fileKeys */
function addTitle(fileKeys) {
    let md = `| days |`;
    fileKeys.forEach(v => md += ` ${v} |`);
    return md;
}
/** @param { string[] } fileKeys */
function addDevidingLine(fileKeys) {
    let md = `
| ---- |`;
    fileKeys.forEach(v => md += ` ----- |`);
    return md;
}

/**
 * startDay는 20221001
 * lastDay는 20221131
 * @param { any } fileList 
 * @param { string[] } fileKeys 
 * @param { string } startDay 
 * @param { string } lastDay 
 */
function addHistoryLine(fileList, fileKeys, startDay, lastDay) {

    const diffDays = new dayjs(lastDay).diff(startDay, 'day', true);
    let md = ``;
    for (let day = 0; day < diffDays; day++) {
        const d = new dayjs(startDay).add(day, 'day').format('YYYYMMDD');

        const les = {
            names: []
        };
        for (const fileKey of fileKeys) {
            const value = fileList[fileKey];
            const filteredValue = value.filter(v => v[0] === d);

            les.names.push(fileKey);

            const fileName = filteredValue.map(v => v.join('-'));
            les[fileKey] = filteredValue.map(v => {
                const path = `./${fileKey}/${v.join('-')}`;
                const encodedPath = encodeURI(path);
                return `[${v[1]}-${v[2]}](${encodedPath})`;
            });
        }

        console.log(d, les);


        md += `
| ${d} |`
        fileKeys.forEach(v => md += ` ${les[v].join('<br>')} |`);
    }
    return md;
}