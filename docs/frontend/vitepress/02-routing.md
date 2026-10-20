# 02 项目骨架、约定式路由与核心配置

> 本页讲清楚 VitePress 工程的最小骨架、文件路径如何自动变成 URL、以及配置文件 `config.mts` 的加载机制和 `base` 这一最易踩坑的选项。后续主题、构建、部署模块都建立在这套约定之上。
**前置依赖**：子模块 01（理解 SSG 定位与两阶段工作模式）
**适用版本**：VitePress `1.6.4`；约定式路由、`base`、frontmatter 机制在整个 1.x 稳定。
---
## 一、最小项目骨架
VitePress 以一个目录（通常叫 `docs`）为站点根（srcDir），核心只有三类东西：内容（md）、配置（`.vitepress/config.*`）、依赖清单（`package.json`）。
```plain text
knowledge-site/
├── package.json                 # 声明 vitepress 依赖与 scripts
├── package-lock.json            # 锁定依赖，保证 CI 可复现
└── docs/                        # srcDir：站点根
    ├── index.md                 # 首页（对应根 URL）
    ├── guide.md                 # → /guide
    ├── basics/
    │   ├── index.md             # → /basics/
    │   └── java.md              # → /basics/java
    └── .vitepress/
        ├── config.mts           # 站点配置（导航/侧边栏/主题/base）
        ├── theme/               # 可选：自定义主题（子模块 03）
        ├── dist/                # 构建产物（不提交，被 gitignore）
        └── cache/               # dev/build 缓存（不提交）
```
`package.json` 里通常只有三条脚本：`vitepress dev docs`、`vitepress build docs`、`vitepress preview docs`。`dist/` 与 `cache/` 必须加入 `.gitignore`——它们是可再生产物，提交进仓库既污染历史又容易在 CI 里造成旧产物干扰。
## 二、约定式路由：文件路径即 URL
VitePress 没有可编辑的路由表，路由由 srcDir 下的**文件相对路径**推导。规则少而确定：
| 源文件（相对 docs） | 访问路径 | 说明 |
| --- | --- | --- |
| `index.md` | `/` | 目录首页 |
| `guide.md` | `/guide` | 同名页面 |
| `basics/index.md` | `/basics/` | 子目录首页 |
| `basics/java.md` | `/basics/java` | 嵌套页面 |
| `foo/bar.md` | `/foo/bar`（clean URL） | 构建产物是 `.html` 文件 |
三个必须形成肌肉记忆的点：一是默认 **clean URL**，配置和 Markdown 链接里写 `/basics/java` 而不带 `.md`/`.html`；二是 `index.md` 会被吃掉一层名字，目录页要能被侧边栏「分区首页」链接命中就必须存在 `index.md`，否则点分区标题会 404；三是路径**大小写与拼写完全一致**，本地 macOS/Windows 文件系统默认大小写不敏感能放过的错误，到了 Linux 的 CI/CDN 上就是 404。
## 三、配置文件：加载时机与形态
配置放在 `.vitepress/config.mts`（或 `.ts/.js/.mjs`），用 `defineConfig` 包裹以获得类型提示：
```typescript
import { defineConfig } from 'vitepress'
export default defineConfig({
  lang: 'zh-CN',
  title: '全栈知识体系',
  base: '/learn-soft-engineering/',
  themeConfig: {
    nav: [{ text: '首页', link: '/' }],
    sidebar: { '/basics/': [] }
  },
  vite: { /* 透传给底层 Vite 的配置 */ }
})
```
机制上要知道：配置在 dev 启动与 build 时各加载一次，Node 环境执行（不是浏览器），所以可以用 ESM 导入、读环境变量、做条件分支；VitePress 监听配置文件变化，改 nav/sidebar 会自动热更新，不必重启。`vite` 字段会原样透传给底层 Vite，想加插件、改构建别名都从这里进，而不是另起一个 `vite.config`。
## 四、base：项目页子路径为什么必须配对
`base` 是部署在域名子路径时的资源前缀，默认 `/`。它会被拼进**所有产物 URL**：HTML 引用的 JS/CSS、静态资源、内部跳转基准。
- 部署在根域名（自定义域名或 `用户名.github.io` 根仓库）：保持 `base: '/'`。
- 部署在项目页 `https://用户名.github.io/仓库名/`：必须设 `base: '/仓库名/'`，**首尾斜杠都不能少**。
不这样会怎样：`base` 仍是 `/` 时，页面 HTML 会去 `/assets/xxx.js` 取资源，而真实地址是 `/仓库名/assets/xxx.js`，于是页面 HTML 能打开（你访问的 URL 对）却**全屏无样式、按钮全失效**——这是新手最常见的「本地好好的、上线就裸奔」事故。反过来在根域名部署却带了子路径 `base` 也会整体 404。
## 五、frontmatter：页面级配置
文件顶部 `---` 之间的 YAML 是该页 frontmatter，优先级高于全局主题配置，用于页面级覆盖：
```yaml
---
title: 页面标题
outline: [2, 3]        # 右侧大纲收录的标题层级，false 可关闭
sidebar: false         # 本页隐藏侧边栏（适合全屏首页）
prev: false            # 关闭上一篇
next:
  text: 下一篇标题
  link: /foo/bar
---
```
首页通常用内置的 `layout: home` 加 `hero`/`features` 数据生成，而不是手写正文。frontmatter 与正文标题、nav 配置是三处独立的「标题来源」，要保持一致以免面包屑与浏览器标题不一致。
## 六、死链检查与路由重写
构建时 VitePress 会扫描 Markdown 内部链接，指向不存在页面会直接报错让构建失败（`dead link`），把 404 挡在发布之前——这也是必须给每个 nav/sidebar 链接建对应 md 的原因。确需把旧链接映射到新路径时用 `rewrites` 做路径重写，而不是保留重复文件：
```typescript
export default defineConfig({
  rewrites: { 'old/:slug': 'new/:slug' }
})
```
## 七、srcDir、outDir 与缓存
- `srcDir`：内容根，相对配置文件解析；把站点放进已有 monorepo 时常指向 `../../docs` 之类。
- `outDir`：产物目录，默认 `.vitepress/dist`，CI 部署就是上传这个目录。
- `cache: true`（默认）会在 `.vitepress/cache` 缓存已编译结果与本地搜索索引，大项目显著加快增量构建；目录不提交、出现诡异旧内容时可整体删除重建。
## 八、实战场景
### 场景 1：上线后页面能打开但没有样式、点击无反应
排查路径：先在浏览器 DevTools 的 Network 看 JS/CSS 是不是 404，再对比请求路径与实际子路径。若请求的是 `/assets/...` 而站点在 `/仓库名/` 下，即为 `base` 缺失。修复：设 `base: '/仓库名/'` 后重新构建部署；确认所有资源 URL 都带该前缀。
### 场景 2：侧边栏点分区标题 404
根因是只有 `basics/java.md` 而没有 `basics/index.md`，侧边栏分区链接 `/basics/` 没有落点。修复：补 `basics/index.md` 作为分区首页，与子模块 03 的多侧边栏配置对应。
### 场景 3：本地能跳转，push 后线上 404
最常见是文件/目录大小写或拼写与链接不一致：macOS 文件系统大小写不敏感，本地 `Java.md` 与 `java.md` 都能命中，Linux 上严格区分。修复：统一为小写连字符文件名，链接逐字符对齐；构建期 dead link 检查只能挡住「页面不存在」，挡不住「大小写不同但本地恰好存在」，需靠命名规范。
## 九、关键问题思考
1. **[高频] 原理题：VitePress 的路由是怎么来的，需要手写路由表吗？** 不需要。它是约定式路由：以 srcDir 为根，按 md 文件的相对路径推导 URL，`index.md` 映射为目录根、其他文件映射为同名路径，构建时逐页产出对应 HTML。
2. **[高频] 场景题：什么是 `base`，不配会怎样？** `base` 是部署在域名子路径时给所有静态资源加的 URL 前缀。部署在项目页 `/仓库名/` 却保持默认 `/`，HTML 能打开但引用的 JS/CSS 从错误根路径加载导致 404，表现为无样式、无交互；必须设为 `/仓库名/`，首尾斜杠不可省。
3. **[高频] 辨析题：`index.md` 在路由中有什么特殊之处？** 它映射为所在目录的根路径（`docs/basics/index.md` → `/basics/`），文件名本身不出现在 URL 里。缺少它时，指向该分区的链接没有落点会 404。
4. **[中频] 概念题：frontmatter 解决什么问题，和全局配置什么关系？** frontmatter 是页面级配置（本页大纲层级、是否隐藏侧边栏/上下篇、首页 hero 数据等），只作用于当前页，优先级高于全局 `themeConfig`；全局导航这类跨页配置仍写在 `config.mts`。
5. **[高频] 原理题：VitePress 如何在发布前发现死链？** 构建时扫描全部 Markdown 的内部链接并校验目标页面是否存在，命中不存在的路径会让 `vitepress build` 直接失败，从而把 404 拦截在 CI，而不是等用户点到。
6. **[中频] 场景题：为什么本地正常、CI 上线后链接 404？** 多为路径大小写/拼写：macOS 与 Windows 文件系统默认大小写不敏感会掩盖错误，Linux Runner 严格区分。要用统一的小写命名、链接与路径逐字符一致来规避。
7. **[中频] 原理题：配置文件在哪一侧执行、改动是否要重启？** 配置在 Node 侧于 dev/build 启动时执行，因此可用 ESM、环境变量和条件逻辑；VitePress 监听配置文件，改 nav/sidebar 等会热更新，一般不用手动重启。
8. **[中频] 概念题：`dist/` 和 `cache/` 该不该提交到 Git？** 都不该。`dist` 是每次 CI 可再生的构建产物，`cache` 是本地/构建缓存，提交会污染历史并可能混入旧产物，应加入 `.gitignore`，由部署流水线现构建。
9. **[中频] 场景题：要把 VitePress 嵌进已有 monorepo，关键改哪一项？** 用 `srcDir` 把内容根指向实际文档目录，用 `vite` 字段与根工程的 Vite 配置/插件协同；脚本与 CI 的构建上下文随之指向该目录，产物仍由 `outDir` 统一输出。
