<div align="center">

> Developed & maintained by **[@kafk6](https://t.me/kafk6)**

</div>

<header>

<div align="center">
<img src="docs/assets/logo.svg" alt="logo" height="90" align="center">
<h1 align="center">telegraf.js</h1>

<p>Modern Telegram Bot API framework for Node.js</p>

<a href="https://core.telegram.org/bots/api">
	<img src="https://img.shields.io/badge/Bot%20API-v10.1-f36caf.svg?style=flat-square" alt="Bot API Version" />
</a>
<a href="https://packagephobia.com/result?p=telegraf,node-telegram-bot-api">
	<img src="https://flat.badgen.net/packagephobia/install/telegraf" alt="install size" />
</a>
<a href="https://github.com/telegraf/telegraf">
	<img src="https://img.shields.io/github/languages/top/telegraf/telegraf?style=flat-square&logo=github" alt="GitHub top language" />
</a>
<a href="https://telegram.me/TelegrafJSChat">
	<img src="https://img.shields.io/badge/English%20chat-grey?style=flat-square&logo=telegram" alt="English chat" />
</a>
</div>

</header>

> **telekaf** (`@icanseeuanywhere/telekaf`) is an up-to-date fork of [telegraf](https://github.com/telegraf/telegraf) — the popular Telegram Bot framework for Node.js.
> This package tracks the latest Telegram Bot API releases and ships features ahead of the upstream package.
> It is a drop-in replacement: just swap `npm install telegraf` → `npm install @icanseeuanywhere/telekaf` and change your imports from `'telegraf'` to `'@icanseeuanywhere/telekaf'`.


---

## 🆕 Rich Messages — Bot API 10.1

> Added in **Bot API 10.1** (June 11, 2026). Rich Messages let bots send highly structured content using HTML or Markdown — headings, lists, tables, media collages, code blocks, math expressions, AI thinking blocks, and more — with streaming support for AI-generated replies.

### Table of Contents

- [Quick Start](#quick-start)
- [Sending Methods](#sending-methods)
- [InputRichMessage Format](#inputrichmessage-format)
- [RichHTMLBuilder](#richhtmlbuilder)
  - [Text Formatting](#text-formatting-html)
  - [Headings & Paragraphs](#headings--paragraphs)
  - [Lists](#lists-html)
  - [Code Blocks](#code-blocks)
  - [Blockquote & Pull Quote](#blockquote--pull-quote)
  - [Math](#math-html)
  - [Media — Photo, Video, Audio](#media--photo-video-audio)
  - [Collage & Slideshow](#collage--slideshow)
  - [Map](#map)
  - [Table](#table-html)
  - [Details (Expandable)](#details-expandable)
  - [Footnote References](#footnote-references-html)
  - [Anchors & In-document Links](#anchors--in-document-links)
  - [Special Elements](#special-elements)
- [RichMarkdownBuilder](#richmarkdownbuilder)
- [Streaming with sendRichMessageDraft](#streaming-with-sendrichmessagedraft)
- [reply\_markup with Rich Messages](#reply_markup-with-rich-messages)
- [Inline / Web App Queries](#inline--web-app-queries)
- [TypeScript](#typescript)

---

### Quick Start

```ts
import { Telegraf, RichMessage } from '@icanseeuanywhere/telekaf'
const { RichHTMLBuilder: HTML } = RichMessage

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('hello', async (ctx) => {
  const msg = new HTML()
    .heading(1, 'Hello World!')
    .paragraph(HTML.bold('Rich Messages') + ' are now supported in Bot API 10.1.')
    .divider()
    .ul('Headings', 'Lists', 'Tables', 'Media', 'Math', 'and more')
    .build()

  await ctx.sendRichMessage(msg)
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
```

---

### Sending Methods

| Method | Description |
|---|---|
| `ctx.sendRichMessage(msg, extra?)` | Send a rich message to the current chat |
| `ctx.replyWithRichMessageContent(msg, extra?)` | Send a rich message quoting the current message |
| `ctx.sendRichMessageDraft(draftId, msg, extra?)` | Stream a partial draft (private chats only) |
| `ctx.telegram.sendRichMessage(chatId, msg, extra?)` | Explicit call with chat ID |
| `ctx.telegram.sendRichMessageDraft(chatId, draftId, msg, extra?)` | Explicit streaming with chat ID |

**`extra` options for `sendRichMessage`:**

```ts
await ctx.sendRichMessage(msg, {
  message_thread_id: 123,           // for forum topics
  direct_messages_topic_id: 456,    // for DM topics
  disable_notification: true,
  protect_content: true,
  allow_paid_broadcast: false,
  message_effect_id: 'effect_id',
  reply_parameters: { message_id: ctx.message.message_id },
  reply_markup: { inline_keyboard: [[{ text: 'OK', callback_data: 'ok' }]] },
})
```

---

### InputRichMessage Format

`InputRichMessage` uses **either** `html` or `markdown` — not both:

```ts
// HTML format
const msg: InputRichMessage = {
  html: '<h1>Title</h1><p>Body text</p>',
  is_rtl: false,
  skip_entity_detection: false,
}

// Markdown format
const msg: InputRichMessage = {
  markdown: '# Title\n\nBody text',
}
```

Use the builders — `RichHTMLBuilder` or `RichMarkdownBuilder` — to construct these conveniently.

---

### RichHTMLBuilder

Import and instantiate:

```ts
import { RichMessage } from '@icanseeuanywhere/telekaf'
const { RichHTMLBuilder: HTML } = RichMessage

const msg = new HTML()
  .heading(1, 'Title')
  .paragraph('Content')
  .build()  // returns InputRichMessage { html: '...' }
```

#### Text Formatting (HTML)

Static inline helpers — return strings to embed inside block methods:

```ts
HTML.bold('bold text')                          // <b>bold text</b>
HTML.italic('italic text')                      // <i>italic text</i>
HTML.underline('underlined')                    // <u>underlined</u>
HTML.strikethrough('crossed out')               // <s>crossed out</s>
HTML.spoiler('hidden until tapped')             // <tg-spoiler>hidden</tg-spoiler>
HTML.code('inline code')                        // <code>inline code</code>
HTML.marked('highlighted')                      // <mark>highlighted</mark>
HTML.sub('subscript')                           // <sub>subscript</sub>
HTML.sup('superscript')                         // <sup>superscript</sup>

HTML.url('https://t.me', 'Telegram')            // <a href="...">Telegram</a>
HTML.email('hi@bot.com', 'Email us')            // <a href="mailto:...">Email us</a>
HTML.phone('+6281234567', 'Call us')            // <a href="tel:...">Call us</a>
HTML.mention(123456789, 'Alice')                // <a href="tg://user?id=...">Alice</a>
HTML.customEmoji('5368324170671202286', '👍')   // <tg-emoji emoji-id="...">👍</tg-emoji>
HTML.time(1647531900, 'wDT', '22:45 tomorrow') // <tg-time unix="..." format="...">...</tg-time>
HTML.inlineMath('E = mc^2')                     // $E = mc^2$

// Nesting
HTML.bold(HTML.italic('bold italic'))
HTML.underline(HTML.spoiler('underlined spoiler'))
```

#### Headings & Paragraphs

```ts
new HTML()
  .heading(1, 'Main Title')
  .heading(2, 'Subtitle')
  .heading(3, HTML.bold('Bold heading'))
  .heading(4, 'H4')
  .heading(5, 'H5')
  .heading(6, 'H6')
  .paragraph('Normal paragraph text.')
  .paragraph(HTML.bold('Bold') + ' and ' + HTML.italic('italic') + ' combined.')
  .footer('Footer text — smaller and muted')
  .divider()  // <hr/>
  .build()
```

#### Lists (HTML)

```ts
new HTML()
  // Unordered list
  .ul('First item', 'Second item', HTML.bold('Bold item'))

  // Ordered list
  .ol('Step one', 'Step two', 'Step three')

  // Task list (checkboxes)
  .taskList(
    { text: 'Completed task',  checked: true  },
    { text: 'Pending task',    checked: false },
    { text: HTML.bold('Important task'), checked: false },
  )
  .build()
```

#### Code Blocks

```ts
new HTML()
  .pre('npm install @icanseeuanywhere/telekaf', 'bash')
  .pre('SELECT * FROM users WHERE active = 1;', 'sql')
  .pre(
`const bot = new Telegraf(token)
bot.launch()`,
    'javascript'
  )
  .pre('plain preformatted block without language')
  .build()
```

Supported language identifiers: `javascript`, `typescript`, `python`, `bash`, `sql`, `json`, `html`, `css`, etc.

#### Blockquote & Pull Quote

```ts
new HTML()
  // Standard block quotation
  .blockQuote(HTML.italic('"To be or not to be."'))

  // Pull quotation with attribution (cite)
  .pullQuote(
    HTML.italic('"Design is not just what it looks like."'),
    'Steve Jobs'
  )

  // Nested formatting inside quote
  .blockQuote(
    HTML.bold('Telekaf') + ' supports ' + HTML.marked('highlighted') +
    ' and ' + HTML.spoiler('spoiler') + ' text inside quotes.'
  )
  .build()
```

#### Math (HTML)

```ts
new HTML()
  // Inline math (embed inside paragraph)
  .paragraph(
    'The formula is: ' + HTML.inlineMath('a^2 + b^2 = c^2')
  )

  // Block math expression
  .mathBlock('\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}')
  .mathBlock('F(x) = \\int_{-\\infty}^{x} f(t)\\,dt')
  .mathBlock('E = mc^2')
  .build()
```

#### Media — Photo, Video, Audio

```ts
new HTML()
  // Photo
  .photo('https://example.com/photo.jpg')
  .photo('https://example.com/photo.jpg', 'Caption text')
  .photo('https://example.com/photo.jpg', 'Spoiler photo', /* spoiler */ true)

  // Video
  .video('https://example.com/video.mp4')
  .video('https://example.com/video.mp4', 'Caption text')
  .video('https://example.com/video.mp4', 'Spoiler video', /* spoiler */ true)

  // Audio / Voice note (.ogg for voice)
  .audio('https://example.com/audio.mp3')
  .audio('https://example.com/audio.mp3', 'Audio caption')

  // With figcaption (HTML figure)
  .raw('<figure><img src="https://example.com/photo.jpg"/><figcaption>Caption <b>bold</b></figcaption></figure>')
  .build()
```

You can also use a Telegram `file_id` in place of a URL once the file is uploaded.

#### Collage & Slideshow

```ts
const img = (src) => `<img src="${src}"/>`
const vid = (src) => `<video src="${src}"></video>`

new HTML()
  // Collage — displays as a grid
  .collage(
    img('https://example.com/photo1.jpg'),
    img('https://example.com/photo2.jpg'),
    vid('https://example.com/clip.mp4'),
  )

  // Slideshow — swipeable carousel
  .slideshow(
    img('https://example.com/photo1.jpg'),
    img('https://example.com/photo2.jpg'),
    img('https://example.com/photo3.jpg'),
  )
  .build()
```

#### Map

```ts
new HTML()
  .map(-6.2088, 106.8456)                              // Jakarta
  .map(48.8584, 2.2945, 16)                            // Paris, zoom 16
  .map(51.5074, -0.1278, 14, 'Our office in London')   // with caption
  .build()
```

#### Table (HTML)

```ts
new HTML()
  .table(
    [
      ['Name',    'Version', 'Downloads'],   // header row (hasHeader: true)
      ['telekaf', '4.16.5',  '—'        ],
      ['telegraf','4.16.3',  '~120k/wk' ],
    ],
    { bordered: true, striped: true, hasHeader: true }
  )
  .build()
```

For advanced table markup (colspan, rowspan, alignment), use `.raw()`:

```ts
new HTML()
  .raw(
    '<table bordered striped>' +
      '<tr><th>Name</th><th colspan="2">Details</th></tr>' +
      '<tr><td>Alice</td><td align="center">98</td><td align="right">Pass</td></tr>' +
    '</table>'
  )
  .build()
```

#### Details (Expandable)

```ts
new HTML()
  // Collapsed by default
  .details('Click to expand', '<p>Hidden content here.</p>')

  // Open by default
  .details(
    HTML.bold('Changelog v4.16.5'),
    '<ul><li>Fix InputRichMessage format</li><li>Add RichHTMLBuilder</li></ul>',
    /* open */ true
  )
  .build()
```

#### Footnote References (HTML)

```ts
new HTML()
  .paragraph(
    'Telekaf ' + HTML.ref('note-1', '[1]') + ' is based on Telegraf ' + HTML.ref('note-2', '[2]') + '.'
  )
  .divider()
  .referenceDefinition('note-1', HTML.url('https://npmjs.com/package/@icanseeuanywhere/telekaf', 'telekaf on npm'))
  .referenceDefinition('note-2', HTML.url('https://github.com/telegraf/telegraf', 'telegraf on GitHub'))
  .build()
```

#### Anchors & In-document Links

```ts
new HTML()
  .raw(HTML.anchor('section-intro'))  // invisible anchor target
  .heading(2, 'Introduction')
  .paragraph('Jump to: ' + HTML.anchorLink('section-api', 'API Reference'))
  .raw(HTML.anchor('section-api'))
  .heading(2, 'API Reference')
  .build()
```

#### Special Elements

```ts
new HTML()
  // AI thinking block (visible in sendRichMessageDraft)
  .thinking(HTML.italic('Analyzing your request...'))

  // Raw HTML for anything not covered by builder methods
  .raw('<tg-map lat="41.9" long="12.5" zoom="14"/>')
  .raw('<aside>Pull quote<cite>The Author</cite></aside>')
  .build()
```

---

### RichMarkdownBuilder

Same API surface as `RichHTMLBuilder` but produces Markdown output:

```ts
import { RichMessage } from '@icanseeuanywhere/telekaf'
const { RichMarkdownBuilder: MD } = RichMessage

const msg = new MD()
  .heading(1, 'Rich Markdown')
  .paragraph(
    MD.bold('bold') + '  ' +
    MD.italic('italic') + '  ' +
    MD.strikethrough('strike') + '  ' +
    MD.marked('==highlighted==') + '  ' +
    MD.spoiler('||spoiler||') + '  ' +
    MD.code('`code`')
  )
  .divider()
  .ul('Item 1', 'Item 2', MD.bold('Bold item'))
  .ol('Step 1', 'Step 2', 'Step 3')
  .taskList(
    { text: 'Done',    checked: true  },
    { text: 'Pending', checked: false },
  )
  .divider()
  .pre('console.log("hello")', 'javascript')
  .divider()
  .table(
    ['Name', 'Score'],
    [['Alice', '98'], ['Bob', '87']],
    ['left', 'center'],
  )
  .divider()
  .mathBlock('E = mc^2')
  .divider()
  .blockQuote(MD.italic('"Quote text"'), '— Author')
  .divider()
  .photo('https://example.com/photo.jpg', 'Photo caption')
  .collage('https://example.com/1.jpg', 'https://example.com/2.jpg')
  .slideshow('https://example.com/1.jpg', 'https://example.com/2.jpg')
  .divider()
  .details('Expand me', '### Hidden heading\n\n- item 1\n- item 2')
  .divider()
  .paragraph('See footnote' + MD.sup('[1]'))
  .footnote('1', MD.url('https://t.me/kafk6', '@kafka'))
  .build()
```

**All Markdown inline helpers:**

```ts
MD.bold('text')                    // **text**
MD.italic('text')                  // *text*
MD.underline('text')               // <u>text</u>
MD.strikethrough('text')           // ~~text~~
MD.spoiler('text')                 // ||text||
MD.code('text')                    // `text`
MD.marked('text')                  // ==text==
MD.sub('text')                     // <sub>text</sub>
MD.sup('text')                     // <sup>text</sup>
MD.url('https://...', 'label')     // [label](url)
MD.email('a@b.com', 'label')       // [label](mailto:a@b.com)
MD.phone('+123', 'label')          // [label](tel:+123)
MD.mention(123456789, 'Alice')     // [Alice](tg://user?id=123456789)
MD.customEmoji('id', '👍')         // ![👍](tg://emoji?id=...)
MD.time(1647531900, 'wDT')         // ![](tg://time?unix=...&format=wDT)
MD.inlineMath('a^2')               // $a^2$
```

---

### Streaming with sendRichMessageDraft

`sendRichMessageDraft` streams a partial rich message in private chats. The draft is ephemeral (30-second preview). You **must** finalize with `sendRichMessage` to persist it.

- `chat_id` — private chat only (integer)
- `draft_id` — non-zero integer; updates with the same `draft_id` are animated

```ts
bot.command('ai', async (ctx) => {
  const DRAFT_ID = 1  // any non-zero integer

  const steps = [
    'Reading your request...',
    'Searching knowledge base...',
    'Composing answer...',
  ]

  // Stream thinking blocks
  for (const step of steps) {
    await ctx.sendRichMessageDraft(
      DRAFT_ID,
      new HTML().thinking(HTML.italic(step)).build()
    )
    await new Promise((r) => setTimeout(r, 900))
  }

  // Finalize — must call sendRichMessage after streaming
  await ctx.sendRichMessage(
    new HTML()
      .heading(2, '🤖 AI Response')
      .paragraph('Here is the final answer from the AI.')
      .divider()
      .footer(HTML.url('https://t.me/kafk6', '@kafka'))
      .build()
  )
})
```

You can also call `sendRichMessageDraft` explicitly:

```ts
// Explicit
await ctx.telegram.sendRichMessageDraft(
  ctx.chat.id,   // private chat integer ID
  42,            // draft_id
  new HTML().thinking('Processing...').build(),
  { message_thread_id: 123 }
)
```

---

### reply_markup with Rich Messages

All `sendRichMessage` calls accept a `reply_markup` option with inline keyboards:

```ts
import { Markup } from '@icanseeuanywhere/telekaf'

const msg = new HTML()
  .heading(2, 'Choose an option')
  .paragraph('Tap a button below:')
  .build()

await ctx.sendRichMessage(msg, {
  reply_markup: Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Yes', 'answer:yes'),
      Markup.button.callback('❌ No',  'answer:no'),
    ],
    [Markup.button.url('🌐 Visit', 'https://t.me/kafk6')],
  ]).reply_markup,
})

bot.action('answer:yes', async (ctx) => {
  await ctx.answerCbQuery('You chose Yes!')
})
```

Or use `reply_markup` directly:

```ts
await ctx.sendRichMessage(msg, {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Button 1', callback_data: 'btn1' }],
      [{ text: 'Open URL', url: 'https://telegram.org' }],
    ],
  },
})
```

---

### Inline / Web App Queries

Use `InputRichMessageContent` as `input_message_content` in inline query results:

```ts
import { RichMessage } from '@icanseeuanywhere/telekaf'
const { RichHTMLBuilder: HTML } = RichMessage

bot.on('inline_query', async (ctx) => {
  const richContent: RichMessage.InputRichMessageContent = {
    rich_message: new HTML()
      .heading(1, 'Result from Inline Query')
      .paragraph('Sent via ' + HTML.url('https://t.me/kafk6', '@kafka') + '.')
      .build(),
  }

  await ctx.answerInlineQuery([
    {
      type: 'article',
      id: '1',
      title: 'Rich Message Result',
      input_message_content: richContent,
    },
  ])
})
```

---

### TypeScript

All types are exported under the `RichMessage` namespace:

```ts
import { RichMessage } from '@icanseeuanywhere/telekaf'
import type { ExtraSendRichMessage, ExtraSendRichMessageDraft } from '@icanseeuanywhere/telekaf/types'

// Builder types
const builder: RichMessage.RichHTMLBuilder = new RichMessage.RichHTMLBuilder()
const mdBuilder: RichMessage.RichMarkdownBuilder = new RichMessage.RichMarkdownBuilder()

// Message types
const input: RichMessage.InputRichMessage = { html: '<p>hello</p>' }
const content: RichMessage.InputRichMessageContent = { rich_message: input }
const received: RichMessage.RichMessage = ctx.message.rich_message

// Extra types
const extra: ExtraSendRichMessage = {
  disable_notification: true,
  reply_markup: { inline_keyboard: [] },
}

// Custom context with rich message
import { Context, Telegraf } from '@icanseeuanywhere/telekaf'
interface MyCtx extends Context {
  session?: { lastDraftId: number }
}
const bot = new Telegraf<MyCtx>(process.env.BOT_TOKEN)
```

---

## For 3.x users

- [3.x docs](https://telegraf.js.org/v3)
- [4.0 release notes](https://github.com/telegraf/telegraf/releases/tag/v4.0.0)

## Introduction

Bots are special [Telegram](https://telegram.org) accounts designed to handle messages automatically.
Users can interact with bots by sending them command messages in private or group chats.
These accounts serve as an interface for code running somewhere on your server.

Telegraf is a library that makes it simple for you to develop your own Telegram bots using JavaScript or [TypeScript](https://www.typescriptlang.org/).

### Features

- Full [Telegram Bot API 10.1](https://core.telegram.org/bots/api) support with **Rich Messages**
- [Excellent TypeScript typings](https://github.com/telegraf/telegraf/releases/tag/v4.0.0)
- [Lightweight](https://packagephobia.com/result?p=telegraf,node-telegram-bot-api)
- [AWS **λ**](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html)
  / [Firebase](https://firebase.google.com/products/functions/)
  / [Glitch](https://glitch.com/edit/#!/dashing-light)
  / [Fly.io](https://fly.io/docs/languages-and-frameworks/node)
  / Whatever ready
- `http/https/fastify/Connect.js/express.js` compatible webhooks
- Extensible

### Example

```js
const { Telegraf } = require('@icanseeuanywhere/telekaf')
const { message } = require('@icanseeuanywhere/telekaf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
```

```js
const { Telegraf } = require('@icanseeuanywhere/telekaf')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('hipster', Telegraf.reply('λ'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
```

For additional bot examples see the new [`docs repo`](https://github.com/feathers-studio/telegraf-docs/).

### Resources

- [Getting started](#getting-started)
- [API reference](https://telegraf.js.org/modules.html)
- Telegram groups (sorted by number of members):
  - [English](https://t.me/TelegrafJSChat)
  - [Russian](https://t.me/telegrafjs_ru)
  - [Uzbek](https://t.me/botjs_uz)
  - [Ethiopian](https://t.me/telegraf_et)
- [GitHub Discussions](https://github.com/telegraf/telegraf/discussions)
- [Dependent repositories](https://libraries.io/npm/telegraf/dependent_repositories)

## Getting started

### Telegram token

To use the [Telegram Bot API](https://core.telegram.org/bots/api),
you first have to [get a bot account](https://core.telegram.org/bots)
by [chatting with BotFather](https://core.telegram.org/bots#6-botfather).

BotFather will give you a _token_, something like `123456789:AbCdefGhIJKlmNoPQRsTUVwxyZ`.

### Installation

```shellscript
$ npm install @icanseeuanywhere/telekaf
```

or

```shellscript
$ yarn add @icanseeuanywhere/telekaf
```

or

```shellscript
$ pnpm add @icanseeuanywhere/telekaf
```

### `Telegraf` class

[`Telegraf`] instance represents your bot. It's responsible for obtaining updates and passing them to your handlers.

Start by [listening to commands](https://telegraf.js.org/classes/Telegraf-1.html#command) and [launching](https://telegraf.js.org/classes/Telegraf-1.html#launch) your bot.

### `Context` class

`ctx` you can see in every example is a [`Context`] instance.
[`Telegraf`] creates one for each incoming update and passes it to your middleware.
It contains the `update`, `botInfo`, and `telegram` for making arbitrary Bot API requests,
as well as shorthand methods and getters.

This is probably the class you'll be using the most.

<!--
TODO: Verify and update list
Here is a list of

#### Known middleware

- [Internationalization](https://github.com/telegraf/telegraf-i18n)—simplifies selecting the right translation to use when responding to a user.
- [Redis powered session](https://github.com/telegraf/telegraf-session-redis)—store session data using Redis.
- [Local powered session (via lowdb)](https://github.com/RealSpeaker/telegraf-session-local)—store session data in a local file.
- [Rate-limiting](https://github.com/telegraf/telegraf-ratelimit)—apply rate limitting to chats or users.
- [Bottleneck powered throttling](https://github.com/KnightNiwrem/telegraf-throttler)—apply throttling to both incoming updates and outgoing API calls.
- [Menus via inline keyboards](https://github.com/EdJoPaTo/telegraf-inline-menu)—simplify creating interfaces based on menus.
- [Stateless Questions](https://github.com/EdJoPaTo/telegraf-stateless-question)—create stateless questions to Telegram users working in privacy mode.
- [Natural language processing via wit.ai](https://github.com/telegraf/telegraf-wit)
- [Natural language processing via recast.ai](https://github.com/telegraf/telegraf-recast)
- [Multivariate and A/B testing](https://github.com/telegraf/telegraf-experiments)—add experiments to see how different versions of a feature are used.
- [Powerfull bot stats via Mixpanel](https://github.com/telegraf/telegraf-mixpanel)
- [statsd integration](https://github.com/telegraf/telegraf-statsd)
- [and more...](https://www.npmjs.com/search?q=telegraf-)
-->

#### Shorthand methods

```js
import { Telegraf } from '@icanseeuanywhere/telekaf'
import { message } from '@icanseeuanywhere/telekaf/filters'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id)

  // Using context shortcut
  await ctx.leaveChat()
})

bot.on(message('text'), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.state.role}`)
})

bot.on('callback_query', async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

  // Using context shortcut
  await ctx.answerCbQuery()
})

bot.on('inline_query', async (ctx) => {
  const result = []
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

  // Using context shortcut
  await ctx.answerInlineQuery(result)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
```

## Production

### Webhooks

```TS
import { Telegraf } from "@icanseeuanywhere/telekaf";
import { message } from '@icanseeuanywhere/telekaf/filters';

const bot = new Telegraf(token);

bot.on(message("text"), ctx => ctx.reply("Hello"));

// Start webhook via launch method (preferred)
bot.launch({
  webhook: {
    // Public domain for webhook; e.g.: example.com
    domain: webhookDomain,

    // Port to listen on; e.g.: 8080
    port: port,

    // Optional path to listen for.
    // `bot.secretPathComponent()` will be used by default
    path: webhookPath,

    // Optional secret to be sent back in a header for security.
    // e.g.: `crypto.randomBytes(64).toString("hex")`
    secretToken: randomAlphaNumericString,
  },
});
```

Use `createWebhook()` if you want to attach Telegraf to an existing http server.

<!-- global bot, tlsOptions -->

```TS
import { createServer } from "http";

createServer(await bot.createWebhook({ domain: "example.com" })).listen(3000);
```

```TS
import { createServer } from "https";

createServer(tlsOptions, await bot.createWebhook({ domain: "example.com" })).listen(8443);
```

- [AWS Lambda example integration](https://github.com/feathers-studio/telegraf-docs/tree/master/examples/functions/aws-lambda)
- [Google Cloud Functions example integration](https://github.com/feathers-studio/telegraf-docs/blob/master/examples/functions/google-cloud-function.ts)
- [`express` example integration](https://github.com/feathers-studio/telegraf-docs/blob/master/examples/webhook/express.ts)
- [`fastify` example integration](https://github.com/feathers-studio/telegraf-docs/blob/master/examples/webhook/fastify.ts)
- [`koa` example integration](https://github.com/feathers-studio/telegraf-docs/blob/master/examples/webhook/koa.ts)
- [NestJS framework integration module](https://github.com/bukhalo/nestjs-telegraf)
- [Cloudflare Workers integration module](https://github.com/Tsuk1ko/cfworker-middware-telegraf)
- Use [`bot.handleUpdate`](https://telegraf.js.org/classes/Telegraf-1.html#handleupdate) to write new integrations

### Error handling

If middleware throws an error or times out, Telegraf calls `bot.handleError`. If it rethrows, update source closes, and then the error is printed to console and process terminates. If it does not rethrow, the error is swallowed.

Default `bot.handleError` always rethrows. You can overwrite it using `bot.catch` if you need to.

⚠️ Swallowing unknown errors might leave the process in invalid state!

ℹ️ In production, `systemd` or [`pm2`](https://www.npmjs.com/package/pm2) can restart your bot if it exits for any reason.

## Advanced topics

### Working with files

Supported file sources:

- `Existing file_id`
- `File path`
- `Url`
- `Buffer`
- `ReadStream`

Also, you can provide an optional name of a file as `filename` when you send the file.

<!-- global bot, fs -->

```js
bot.on('message', async (ctx) => {
  // resend existing file by file_id
  await ctx.replyWithSticker('123123jkbhj6b')

  // send file
  await ctx.replyWithVideo(Input.fromLocalFile('/path/to/video.mp4'))

  // send stream
  await ctx.replyWithVideo(
    Input.fromReadableStream(fs.createReadStream('/path/to/video.mp4'))
  )

  // send buffer
  await ctx.replyWithVoice(Input.fromBuffer(Buffer.alloc()))

  // send url via Telegram server
  await ctx.replyWithPhoto(Input.fromURL('https://picsum.photos/200/300/'))

  // pipe url content
  await ctx.replyWithPhoto(
    Input.fromURLStream('https://picsum.photos/200/300/?random', 'kitten.jpg')
  )
})
```

### Middleware

In addition to `ctx: Context`, each middleware receives `next: () => Promise<void>`.

As in Koa and some other middleware-based libraries,
`await next()` will call next middleware and wait for it to finish:

```TS
import { Telegraf } from '@icanseeuanywhere/telekaf';
import { message } from '@icanseeuanywhere/telekaf/filters';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  await next() // runs next middleware
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

bot.on(message('text'), (ctx) => ctx.reply('Hello World'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```

With this simple ability, you can:

- extract information from updates and then `await next()` to avoid disrupting other middleware,
- like [`Composer`] and [`Router`], `await next()` for updates you don't wish to handle,
- like [`session`] and [`Scenes`], [extend the context](#extending-context) by mutating `ctx` before `await next()`,
- [intercept API calls](https://github.com/telegraf/telegraf/discussions/1267#discussioncomment-254525),
- reuse [other people's code](https://www.npmjs.com/search?q=telegraf-),
- do whatever **you** come up with!

[`Telegraf`]: https://telegraf.js.org/classes/Telegraf-1.html
[`Composer`]: https://telegraf.js.org/classes/Composer.html
[`Context`]: https://telegraf.js.org/classes/Context.html
[`Router`]: https://telegraf.js.org/classes/Router.html
[`session`]: https://telegraf.js.org/modules.html#session
[`Scenes`]: https://telegraf.js.org/modules/Scenes.html

### Usage with TypeScript

Telegraf is written in TypeScript and therefore ships with declaration files for the entire library.
Moreover, it includes types for the complete Telegram API via the [`typegram`](https://github.com/KnorpelSenf/typegram) package.
While most types of Telegraf's API surface are self-explanatory, there's some notable things to keep in mind.

#### Extending `Context`

The exact shape of `ctx` can vary based on the installed middleware.
Some custom middleware might register properties on the context object that Telegraf is not aware of.
Consequently, you can change the type of `ctx` to fit your needs in order for you to have proper TypeScript types for your data.
This is done through Generics:

```ts
import { Context, Telegraf } from '@icanseeuanywhere/telekaf'

// Define your own context type
interface MyContext extends Context {
  myProp?: string
  myOtherProp?: number
}

// Create your bot and tell it about your context type
const bot = new Telegraf<MyContext>('SECRET TOKEN')

// Register middleware and launch your bot as usual
bot.use((ctx, next) => {
  // Yay, `myProp` is now available here as `string | undefined`!
  ctx.myProp = ctx.chat?.first_name?.toUpperCase()
  return next()
})
// ...
```


---

## Author & Maintainer

This fork is maintained by **@kafka** — [t.me/kafk6](https://t.me/kafk6)

Upstream project: [telegraf/telegraf](https://github.com/telegraf/telegraf) by The Telegraf Contributors.
