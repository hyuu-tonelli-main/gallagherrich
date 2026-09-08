/**
 * Telegram Bot API 10.1 — Rich Messages
 * https://core.telegram.org/bots/api#june-11-2026
 */

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

/**
 * Rich formatted message received from Telegram.
 * The `blocks` array is rendered server-side; to send, use InputRichMessage.
 */
export interface RichMessage {
  blocks: object[]
  is_rtl?: boolean
}

/**
 * Describes a rich message to send.
 * Exactly ONE of `html` or `markdown` must be specified.
 */
export interface InputRichMessage {
  html?: string
  markdown?: string
  is_rtl?: boolean
  skip_entity_detection?: boolean
}

/** Can be used as InputMessageContent in inline, guest, and Web App queries. */
export interface InputRichMessageContent {
  rich_message: InputRichMessage
}

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
export class RichHTMLBuilder {
  private readonly _parts: string[] = []

  // ── Inline static helpers ──────────────────────────────────────────────

  static bold(t: string) { return `<b>${t}</b>` }
  static italic(t: string) { return `<i>${t}</i>` }
  static underline(t: string) { return `<u>${t}</u>` }
  static strikethrough(t: string) { return `<s>${t}</s>` }
  static spoiler(t: string) { return `<tg-spoiler>${t}</tg-spoiler>` }
  static code(t: string) { return `<code>${t}</code>` }
  static marked(t: string) { return `<mark>${t}</mark>` }
  static sub(t: string) { return `<sub>${t}</sub>` }
  static sup(t: string) { return `<sup>${t}</sup>` }
  static url(href: string, text: string) { return `<a href="${href}">${text}</a>` }
  static email(email: string, text?: string) { return `<a href="mailto:${email}">${text ?? email}</a>` }
  static phone(phone: string, text?: string) { return `<a href="tel:${phone}">${text ?? phone}</a>` }
  static mention(userId: number, text: string) { return `<a href="tg://user?id=${userId}">${text}</a>` }
  static customEmoji(emojiId: string, fallback: string) { return `<tg-emoji emoji-id="${emojiId}">${fallback}</tg-emoji>` }
  static time(unix: number, format: string, text: string) { return `<tg-time unix="${unix}" format="${format}">${text}</tg-time>` }
  static inlineMath(expression: string) { return `$${expression}$` }
  static anchor(name: string) { return `<a name="${name}"></a>` }
  static anchorLink(name: string, text: string) { return `<a href="#${name}">${text}</a>` }
  static ref(id: string, text: string) { return `<a href="#${id}">${text}</a>` }

  // ── Block methods ──────────────────────────────────────────────────────

  heading(level: 1 | 2 | 3 | 4 | 5 | 6, html: string) {
    this._parts.push(`<h${level}>${html}</h${level}>`)
    return this
  }

  paragraph(html: string) {
    this._parts.push(`<p>${html}</p>`)
    return this
  }

  pre(code: string, language?: string) {
    this._parts.push(
      language
        ? `<pre><code class="language-${language}">${code}</code></pre>`
        : `<pre>${code}</pre>`
    )
    return this
  }

  footer(html: string) {
    this._parts.push(`<footer>${html}</footer>`)
    return this
  }

  divider() {
    this._parts.push('<hr/>')
    return this
  }

  ul(...items: string[]) {
    this._parts.push(`<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`)
    return this
  }

  ol(...items: string[]) {
    this._parts.push(`<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`)
    return this
  }

  taskList(...items: Array<{ text: string; checked?: boolean }>) {
    const lis = items.map(
      (i) => `<li><input type="checkbox"${i.checked ? ' checked' : ''}>${i.text}</li>`
    )
    this._parts.push(`<ul>${lis.join('')}</ul>`)
    return this
  }

  blockQuote(html: string) {
    this._parts.push(`<blockquote>${html}</blockquote>`)
    return this
  }

  pullQuote(html: string, cite?: string) {
    this._parts.push(`<aside>${html}${cite ? `<cite>${cite}</cite>` : ''}</aside>`)
    return this
  }

