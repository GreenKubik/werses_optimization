const input = document.getElementById('input');
const submit = document.getElementById('submit');
const output = document.getElementById('output');
const chapter = document.getElementById('chapter');

submit.addEventListener('click', () => {
    const value = input.value;
    const chapterValue = chapter.value;

    let str = value.replace(/\n\s*\n/g, `\n${chapterValue}:`);
    str = str.replace(/\//g, '\n');
    str = `${chapterValue}:${str}`;


    output.innerText = str;
});
