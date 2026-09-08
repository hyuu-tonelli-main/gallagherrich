/**
 * Telegram Bot API 10.1 — Rich Messages
 * https://core.telegram.org/bots/api#june-11-2026
 */
/**
 * Rich formatted message received from Telegram.
 * The `blocks` array is rendered server-side; to send, use InputRichMessage.
 */
export interface RichMessage {
    blocks: object[];
    is_rtl?: boolean;
}
/**
 * Describes a rich message to send.
 * Exactly ONE of `html` or `markdown` must be specified.
 */
export interface InputRichMessage {
    html?: string;
    markdown?: string;
    is_rtl?: boolean;
    skip_entity_detection?: boolean;
}
/** Can be used as InputMessageContent in inline, guest, and Web App queries. */
export interface InputRichMessageContent {
    rich_message: InputRichMessage;
}
/**
 * Fluent builder for Rich Messages using HTML format.
 *
 * @example
 * const msg = new RichHTMLBuilder()
 *   .heading(1, 'Title')
 *   .paragraph(RichHTMLBuilder.bold('Hello') + ' world')
 *   .build()
 */
export declare class RichHTMLBuilder {
    private readonly _parts;
    static bold(t: string): string;
    static italic(t: string): string;
    static underline(t: string): string;
    static strikethrough(t: string): string;
    static spoiler(t: string): string;
    static code(t: string): string;
    static marked(t: string): string;
    static sub(t: string): string;
    static sup(t: string): string;
    static url(href: string, text: string): string;
    static email(email: string, text?: string): string;
    static phone(phone: string, text?: string): string;
    static mention(userId: number, text: string): string;
    static customEmoji(emojiId: string, fallback: string): string;
    static time(unix: number, format: string, text: string): string;
    static inlineMath(expression: string): string;
    static anchor(name: string): string;
    static anchorLink(name: string, text: string): string;
    static ref(id: string, text: string): string;
    heading(level: 1 | 2 | 3 | 4 | 5 | 6, html: string): this;
    paragraph(html: string): this;
    pre(code: string, language?: string): this;
    footer(html: string): this;
    divider(): this;
    ul(...items: string[]): this;
    ol(...items: string[]): this;
    taskList(...items: Array<{
        text: string;
        checked?: boolean;
    }>): this;
    blockQuote(html: string): this;
    pullQuote(html: string, cite?: string): this;
    photo(src: string, caption?: string, spoiler?: boolean): this;
    video(src: string, caption?: string, spoiler?: boolean): this;
    audio(src: string, caption?: string): this;
    map(lat: number, long: number, zoom?: number, caption?: string): this;
    collage(...media: string[]): this;
    slideshow(...media: string[]): this;
    table(rows: string[][], options?: {
        bordered?: boolean;
        striped?: boolean;
        hasHeader?: boolean;
    }): this;
    details(summary: string, content: string, open?: boolean): this;
    mathBlock(expression: string): this;
    thinking(html: string): this;
    referenceDefinition(id: string, html: string): this;
    raw(html: string): this;
    build(options?: Pick<InputRichMessage, 'is_rtl' | 'skip_entity_detection'>): InputRichMessage;
}
/**
 * Fluent builder for Rich Messages using Markdown format.
 *
 * @example
 * const msg = new RichMarkdownBuilder()
 *   .heading(1, 'Title')
 *   .paragraph(RichMarkdownBuilder.bold('Hello') + ' world')
 *   .build()
 */
export declare class RichMarkdownBuilder {
    private readonly _parts;
    static bold(t: string): string;
    static italic(t: string): string;
    static underline(t: string): string;
    static strikethrough(t: string): string;
    static spoiler(t: string): string;
    static code(t: string): string;
    static marked(t: string): string;
    static sub(t: string): string;
    static sup(t: string): string;
    static url(href: string, text: string): string;
    static email(email: string, text?: string): string;
    static phone(phone: string, text?: string): string;
    static mention(userId: number, text: string): string;
    static customEmoji(emojiId: string, fallback: string): string;
    static time(unix: number, format: string): string;
    static inlineMath(expression: string): string;
    heading(level: 1 | 2 | 3 | 4 | 5 | 6, text: string): this;
    paragraph(text: string): this;
    pre(code: string, language?: string): this;
    divider(): this;
    ul(...items: string[]): this;
    ol(...items: string[]): this;
    taskList(...items: Array<{
        text: string;
        checked?: boolean;
    }>): this;
    blockQuote(...lines: string[]): this;
    photo(src: string, caption?: string): this;
    video(src: string, caption?: string): this;
    audio(src: string, caption?: string): this;
    table(headers: string[], rows: string[][], alignment?: Array<'left' | 'center' | 'right'>): this;
    footnoteRef(id: string): string;
    footnote(id: string, definition: string): this;
    mathBlock(expression: string): this;
    thinking(text: string): this;
    collage(...mediaSrcs: string[]): this;
    slideshow(...mediaSrcs: string[]): this;
    details(summary: string, content: string, open?: boolean): this;
    raw(md: string): this;
    build(options?: Pick<InputRichMessage, 'is_rtl' | 'skip_entity_detection'>): InputRichMessage;
}
/** Shorthand alias for RichHTMLBuilder */
export declare const H: typeof RichHTMLBuilder;
/** Shorthand alias for RichMarkdownBuilder */
export declare const MD: typeof RichMarkdownBuilder;
//# sourceMappingURL=rich-message.d.ts.map