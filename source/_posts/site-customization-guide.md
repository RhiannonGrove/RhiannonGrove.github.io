---
title: 网站自定义指南：文字、排版、配色与背景
date: 2026-10-22 00:00:00
updated: 2026-10-22 00:00:00
permalink: guide/customization/
tags:
  - 网站维护
---

这是一份写给Rhiannon自己的修改手册，记录这个网站目前可以在哪里调整、改哪个文件，以及修改后怎样发布。以下路径都从 GitHub 仓库根目录开始计算；内容对应 2026 年 10 月 22 日的网站版本。
(主要是Rhiannon的记性比较差，过几天就要重新像无头苍蝇一样点开各个文件查看啦=￣ω￣=）

网站使用 Hexo 和自定义主题 `grove`。日常修改文章、图片、视频和配置后，提交到 `main`，GitHub Actions 会自动构建并更新网站。

## 一、Rhiaanon的贴心方案
为了让读者们能够很好沉浸网站，以及考虑到不同时间地点光照的不同，网站特设了能够由读者自己调节的方案👇。

### 1. 读者自设😉

点击页面左下角的 **外观**，可以调整：

| 项目 | 可选内容 | 保存方式 |
| --- | --- | --- |
| 视觉主题 | Original、Morandi Light、Wangxiang Dark | 浏览器记住选择 |
| 背景模式 | 动态视频、静态图片 | 与主题分开保存 |
| 正文卡片不透明度 | 30%～100% | 按主题分别保存 |
| 列表／侧栏卡片不透明度 | 30%～100% | 按主题分别保存 |
| 恢复本主题默认 | 恢复当前主题的两项卡片数值 | 不清除其他主题的调整 |

这里使用的是 **不透明度**：数值越小，越能看清背后的图片或视频；100% 表示卡片底色完全不透明。滑块只改变卡片底色，不会把文字、图片、代码一起变淡。

“正文卡片”包括文章、关于、归档和标签列表所在的大卡片；“列表／侧栏卡片”包括首页文章列表、首页右侧卡片和文章目录。导航栏、外观设置面板和代码块保持各自的底色，方便阅读和操作。

换浏览器或清除站点数据后，会重新使用网站默认值；浏览器禁止存储时，本次仍可调整，但不能保证刷新后保留。

首次访问仍使用 Original。动态／静态模式的默认值来自主题配置。系统开启“减少动态效果”时，视频不会自动加载，页面会使用静态图片；视频加载失败或自动播放受限时也有图片回退。

### 2. Rhiannon大人强制爱o((>ω< ))o

想修改所有新访客看到的默认值、文字、字号、颜色和布局，需要编辑仓库文件。已经自行保存过外观偏好的浏览器，会优先使用自己的选择；检查新默认值时，可以点击“恢复本主题默认”，或用无痕窗口打开网站。

## 二、常用修改入口速查

| 想修改什么 | 文件或目录 | 具体入口 |
| --- | --- | --- |
| 首页大标题、小字、背景模式和路径 | `themes/grove/_config.yml` | `home_cover` |
| 三套主题的卡片默认不透明度 | `themes/grove/_config.yml` | `card_opacity` |
| 浏览器标签页中的站名、网站描述 | 根目录 `_config.yml` | `title`、`description` |
| 文章标题、日期、标签和正文 | `source/_posts/` | 每篇 Markdown 的头部和正文 |
| 关于页标题与介绍 | `source/about/index.md` | 头部 `title` 和下方文字 |
| 图片、视频资源 | `source/images/`、`source/videos/` | 上传文件后填写网站路径 |
| 顶部站名、导航、页脚 | `themes/grove/layout/layout.ejs` | `.brand`、`nav`、`.site-footer` |
| 首页栏目文案、侧栏顺序 | `themes/grove/layout/index.ejs` | 近期文章、标签、归档、网站信息 |
| 归档页、标签页文案 | `themes/grove/layout/archive.ejs`、`tag.ejs` | 标题、返回链接、统计文字 |
| 文章日期、正文、目录结构 | `themes/grove/layout/post.ejs` | 文章头部与右侧目录 |
| 通用字号、尺寸、间距和原主题配色 | `themes/grove/source/css/style.css` | 对应 CSS 选择器 |
| 两套新主题配色、材质、外观面板 | `themes/grove/source/css/visual-themes.css` | 主题变量及对应规则 |
| 代码复制、折叠阈值 | `themes/grove/source/js/code-blocks.js` | 行数与高度判断 |
| 星点数量、速度和导航隐藏逻辑 | `themes/grove/source/js/home-stars.js` | 粒子参数与滚动阈值 |
| 独立生日页 | `source/birthday/index.html` | 文案、内嵌样式和祝福数组 |

`public/` 是构建生成的网页，不是维护入口；直接修改它不会成为稳定的源码更新。`node_modules/` 也不需要手动改。

## 三、首页标题、小字和网站名称

### 1. 首页正中央的大标题与小字

编辑 `themes/grove/_config.yml`：

```yaml
home_cover:
  type: video
  image: /images/home-cover.jpg
  video: /videos/home-cover.mp4
  title: Rhiannon Grove
  subtitle: 在字里行间，慢慢生长。
```

修改 `title` 改变首页中央的大标题；修改 `subtitle` 改变其下方的小字。

当前首页会单独给标题里的 `Grove` 着色。这段拆分逻辑在 `layout/index.ejs`，搜索 `homeCoverTitle.split`。如果将这个单词也改掉，并希望新单词继续高亮，需要同步修改拆分表达式和 `part === 'Grove'` 的判断。

### 2. 顶部站名与浏览器标签页名称

它们是两个入口：

- 顶部左侧站名：在 `layout/layout.ejs` 中搜索 `class="brand"`，修改其中的文字，保留链接和需要着色的 `span`。
- 浏览器标签页中的网站名称：修改根目录 `_config.yml` 的 `title`。文章页会显示“文章标题 · 网站名称”。
- 搜索引擎描述使用根配置里的 `description`。

根配置也有 `subtitle` 和 `author`，但当前模板没有用它们显示首页小字或文章作者栏。改首页小字请使用 `home_cover.subtitle`，不要只改根配置的同名项。

## 四、图片／MP4 背景与路径

### 1. 设置全站默认模式

仍在主题的 `home_cover` 中修改：

```yaml
type: image  # image 为静态图片；video 为动态视频
image: /images/home-cover.jpg
video: /videos/home-cover.mp4
```

这是 `home_cover` 内部的三项，不要删掉同一段中的标题和小字。

`image` 既是静态模式的背景，也是视频无法播放时的备用图。只要配置了视频路径，访客就可以在外观面板切换到视频；如果将 `video` 留空，动态选项会不可用。

### 2. 更换资源

- 图片上传到 `source/images/`，例如 `source/images/backgrounds/spring.jpg`，配置中填写 `/images/backgrounds/spring.jpg`。
- 视频上传到 `source/videos/`，例如 `source/videos/new-cover.mp4`，配置中填写 `/videos/new-cover.mp4`。
- 两种路径也可以使用完整的 HTTPS 地址，前提是该地址能公开访问。

路径不写 `source`，也不能填写电脑上的 `C:\...`。网站访问的是已发布的资源，不会读取访客或站长的桌面。

当前动态背景是经过网页压缩的约 1.5 MB、1920×952、4 秒循环 MP4。替换时可使用适合网页播放的 H.264 MP4，并留意文件体积和手机加载速度。

### 3. 背景裁切、位置与明暗

图片的位置和裁切在 `style.css` 的 `body.image-background::before` 中：`background-position: center`、`background-size: cover`。

视频对应 `.site-background-video` 的 `object-position: center`、`object-fit: cover`。`cover` 会铺满屏幕并裁去超出部分，横屏视频在竖屏手机上会被裁掉左右两侧。需要偏向人物位置时，可把相应位置改成 `60% center` 等值，并同时检查桌面和手机。

两套新主题有独立的背景氛围层，在 `visual-themes.css` 各主题的 `--overlay` 与 `--ambient` 中调整。若觉得新主题下背景较淡，除了卡片滑块，还可以调整 `--overlay` 的颜色和 alpha 值。Original 没有这套新增遮罩。

## 五、卡片不透明度：个人调整与全站默认

日常观看时使用外观面板即可。要修改全站默认值，编辑主题配置中的这一段：

```yaml
card_opacity:
  original:
    article: 0.66
    widgets: 0.54
  morandi:
    article: 0.90
    widgets: 0.86
  wangxiang:
    article: 0.90
    widgets: 0.86
```

`article` 对应正文大卡片，`widgets` 对应首页列表、侧栏与目录。小数 `0.66` 就是 66% 不透明度。有效范围是 `0.30` 到 `1.00`；不符合范围或类型的值会使用程序内的备用默认值。

不要给卡片整体设置 `opacity: 0.66` 来代替这项配置：那会让卡片内的文字、图片、按钮和代码一起变淡。现在的实现只调整背景颜色的 alpha。

新主题的卡片颜色由 `visual-themes.css` 的 `--card-article-rgb` 和 `--card-widget-rgb` 控制；它们只写三个 RGB 数字，例如 `252 250 246`。不透明度由配置和滑块提供。导航与设置面板使用自己的表面变量，不受滑块影响。

## 六、写文章：标题、时间、标签、正文和图片

在 `source/_posts/` 中新建或编辑 Markdown 文件。文章开头的头部示例：

```yaml
---
title: 我的新文章
date: 2026-10-22 09:00:00
updated: 2026-10-22 12:00:00
tags:
  - 随笔
  - 学习记录
---
```

分隔线下方写正文。`title` 是文章标题，`date` 用于发表时间、排序和默认链接日期；`updated` 用于显示更新时间，不写时当前配置通常沿用发表时间。站点时区在根配置中是 `Asia/Shanghai`。

侧栏虽然叫“分类标签”，实际读取的是文章的 `tags`。改 `categories` 不会直接改变这个侧栏；修改标签时，应修改文章头部的 `tags`。

正文可使用二级、三级标题、列表、引用、表格、链接与代码围栏。正文中的二级标题写成 `## 标题`，三级标题写成 `### 标题`；右侧目录会从标题中自动生成。

图片示例：

```markdown
![图片说明](/images/P0/example.png)
```

需要单独限制某张图片大小时，可使用 HTML：

```html
<img src="/images/P0/example.png" alt="图片说明" style="width:70%;max-width:520px;">
```

代码围栏后标注 `c`、`verilog` 等语言，就会按相应规则高亮。`text` 围栏使用轻量文本块，不显示完整复制、折叠工具栏。

默认文章链接由根配置的 `permalink` 决定。改变旧文章的日期、文件名或全局链接规则前，需要考虑已有链接。本篇手册使用头部 `permalink: guide/customization/` 固定地址，便于收藏。

关于页不是普通文章：它的内容在 `source/about/index.md`，标题仍在头部的 `title` 中修改。

## 七、字号、字体、行距与段落间距

通用排版主要在 `themes/grove/source/css/style.css`。可以在 GitHub 编辑页面中搜索选择器，找到现有规则后修改对应数值。

### 1. 常见文字位置

| 位置 | 搜索的选择器 | 当前主要设置 |
| --- | --- | --- |
| 首页中央大标题 | `.home-cover-content h1` | 桌面 `clamp(52px, 8vw, 116px)` |
| 首页中央小字 | `.home-cover-content p` | 桌面 `clamp(16px, 1.7vw, 25px)` |
| 文章页大标题 | `.article h1` | 桌面 `clamp(34px, 4vw, 48px)` |
| 文章正文 | `.prose` | `15px`，行高 `1.78` |
| 正文二级标题 | `.prose h2` | `23px` |
| 正文三级标题 | `.prose h3` | `18px` |
| 首页文章标题、归档条目 | `.post-card h2, .post-card h3` | `font` 简写中的 `21px` |
| “近期文章”栏目标题 | `.section-heading h2` | `29px` |
| 侧栏栏目标题 | `.sidebar-widget-title` | `font` 简写中的 `21px` |
| 标签／归档链接、网站信息 | `.sidebar-tag-list a`、`.archive-month-list a`、`.site-info-list` | `13px` |
| 文章日期 | `.article-meta` | `12px` |
| 文章目录 | `.toc-card a` | `12px`，行高 `1.55` |
| 普通导航链接 | `nav a` | `13px` |
| 顶部站名 | `.brand` | `22px` |
| 页脚 | `.site-footer` | `12px` |

`clamp(最小值, 随屏幕变化的值, 最大值)` 表示字号会在上下限之间响应式变化。比如把封面标题改为 `clamp(44px, 7vw, 96px)`，会同时降低上限和随屏幕放大的幅度。

注意 `font: 400 21px ...` 这种写法中的 `21px` 也是字号。若只在同一条 `font` 简写前面另写 `font-size`，后面的简写可能把它覆盖；直接修改现有简写里的数值更容易核对。

### 2. 正文行距与留白

在现有规则中修改，例如：

```css
.prose {
  font-size: 16px;
  line-height: 1.85;
  letter-spacing: .01em;
}

.prose p,
.prose ul,
.prose ol,
.prose blockquote {
  margin: 0 0 1em;
}
```

`line-height` 调整同一段中的行距；`margin-bottom` 调整段与段之间的距离；`letter-spacing` 调整字距。`em` 会随当前字号变化，适合控制文字相关的留白。

标题的上下间距在 `.prose h2`、`.prose h3` 的 `margin` 中。卡片边缘到正文的距离属于 `padding`，不是段落行距。

全站基础字体在 `body` 的 `font-family`；正文标题和文章标题使用自己的字体规则。这里列出字体名称只是指定优先顺序，不会自动下载安装字体。想让所有设备显示同一套自定义字体，需要另行提供字体文件或加载来源。

### 3. 手机端需要同步看

文件底部有 `@media (max-width: 700px)`。当前手机端正文为 `14.5px`、行高 `1.72`，文章标题为 `32px`，正文二级标题为 `21px`；首页标题另用 `clamp(36px, 11vw, 58px)`，小字为 `14px`，首页导航为 `11px`。

如果只改了上面的桌面规则，底部这些手机规则仍可能覆盖它。修改后至少同时检查一个宽屏和一个约 390px 的窄屏。

## 八、卡片大小、侧栏宽度、圆角和阴影

| 想调整的尺寸 | 主要入口 | 说明 |
| --- | --- | --- |
| 首页内容总宽度 | `.home-body` | `max-width: 1280px` |
| 内页外框宽度 | `.site-shell` | `max-width: 1280px`，左右 `padding: 32px` |
| 首页右侧栏宽度 | `.home-content` | 网格第二列 `260px`，列间距 `28px` |
| 文章正文与目录宽度 | `.reading-layout` | 正文列最大 `850px`，目录列 `260px`，间距 `24px` |
| 关于、归档等大卡片宽度 | `.article` | 自身最大 `820px`；文章阅读网格会另行控制宽度 |
| 正文卡片内部边距 | `.article` | `48px 54px 64px`，分别影响上、左右、下 |
| 首页文章列表内部边距 | `.post-section` | `48px 56px 58px` |
| 首页侧栏卡片内边距 | `.archive-widget, .tag-widget, .site-info-widget` | `30px 24px 28px` |
| 卡片圆角 | 各卡片的 `border-radius` | 正文 `24px`、列表 `26px`、目录 `20px` |
| 图片圆角 | `.prose img` | `border-radius: 14px` |
| 公共卡片阴影 | `--shadow` 及个别组件规则 | 新主题在各自作用域中覆盖变量 |

`padding: 48px 54px 64px` 是三值写法，表示上、左右、下。`border-radius` 越大，圆角越圆。阴影常见写法为“横向偏移、纵向偏移、模糊范围、颜色”，颜色中的 alpha 越低，阴影越轻。

磨砂模糊与不透明度是两回事：Original 的正文卡片使用 `backdrop-filter: blur(18px)`，列表通常为 `16px`；新主题普通内容卡片使用 `--backdrop`。减少模糊值可以让卡片后方的细节更清楚，但不会自动改变底色的不透明度。

980px 是另一处断点：文章目录在较窄屏幕隐藏，首页侧栏变为 220px。700px 以下首页列表和侧栏改为上下排列，文章卡片也使用较小边距。修改宽度时，不要只改桌面数值而忘记这些对应规则。

## 九、颜色：Original 与两套新主题分别改哪里

### 1. Original

基础颜色在 `style.css` 顶部：

```css
:root {
  --ink: #30343d;
  --muted: #747986;
  --accent: #6675b9;
  --accent-soft: #8f9bce;
}
```

`--ink` 是主要文字颜色，`--muted` 是次级文字，`--accent` 用于强调和部分链接，`--accent-soft` 用于较柔和的强调。不是所有颜色都来自变量，导航、封面标题、代码高亮等还有单独的规则。

首页顶部和大标题中 `Grove` 的浅蓝色在这组规则中：

```css
.home-page .brand span,
.home-cover-content .cover-title-accent {
  color: #d3e8ff;
}
```

首页导航有透明状态和滚动后的浮动状态，后者的颜色在 `.site-header.is-floating` 相关规则中。修改一个状态后，应向下、向上滚动再检查另一个状态。

### 2. Morandi Light 与 Wangxiang Dark

编辑 `visual-themes.css`，找到对应的作用域：

```css
:root[data-visual-theme="morandi"] {
  /* 莫兰迪浅色的变量 */
}

:root[data-visual-theme="wangxiang"] {
  /* 万象深色的变量 */
}
```

常用变量对应关系：

| 变量 | 控制内容 |
| --- | --- |
| `--background` | 页面基础底色 |
| `--surface`、`--surface-elevated` | 导航、设置面板等表面底色 |
| `--surface-secondary` | 次级表面、部分表格和工具条 |
| `--card-article-rgb`、`--card-widget-rgb` | 可调卡片的 RGB 底色 |
| `--text-primary` | 主要文字 |
| `--text-secondary`、`--text-muted` | 次级文字与提示 |
| `--accent-primary`、`--accent-secondary` | 主／辅助强调色 |
| `--brand-accent` | 顶部站名中 Grove 的颜色 |
| `--accent-hover` | 首页标题强调及部分悬停颜色 |
| `--link` | 链接及一些强调文字 |
| `--border`、`--divider` | 边框与分隔线 |
| `--selection`、`--focus` | 选中文字的底色与键盘焦点 |
| `--success`、`--warning`、`--error` | 状态色；仅在相应组件使用时生效 |
| `--shadow`、`--glow` | 投影与内高光 |
| `--overlay`、`--ambient` | 背景氛围层 |
| `--backdrop` | 普通内容卡片的背景模糊强度 |
| `--hover-surface` | 悬停和轻量强调底色 |

修改颜色时应在对应主题的作用域内修改，不要把针对新主题的规则直接放到全局 `body` 上。CSS 越靠后不代表一定能覆盖：选择器的具体程度也会影响优先级。若改完没有变化，先检查是否被更具体的首页、手机端或主题规则覆盖。

## 十、代码块的字号、配色、复制与折叠

### 1. 字号与工具按钮

`style.css` 的 `.prose pre` 使用 `font: 13px/1.65 ...`，这里同时指定字号和行高。高亮代码的表格还有 `.prose figure.highlight table` 的 `font-size`，手机规则也有一处对应设置；普通 `text` 块在 `.prose figure.highlight.text pre` 中另有 `font` 简写。若要统一所有代码的大小，应一起核对这些入口。

复制按钮的字号在 `.code-copy`，折叠按钮在 `.code-toggle`。代码块圆角、内边距、工具栏底色和行号栏样式分别在 `.prose figure.highlight`、它的 `pre`、`::before` 和 `.gutter` 中。

### 2. 语法颜色

Original 的关键词、字符串、注释等颜色在 `style.css` 的高亮规则中。Verilog 使用单独的 ISE 风格蓝色规则。

新主题使用 `visual-themes.css` 中的 `--code-background`、`--code-surface`、`--code-text`、`--code-border` 和 `--syntax-*` 变量。比如 `--syntax-comment` 控制注释，`--syntax-keyword` 控制一般关键词，`--syntax-verilog` 控制 Verilog 专属关键词颜色。

### 3. 长代码何时折叠

逻辑在 `js/code-blocks.js`：

```javascript
const isLong = lineCount > 20 || block.scrollHeight > 440;
```

当前为超过 20 行，或者原始高度超过 440px 时折叠。可以修改这两个数字。折叠后的可见高度则在 CSS 中，桌面是 `max-height: 390px`，手机是 `320px`。阈值和折叠后高度不是同一项。

复制按钮会复制整段代码，包括折叠区域。不要为了改变外观直接删除 `.code-copy` 或 `.code-toggle` 对应的结构；仅改配色或字号通常使用 CSS 就够了。

## 十一、导航、栏目文案、日期和页脚

- 顶部“首页、标签、归档、关于”的文案和链接在 `layout/layout.ejs` 的 `nav` 中。
- 首页“Journal、近期文章、分类标签、归档、网站信息”及侧栏排列顺序在 `layout/index.ejs` 中。调整顺序时，应整体移动对应的 `section`，而不是只移动标题文字。
- “文章归档”在 `layout/archive.ejs`；标签页的标题、返回链接和文章数量文案在 `layout/tag.ejs`。
- 文章页的“发表于、更新于”在 `layout/post.ejs`，目录标题也在这里。
- 页脚两段文字在 `layout/layout.ejs` 的 `.site-footer` 中，年份由构建时的日期生成。

日期格式目前在模板中显式写成 `YYYY-MM-DD`、`YYYY · MM · DD` 等。若想统一改成“2026 年 10 月 22 日”，需要修改对应 EJS 的 `date(...)` 格式；仅修改根配置的 `date_format`，不会覆盖模板里已经显式指定的格式。

文章排序默认为发表时间倒序。根配置 `index_generator.per_page` 控制首页每页文章数，`per_page` 控制通用分页数量。当前模板的翻页入口并不完整，增加页数不等于自动增加可见的翻页按钮；若希望首页一次展示全部文章，可以将 `index_generator.per_page` 设为 `0`，并检查页面长度与加载体验。

## 十二、星点、向下箭头与滚动导航

这些效果主要分布在 `home-stars.js` 和 `style.css`：

| 效果 | 可调整入口 |
| --- | --- |
| 星点数量 | `particleCount`，手机 42、桌面 92 |
| 星点颜色 | `colors` 数组 |
| 星点大小 | `size` 的随机范围，目前约 0.8～3.4px |
| 星点运动周期 | `duration`，目前约 8～16 秒 |
| 漂浮和闪动程度 | CSS 的 `home-star-drift` 关键帧 |
| 向下箭头的大小、位置、颜色 | `.home-scroll`、`.home-scroll span` |
| 箭头轻微上下浮动 | `home-scroll-bob` 关键帧和动画周期 |
| 导航何时恢复顶部状态 | `atTop` 的 32px 判断 |
| 上下滚动触发隐藏／显示的灵敏度 | `difference > 4` 和 `difference < -4` |

若想关闭新增星点，可把 `particleCount` 设为 `0`；背景图片或视频本身画进去的星点不会随之消失。系统“减少动态效果”也会影响星点与视频，不要将它误认为背景文件没有生效。

## 十三、网站信息和独立生日页

### 1. 网站信息

首页网站信息的显示文案在 `layout/index.ejs`，统计逻辑在 `themes/grove/scripts/site-info.js`。文章数和总字数会自动更新；中文按字、其他文字按词或数字片段统计，代码块不计入正文总字数。最后更新时间优先取最近一次 Git 提交的时间，并不是只看最近一篇文章的 `updated`。

访客数和浏览量由不蒜子返回，前端接入在 `js/site-info.js`。它们与手工填写的数字不同；服务无法返回时会显示“—”。修改标签文字或字号不会补回接入前的访问记录。访客数也不能等同于注册用户数量。

### 2. 独立生日页

`source/birthday/index.html` 使用 `layout: false`，因此拥有独立页面结构。可以在这个文件里修改：

- 标题、滚动文案、祝福文字、按钮文字和底部提示。
- `wishes` 数组中的随机祝福。
- 内嵌样式中的 `--pink`、`--yellow`、`--ink`，以及字号、卡片、蛋糕和动画。

选择新主题时，共用配色会在 `visual-themes.css` 的 `.birthday-page` 规则中覆盖部分颜色。想改新主题下的生日页颜色，要一起检查这一层；Original 下的生日页仍使用自身原有样式。

## 十四、修改与发布的实际步骤

1. 打开仓库 [RhiannonGrove.github.io](https://github.com/RhiannonGrove/RhiannonGrove.github.io)，确认当前分支是 `main`。
2. 根据这篇手册找到文件，使用 GitHub 的编辑入口修改；上传资源时放进对应的 `source` 子目录。
3. 提交修改，填写能说明内容的提交信息，例如 `Update home subtitle`。
4. 在仓库 Actions 中等待 `Publish blog` 成功，再打开网站检查。
5. 至少核对首页、文章页和手机窄屏；涉及主题时分别切换三套主题，涉及背景时分别测试图片和视频。

如果在电脑上编辑，先进入已有 Git 工作区并同步远程最新内容，保留网页端新上传的文章，再修改和提交。常用本地检查是：

```powershell
npm.cmd run build
npm.cmd run server
```

第二个命令启动本地预览，通常在 `http://localhost:4000`，按 Ctrl+C 停止。第一次使用该工作区时需要先安装项目依赖。

### 样式或脚本改了，网页却没变化

先确认 Actions 成功、路径与文件名大小写正确，再检查是否存在手机端或主题覆盖，以及浏览器是否保存了旧的个人偏好。

编辑 CSS 或 JS 后，应更新 `layout/layout.ejs` 中该资源链接的版本参数，例如将 `?v=20261022-card-opacity` 改成一个新的版本字符串。独立生日页也引用了外观资源，修改共用文件时应同步更新 `source/birthday/index.html` 中对应的版本参数。必要时再进行一次强制刷新。

最后，修改 YAML 时使用空格缩进，保持同一层级对齐；不要把 Markdown 的代码围栏一并粘贴进配置文件。每次先改一类内容并确认结果，再继续调整下一项，会更容易找到真正生效的规则。
