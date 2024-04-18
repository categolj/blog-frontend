// https://github.com/markedjs/marked/blob/master/docs/js/index.js
export const addCopyButton = () => {
    const allPres = document.querySelectorAll('pre');
    const div = document.createElement('div');
    div.innerHTML = '<div class="tooltip-copy"><img src="/copy-icon.svg" class="icon-copy" title="Click to Copy" alt="Click to Copy" /></div>';
    div.className = 'div-copy';
    allPres.forEach(pre => {
        let timeout: number;
        const copy: HTMLDivElement = div.cloneNode(true) as HTMLDivElement;
        pre.appendChild(copy);
        pre.onmouseover = function () {
            copy.classList.add('active');
        };
        pre.onmouseleave = () => {
            clearTimeout(timeout);
            copy.classList.remove('active');
            copy.classList.remove('click');
        };
        copy.onclick = () => {
            const text = filterText(pre.textContent as string);
            navigator.clipboard.writeText(text);
            copy.classList.add('click');
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                copy.classList.remove('click');
            }, 3000);
        };
    });
};

const filterText = (text: string) => {
    if (!text.startsWith('$')) {
        return text;
    }
    const lines = text.substring(1).trimStart().split('\n');
    const filtered = [];
    let i = 0;
    do {
        const line = lines[i].trimEnd();
        filtered.push(line);
        if (!line.endsWith('\\')) {
            break;
        }
        i++;
    } while (i < lines.length);
    return filtered.join('\n');
};