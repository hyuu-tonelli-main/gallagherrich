"use strict";
/**
 * Telegram Bot API 10.1 — Rich Messages
 * https://core.telegram.org/bots/api#june-11-2026
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MD = exports.H = exports.RichMarkdownBuilder = exports.RichHTMLBuilder = void 0;
// ---------------------------------------------------------------------------
// HTML Builder
// ---------------------------------------------------------------------------
/**
 * Fluent builder for Rich Messages using HTML format.
 *
 * @example
 * const msg = new RichHTMLBuilder()
 *   .heading(1, 'Title')
 *   .paragraph(RichHTMLBuilder.bold('Hello') + ' world')
 *   .build()
 */
class RichHTMLBuilder {
    constructor() {
        this._parts = [];
    }
    // ── Inline static helpers ──────────────────────────────────────────────
    static bold(t) { return `<b>${t}</b>`; }
    static italic(t) { return `<i>${t}</i>`; }
    static underline(t) { return `<u>${t}</u>`; }
    static strikethrough(t) { return `<s>${t}</s>`; }
    static spoiler(t) { return `<tg-spoiler>${t}</tg-spoiler>`; }
    static code(t) { return `<code>${t}</code>`; }
    static marked(t) { return `<mark>${t}</mark>`; }
    static sub(t) { return `<sub>${t}</sub>`; }
    static sup(t) { return `<sup>${t}</sup>`; }
    static url(href, text) { return `<a href="${href}">${text}</a>`; }
    static email(email, text) { return `<a href="mailto:${email}">${text !== null && text !== void 0 ? text : email}</a>`; }
    static phone(phone, text) { return `<a href="tel:${phone}">${text !== null && text !== void 0 ? text : phone}</a>`; }
    static mention(userId, text) { return `<a href="tg://user?id=${userId}">${text}</a>`; }
    static customEmoji(emojiId, fallback) { return `<tg-emoji emoji-id="${emojiId}">${fallback}</tg-emoji>`; }
    static time(unix, format, text) { return `<tg-time unix="${unix}" format="${format}">${text}</tg-time>`; }
    static inlineMath(expression) { return `$${expression}$`; }
    static anchor(name) { return `<a name="${name}"></a>`; }
    static anchorLink(name, text) { return `<a href="#${name}">${text}</a>`; }
    static ref(id, text) { return `<a href="#${id}">${text}</a>`; }
    // ── Block methods ──────────────────────────────────────────────────────
    heading(level, html) {
        this._parts.push(`<h${level}>${html}</h${level}>`);
        return this;
    }
    paragraph(html) {
        this._parts.push(`<p>${html}</p>`);
        return this;
    }
    pre(code, language) {
        this._parts.push(language
            ? `<pre><code class="language-${language}">${code}</code></pre>`
            : `<pre>${code}</pre>`);
        return this;
    }
    footer(html) {
        this._parts.push(`<footer>${html}</footer>`);
        return this;
    }
    divider() {
        this._parts.push('<hr/>');
        return this;
    }
    ul(...items) {
        this._parts.push(`<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`);
        return this;
    }
    ol(...items) {
        this._parts.push(`<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`);
        return this;
    }
    taskList(...items) {
        const lis = items.map((i) => `<li><input type="checkbox"${i.checked ? ' checked' : ''}>${i.text}</li>`);
        this._parts.push(`<ul>${lis.join('')}</ul>`);
        return this;
    }
    blockQuote(html) {
        this._parts.push(`<blockquote>${html}</blockquote>`);
        return this;
    }
    pullQuote(html, cite) {
        this._parts.push(`<aside>${html}${cite ? `<cite>${cite}</cite>` : ''}</aside>`);
        return this;
    }
    photo(src, caption, spoiler) {
        const img = `<img src="${src}"${spoiler ? ' tg-spoiler' : ''}/>`;
        this._parts.push(caption ? `<figure>${img}<figcaption>${caption}</figcaption></figure>` : img);
        return this;
    }
    video(src, caption, spoiler) {
        const vid = `<video src="${src}"${spoiler ? ' tg-spoiler' : ''}></video>`;
        this._parts.push(caption ? `<figure>${vid}<figcaption>${caption}</figcaption></figure>` : vid);
        return this;
    }
    audio(src, caption) {
        const aud = `<audio src="${src}"></audio>`;
        this._parts.push(caption ? `<figure>${aud}<figcaption>${caption}</figcaption></figure>` : aud);
        return this;
    }
    map(lat, long, zoom, caption) {
        const tag = `<tg-map lat="${lat}" long="${long}"${zoom != null ? ` zoom="${zoom}"` : ''}/>`;
        this._parts.push(caption ? `<figure>${tag}<figcaption>${caption}</figcaption></figure>` : tag);
        return this;
    }
    collage(...media) {
        this._parts.push(`<tg-collage>${media.join('')}</tg-collage>`);
        return this;
    }
    slideshow(...media) {
        this._parts.push(`<tg-slideshow>${media.join('')}</tg-slideshow>`);
        return this;
    }
    table(rows, options) {
        const attrs = [(options === null || options === void 0 ? void 0 : options.bordered) && 'bordered', (options === null || options === void 0 ? void 0 : options.striped) && 'striped']
            .filter(Boolean)
            .join(' ');
        const [header, ...body] = rows;
        const headHtml = (options === null || options === void 0 ? void 0 : options.hasHeader) && header
            ? `<tr>${header.map((c) => `<th>${c}</th>`).join('')}</tr>`
            : '';
        const bodyRows = ((options === null || options === void 0 ? void 0 : options.hasHeader) ? body : rows)
            .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
            .join('');
        this._parts.push(`<table${attrs ? ` ${attrs}` : ''}>${headHtml}${bodyRows}</table>`);
        return this;
    }
    details(summary, content, open) {
        this._parts.push(`<details${open ? ' open' : ''}><summary>${summary}</summary>${content}</details>`);
        return this;
    }
    mathBlock(expression) {
        this._parts.push(`<tg-math-block>${expression}</tg-math-block>`);
        return this;
    }
    thinking(html) {
        this._parts.push(`<tg-thinking>${html}</tg-thinking>`);
        return this;
    }
    referenceDefinition(id, html) {
        this._parts.push(`<tg-reference name="${id}">${html}</tg-reference>`);
        return this;
    }
    raw(html) {
        this._parts.push(html);
        return this;
    }
    build(options) {
        return { html: this._parts.join('\n'), ...options };
    }
}
exports.RichHTMLBuilder = RichHTMLBuilder;
// ---------------------------------------------------------------------------
// Markdown Builder
// ---------------------------------------------------------------------------
/**
 * Fluent builder for Rich Messages using Markdown format.
 *
 * @example
 * const msg = new RichMarkdownBuilder()
 *   .heading(1, 'Title')
 *   .paragraph(RichMarkdownBuilder.bold('Hello') + ' world')
 *   .build()
 */