  photo(src: string, caption?: string, spoiler?: boolean) {
    const img = `<img src="${src}"${spoiler ? ' tg-spoiler' : ''}/>`
    this._parts.push(caption ? `<figure>${img}<figcaption>${caption}</figcaption></figure>` : img)
    return this
  }

  video(src: string, caption?: string, spoiler?: boolean) {
    const vid = `<video src="${src}"${spoiler ? ' tg-spoiler' : ''}></video>`
    this._parts.push(caption ? `<figure>${vid}<figcaption>${caption}</figcaption></figure>` : vid)
    return this
  }

  audio(src: string, caption?: string) {
    const aud = `<audio src="${src}"></audio>`
    this._parts.push(caption ? `<figure>${aud}<figcaption>${caption}</figcaption></figure>` : aud)
    return this
  }

  map(lat: number, long: number, zoom?: number, caption?: string) {
    const tag = `<tg-map lat="${lat}" long="${long}"${zoom != null ? ` zoom="${zoom}"` : ''}/>`
    this._parts.push(caption ? `<figure>${tag}<figcaption>${caption}</figcaption></figure>` : tag)
    return this
  }

  collage(...media: string[]) {
    this._parts.push(`<tg-collage>${media.join('')}</tg-collage>`)
    return this
  }

  slideshow(...media: string[]) {
    this._parts.push(`<tg-slideshow>${media.join('')}</tg-slideshow>`)
    return this
  }

  table(
    rows: string[][],
    options?: { bordered?: boolean; striped?: boolean; hasHeader?: boolean }
  ) {
    const attrs = [options?.bordered && 'bordered', options?.striped && 'striped']
      .filter(Boolean)
      .join(' ')
    const [header, ...body] = rows
    const headHtml = options?.hasHeader && header
      ? `<tr>${header.map((c) => `<th>${c}</th>`).join('')}</tr>`
      : ''
    const bodyRows = (options?.hasHeader ? body : rows)
      .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
      .join('')
    this._parts.push(`<table${attrs ? ` ${attrs}` : ''}>${headHtml}${bodyRows}</table>`)
    return this
  }

  details(summary: string, content: string, open?: boolean) {
    this._parts.push(
      `<details${open ? ' open' : ''}><summary>${summary}</summary>${content}</details>`
    )
    return this
  }

  mathBlock(expression: string) {
    this._parts.push(`<tg-math-block>${expression}</tg-math-block>`)
    return this
  }

  thinking(html: string) {
    this._parts.push(`<tg-thinking>${html}</tg-thinking>`)
    return this
  }

  referenceDefinition(id: string, html: string) {
    this._parts.push(`<tg-reference name="${id}">${html}</tg-reference>`)
    return this
  }

  raw(html: string) {
    this._parts.push(html)
    return this
  }

  build(options?: Pick<InputRichMessage, 'is_rtl' | 'skip_entity_detection'>): InputRichMessage {
    return { html: this._parts.join('\n'), ...options }
  }
}

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
export class RichMarkdownBuilder {
  private readonly _parts: string[] = []

  // ── Inline static helpers ──────────────────────────────────────────────

  static bold(t: string) { return `**${t}**` }
  static italic(t: string) { return `*${t}*` }
  static underline(t: string) { return `<u>${t}</u>` }
  static strikethrough(t: string) { return `~~${t}~~` }
  static spoiler(t: string) { return `||${t}||` }
  static code(t: string) { return `\`${t}\`` }
  static marked(t: string) { return `==${t}==` }
  static sub(t: string) { return `<sub>${t}</sub>` }
  static sup(t: string) { return `<sup>${t}</sup>` }
  static url(href: string, text: string) { return `[${text}](${href})` }
  static email(email: string, text?: string) { return `[${text ?? email}](mailto:${email})` }
  static phone(phone: string, text?: string) { return `[${text ?? phone}](tel:${phone})` }
  static mention(userId: number, text: string) { return `[${text}](tg://user?id=${userId})` }
  static customEmoji(emojiId: string, fallback: string) { return `![${fallback}](tg://emoji?id=${emojiId})` }
  static time(unix: number, format: string) { return `![](tg://time?unix=${unix}&format=${format})` }
  static inlineMath(expression: string) { return `$${expression}$` }

