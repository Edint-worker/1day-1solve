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
const lastDay = new dayjs().add(1, 'day').format('YYYYMMDD');

let tableMd = `# 1day-1solve

[![README Generator](https://github.com/Edint-worker/1day-1solve/actions/workflows/generate-readme.yaml/badge.svg)](https://github.com/Edint-worker/1day-1solve/actions/workflows/generate-readme.yaml)

20220101-lv-2-파일명.md 의 형식으로 만들어주세요~~

2022-12-14 / Lv2 / https://school.programmers.co.kr/learn/courses/30/lessons/12899

2022-12-13 / Lv2 / https://school.programmers.co.kr/learn/courses/30/lessons/131130

2022-12-12 / 휴식

2022-12-07 / Lv2 / https://school.programmers.co.kr/learn/courses/30/lessons/42883 (easy)

2022-12-06 / Lv2 / https://school.programmers.co.kr/learn/courses/30/lessons/12946

2022-12-05 / Lv2 / https://school.programmers.co.kr/learn/courses/30/lessons/135807

2022-12-02 / Lv2 / https://school.programmers.co.kr/learn/courses/30/lessons/132265

2022-12-01 / Lv2 / https://school.programmers.co.kr/learn/courses/30/lessons/138476

2022-11-30 / Lv1 / https://school.programmers.co.kr/learn/courses/30/lessons/81301 (kakao)

2022-11-29 / Lv1 / https://school.programmers.co.kr/learn/courses/30/lessons/132267

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

                const first = v[0];
                // lv2 -> lv-2
                const second = v[1].slice(0, 2) + '-' + v[1].slice(2, 3);
                const last = v[2];

                const path = `https://github.com/Edint-worker/1day-1solve/blob/main/${fileKey}/${[first, second, last].join('-')}`;
                const encodedPath = encodeURI(path);
                return `[${v[1]}-${v[2]}](${encodedPath})`;
            });
        }

        md += `
| ${d} |`
        fileKeys.forEach(v => md += ` ${les[v].join('<br>')} |`);
    }
    return md;
}