class RichMarkdownBuilder {
    constructor() {
        this._parts = [];
    }
    // ── Inline static helpers ──────────────────────────────────────────────
    static bold(t) { return `**${t}**`; }
    static italic(t) { return `*${t}*`; }
    static underline(t) { return `<u>${t}</u>`; }
    static strikethrough(t) { return `~~${t}~~`; }
    static spoiler(t) { return `||${t}||`; }
    static code(t) { return `\`${t}\``; }
    static marked(t) { return `==${t}==`; }
    static sub(t) { return `<sub>${t}</sub>`; }
    static sup(t) { return `<sup>${t}</sup>`; }
    static url(href, text) { return `[${text}](${href})`; }
    static email(email, text) { return `[${text !== null && text !== void 0 ? text : email}](mailto:${email})`; }
    static phone(phone, text) { return `[${text !== null && text !== void 0 ? text : phone}](tel:${phone})`; }
    static mention(userId, text) { return `[${text}](tg://user?id=${userId})`; }
    static customEmoji(emojiId, fallback) { return `![${fallback}](tg://emoji?id=${emojiId})`; }
    static time(unix, format) { return `![](tg://time?unix=${unix}&format=${format})`; }
    static inlineMath(expression) { return `$${expression}$`; }
    // ── Block methods ──────────────────────────────────────────────────────
    heading(level, text) {
        this._parts.push(`${'#'.repeat(level)} ${text}`);
        return this;
    }
    paragraph(text) {
        this._parts.push(text);
        return this;
    }
    pre(code, language) {
        this._parts.push(`\`\`\`${language !== null && language !== void 0 ? language : ''}\n${code}\n\`\`\``);
        return this;
    }
    divider() {
        this._parts.push('---');
        return this;
    }
    ul(...items) {
        this._parts.push(items.map((i) => `- ${i}`).join('\n'));
        return this;
    }
    ol(...items) {
        this._parts.push(items.map((i, idx) => `${idx + 1}. ${i}`).join('\n'));
        return this;
    }
    taskList(...items) {
        this._parts.push(items.map((i) => `- [${i.checked ? 'x' : ' '}] ${i.text}`).join('\n'));
        return this;
    }
    blockQuote(...lines) {
        this._parts.push(lines.map((l) => `>${l}`).join('\n'));
        return this;
    }
    photo(src, caption) {
        this._parts.push(`![](${src}${caption ? ` "${caption}"` : ''})`);
        return this;
    }
    video(src, caption) {
        this._parts.push(`![](${src}${caption ? ` "${caption}"` : ''})`);
        return this;
    }
    audio(src, caption) {
        this._parts.push(`![](${src}${caption ? ` "${caption}"` : ''})`);
        return this;
    }
    table(headers, rows, alignment) {
        const sep = headers.map((_, i) => {
            const a = alignment === null || alignment === void 0 ? void 0 : alignment[i];
            if (a === 'center')
                return ':---:';
            if (a === 'right')
                return '---:';
            return ':---';
        });
        const lines = [
            `| ${headers.join(' | ')} |`,
            `|${sep.map((s) => s + '-').join('|')}|`,
            ...rows.map((r) => `| ${r.join(' | ')} |`),
        ];
        this._parts.push(lines.join('\n'));
        return this;
    }
    footnoteRef(id) { return `[^${id}]`; }
    footnote(id, definition) {
        this._parts.push(`[^${id}]: ${definition}`);
        return this;
    }
    mathBlock(expression) {
        this._parts.push(`$$${expression}$$`);
        return this;
    }
    thinking(text) {
        this._parts.push(`<tg-thinking>${text}</tg-thinking>`);
        return this;
    }
    collage(...mediaSrcs) {
        this._parts.push(`<tg-collage>\n${mediaSrcs.map((s) => `![](${s})`).join('\n')}\n</tg-collage>`);
        return this;
    }
    slideshow(...mediaSrcs) {
        this._parts.push(`<tg-slideshow>\n${mediaSrcs.map((s) => `![](${s})`).join('\n')}\n</tg-slideshow>`);
        return this;
    }
    details(summary, content, open) {
        this._parts.push(`<details${open ? ' open' : ''}><summary>${summary}</summary>\n${content}\n</details>`);
        return this;
    }
    raw(md) {
        this._parts.push(md);
        return this;
    }
    build(options) {
        return { markdown: this._parts.join('\n\n'), ...options };
    }
}
exports.RichMarkdownBuilder = RichMarkdownBuilder;
/** Shorthand alias for RichHTMLBuilder */
exports.H = RichHTMLBuilder;
/** Shorthand alias for RichMarkdownBuilder */
exports.MD = RichMarkdownBuilder;
