import {marked, Marked} from 'marked'
import {getHeadingList, gfmHeadingId, HeadingData} from "marked-gfm-heading-id";
import {markedHighlight} from "marked-highlight";
import markedAlert from 'marked-alert'
import hljs from 'highlight.js';

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

export class PlainTextRenderer extends marked.Renderer {
    heading(text: string): string {
        return text + '\n';
    }

    paragraph(text: string): string {
        return text + '\n';
    }

    link(_href: string, _title: string, text: string): string {
        return text;
    }

    image(_href: string, _title: string, text: string): string {
        return text;
    }

    listitem(text: string): string {
        return text + '\n';
    }

    list(body: string, _ordered: boolean, _start: number): string {
        return body;
    }

    blockquote(text: string): string {
        return text + '\n';
    }

    code(code: string, _infostring: string | undefined, _escaped: boolean): string {
        return code + '\n';
    }

    codespan(text: string): string {
        return text;
    }

    strong(text: string): string {
        return text;
    }

    em(text: string): string {
        return text;
    }

    del(text: string): string {
        return text;
    }

    html(_html: string): string {
        return '';  // HTMLタグを無視
    }

    text(text: string): string {
        return text;
    }
}

export default new Marked(
    markedHighlight({
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, {language}).value;
        }
    }))
    .use({async: false, gfm: true, breaks: true})
    .use(markedAlert(), {
        hooks: {
            preprocess(markdown: string): string {
                return markdown
                    .replace('> ℹ️', '> [!NOTE]')
                    .replace('> ⚠️', '> [!WARNING]')
                    .replace('> 🚨', '> [!CAUTION]');
            }
        }
    })
    .use(gfmHeadingId(), {
        hooks: {
            postprocess(html) {
                return html.includes(TOC_MARKER) ? html.replace(TOC_MARKER, toc(getHeadingList())) : html;
            }
        }
    });