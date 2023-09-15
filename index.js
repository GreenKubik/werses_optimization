const versesInput = document.getElementById('input');
const submit = document.getElementById('submit');
const copyButton = document.getElementById('copy');
const output = document.getElementById('output');
const templateInput = document.getElementById('template');
const inputsWrap = document.getElementById('inputs');

const startTemplate = `<i>ДЕНЬ %day%</i>

<b>Книга %book% глава %chapter%, стихи с %startVerse% по %endVerse%:</b>

%verses%`;

const defaultState = {
    template: startTemplate,
    inputs: {},
};
const state = JSON.parse(localStorage.getItem('state') ?? 'null') ?? defaultState;

templateInput.value = state.template;

const inputs = {};
const specialVariables = ['verses', 'startVerse', 'endVerse'];

const getVariables = () => templateInput.value.match(/(?<=\%)([a-zA-Z]*)(?=\%)/g);
let variables = getVariables();

const generateInputs = () => {
    inputsWrap.innerHTML = '';
    
    variables.forEach(x => {
        if (specialVariables.includes(x)) return;
    
        const label = document.createElement('label');
        label.innerText = `${x}:`;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = state.inputs?.[x] ?? '';
    
        label.append(input);
    
        inputs[x] = input;
        inputsWrap.append(label);
    });
}

const saveState = () => {
    localStorage.setItem('state', JSON.stringify({
        template: templateInput.value,
        inputs: Object.entries(inputs).reduce((acc, [k, v]) => ({...acc, [k]: v.value}), {}),
    }))
}

templateInput.addEventListener('change', e => {
    const newVariables = getVariables();

    if (newVariables.length !== variables.length) {
        variables = newVariables;
        generateInputs();
    }
})

submit.addEventListener('click', () => {
    const template = templateInput.value;
    let result = template;

    variables.forEach(x => {
        if (specialVariables.includes(x)) return;

        result = result.replace(`%${x}%`, inputs[x].value);
    });

    const value = versesInput.value;
    const chapterValue = inputs.chapter.value;

    const versesNumbers = value.match(/(?<=\n|^)[0-9]+/g);
    const startVerse = versesNumbers?.[0] ?? '';
    const endVerse = versesNumbers?.[versesNumbers.length - 1] ?? '';

    let verses = value.replace(/\n\s*\n/g, `\n${chapterValue}:`);
    verses = verses.replace(/\//g, '\n');
    verses = `${chapterValue}:${verses}`;

    result = result.replace('%verses%', verses);
    result = result.replace('%startVerse%', startVerse);
    result = result.replace('%endVerse%', endVerse);

    output.innerText = result;

    saveState();
});

const copyContent = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

copyButton.addEventListener('click', () => {
    copyContent(output.innerText).catch(null);
})

const start = () => {
    generateInputs();
}
start();
