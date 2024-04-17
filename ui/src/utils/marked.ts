import {marked} from 'marked'
import {getHeadingList, gfmHeadingId, HeadingData} from "marked-gfm-heading-id";

function toc(headings: HeadingData[]) {
    const contents: string[] = [];
    let previousLevel = -1;
    contents.push('<ul id="table-of-content">');
    let depth = 1;
    headings.forEach(({id, text, level}) => {
        if (previousLevel !== -1 && level > previousLevel) {
            contents.push('<ul>');
            depth++;
        }
        if (level < previousLevel) {
            contents.push('</ul>');
            depth--;
        }
        contents.push(`<li><a href="#${id}" class="h${level}">${text}</a></li>`);
        previousLevel = level;
    });
    while (depth-- > 0) {
        contents.push('</ul>');
    }
    return contents.join('');
}

const TOC_MARKER = '<!-- toc -->';

marked.use(gfmHeadingId(), {
    hooks: {
        postprocess(html) {
            return html.includes(TOC_MARKER) ? html.replace(TOC_MARKER, toc(getHeadingList())) : html;
        }
    }
});
export default marked;