  // ── Block methods ──────────────────────────────────────────────────────

  heading(level: 1 | 2 | 3 | 4 | 5 | 6, text: string) {
    this._parts.push(`${'#'.repeat(level)} ${text}`)
    return this
  }

  paragraph(text: string) {
    this._parts.push(text)
    return this
  }

  pre(code: string, language?: string) {
    this._parts.push(`\`\`\`${language ?? ''}\n${code}\n\`\`\``)
    return this
  }

  divider() {
    this._parts.push('---')
    return this
  }

  ul(...items: string[]) {
    this._parts.push(items.map((i) => `- ${i}`).join('\n'))
    return this
  }

  ol(...items: string[]) {
    this._parts.push(items.map((i, idx) => `${idx + 1}. ${i}`).join('\n'))
    return this
  }

  taskList(...items: Array<{ text: string; checked?: boolean }>) {
    this._parts.push(items.map((i) => `- [${i.checked ? 'x' : ' '}] ${i.text}`).join('\n'))
    return this
  }

  blockQuote(...lines: string[]) {
    this._parts.push(lines.map((l) => `>${l}`).join('\n'))
    return this
  }

  photo(src: string, caption?: string) {
    this._parts.push(`![](${src}${caption ? ` "${caption}"` : ''})`)
    return this
  }

  video(src: string, caption?: string) {
    this._parts.push(`![](${src}${caption ? ` "${caption}"` : ''})`)
    return this
  }

  audio(src: string, caption?: string) {
    this._parts.push(`![](${src}${caption ? ` "${caption}"` : ''})`)
    return this
  }

  table(headers: string[], rows: string[][], alignment?: Array<'left' | 'center' | 'right'>) {
    const sep = headers.map((_, i) => {
      const a = alignment?.[i]
      if (a === 'center') return ':---:'
      if (a === 'right') return '---:'
      return ':---'
    })
    const lines = [
      `| ${headers.join(' | ')} |`,
      `|${sep.map((s) => s + '-').join('|')}|`,
      ...rows.map((r) => `| ${r.join(' | ')} |`),
    ]
    this._parts.push(lines.join('\n'))
    return this
  }

  footnoteRef(id: string) { return `[^${id}]` }

  footnote(id: string, definition: string) {
    this._parts.push(`[^${id}]: ${definition}`)
    return this
  }

  mathBlock(expression: string) {
    this._parts.push(`$$${expression}$$`)
    return this
  }

  thinking(text: string) {
    this._parts.push(`<tg-thinking>${text}</tg-thinking>`)
    return this
  }

  collage(...mediaSrcs: string[]) {
    this._parts.push(
      `<tg-collage>\n${mediaSrcs.map((s) => `![](${s})`).join('\n')}\n</tg-collage>`
    )
    return this
  }

  slideshow(...mediaSrcs: string[]) {
    this._parts.push(
      `<tg-slideshow>\n${mediaSrcs.map((s) => `![](${s})`).join('\n')}\n</tg-slideshow>`
    )
    return this
  }

  details(summary: string, content: string, open?: boolean) {
    this._parts.push(
      `<details${open ? ' open' : ''}><summary>${summary}</summary>\n${content}\n</details>`
    )
    return this
  }

  raw(md: string) {
    this._parts.push(md)
    return this
  }

  build(options?: Pick<InputRichMessage, 'is_rtl' | 'skip_entity_detection'>): InputRichMessage {
    return { markdown: this._parts.join('\n\n'), ...options }
  }
}

/** Shorthand alias for RichHTMLBuilder */
export const H = RichHTMLBuilder
/** Shorthand alias for RichMarkdownBuilder */
export const MD = RichMarkdownBuilder
