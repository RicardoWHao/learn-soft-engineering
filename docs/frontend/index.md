# 前端技术栈全景总览

> 本篇是「前端」目录的**第一张地图与第一部分**，回答四个问题：一个现代前端应用由哪些层组成、每层解决什么问题、主流选择有哪些、本站如何取舍。先建立分层心智模型，再按图索骥进入各专题知识树——本目录第一棵下钻的树是 [VitePress](./vitepress/01-ssg)。
>
> 阅读建议：零基础同学先读「一、二、三」建立全局观，再进 VitePress 01；有经验的同学可直接看「四、五」的选型对比与「八」的目录规划。

**前置依赖**：无，本篇本身就是前端部分的起点。

**事实基线**：本篇涉及外部生态处只做"分层与职责"层面的描述、不逐一钉版本；凡标注"本站采用"的，均以本仓库 `package.json` 实际安装为准——VitePress `^1.6.4`（内置 Vue 3 与 Vite 5 线）、包管理器 npm、纯静态部署到 GitHub Pages。

---

## 一、一张图看懂前端技术栈分层

现代前端可以沿"代码在哪里运行"切成两个世界：**用户侧（浏览器运行时）**与**研发侧（Node + CI 构建时）**，二者通过"构建产物 + 部署"衔接。

```text
┌──────────────────────────────────────────────────────────────────┐
│  用户侧 · 浏览器运行时（产物在用户机器上执行）                          │
│                                                                    │
│  平台标准   HTML  ·  CSS  ·  JavaScript（Web 标准 / 浏览器引擎 / Web API）│
│     │                                                              │
│  视图框架   Vue · React · Angular · Svelte · Solid（组件化/声明式/响应式）│
│  路由状态   vue-router/react-router（或约定式路由） · Pinia/Redux/Zustand │
│     │                                                              │
│  样式 UI    组件库(Element Plus/Ant Design/Naive) · Tailwind · Sass · CSS-in-JS │
│  数据通信   Fetch/Axios · WebSocket/SSE · GraphQL · BFF/网关          │
└──────────────────────────────────────────────────────────────────┘
                              ▲   构建产物（HTML/CSS/JS/图片）经 CDN 下发
                              │   部署形态：静态托管 / Node SSR / 边缘 / Serverless
┌──────────────────────────────────────────────────────────────────┐
│  研发侧 · Node + CI 构建时（只在开发与发布阶段运行，用户看不到）            │
│                                                                    │
│  语言       TypeScript（类型系统） · ES 新语法                        │
│  包管理     npm / pnpm / yarn（依赖、锁文件、workspace）              │
│  构建工具   Vite / webpack / Rspack / esbuild / Rollup（编译·打包·HMR）│
│  工程质量   ESLint/Prettier · 单测/组件测/E2E · 类型检查 · Git · CI/CD │
│  渲染预处理 SSR/SSG 预渲染（本站为 SSG，构建期就把页面算成静态 HTML）    │
└──────────────────────────────────────────────────────────────────┘
        基础设施横切所有层：CDN · HTTPS · 监控(RUM/Sentry) · 安全(XSS/CSRF/CSP) · 跨端
```

记住这张图的关键切分：**框架、路由、状态、UI、通信是"运行时栈"；TS、包管理、构建、Lint、测试、预渲染是"构建时栈"**。很多困惑（为什么 VitePress 不需要服务器、为什么 Shiki 高亮零运行时开销）本质都是"某件事到底发生在哪个世界"。

## 二、分层总表：每层解决什么问题、主流选择、本站落点

| 层 | 解决的核心问题 | 主流选择（代表性） | 本站 / 首个实践落点 |
| --- | --- | --- | --- |
| 平台与标准 | 页面的三种原生语言与运行环境 | HTML/CSS/JS、ECMAScript(TC39)、W3C/WHATWG、V8/Blink/WebKit | 所有页面最终都回归这三种语言 |
| 语言 | 大型项目的类型安全与新语法 | TypeScript、ES2015+ 语法 | VitePress 配置用 TS（`.mts`） |
| 视图框架 | 组件化、声明式渲染、响应式更新 | Vue、React、Angular、Svelte、Solid | **Vue 3**（VitePress 底座） |
| 路由 | URL 与页面/组件的映射 | vue-router、react-router、约定式文件路由 | **约定式路由**（文件路径即 URL），见 [02](./vitepress/02-routing) |
| 状态管理 | 跨组件共享状态、服务端数据缓存 | Pinia、Redux Toolkit、Zustand、Jotai、MobX、TanStack Query | 内容型静态站暂不需要全局状态 |
| 样式与 UI | 设计系统、响应式、主题 | 原生 CSS、Sass/Less、Tailwind、CSS-in-JS、Element Plus/Ant Design/Naive | 默认主题 + **CSS 变量定制**，见 [03](./vitepress/03-default-theme) |
| 数据通信 | 取数、提交、实时推送 | Fetch、Axios、WebSocket、SSE、GraphQL、tRPC、BFF | 无后端取数；搜索走本地索引 |
| 搜索 | 站内检索 | 本地索引（MiniSearch）、Algolia DocSearch、自建后端 | **本地 MiniSearch**（零后端），见 [03](./vitepress/03-default-theme) |
| 构建工具 | dev server、编译、打包、HMR、资源处理 | Vite、webpack、Rspack、esbuild、Rollup、Parcel | **Vite**（VitePress 内置 5.x 线），机制见 [04](./vitepress/04-build) |
| 包管理 | 依赖解析、锁版本、磁盘复用 | npm、pnpm、yarn | **npm**（含 `package-lock.json`） |
| 渲染范式 | 首屏速度、SEO、交互的权衡 | CSR、SSR、SSG、ISR、MPA、同构、岛屿架构 | **SSG**（构建期预渲染），见 [01](./vitepress/01-ssg) |
| 工程质量 | 风格统一、正确性、防回归 | ESLint、Prettier、Stylelint、Vitest/Jest、Playwright/Cypress、husky | 依赖 VitePress 构建期 dead link 检查兜底 |
| 部署与基础设施 | 上线、分发、容灾 | CDN、GitHub Pages/Vercel/Netlify、Nginx、Node SSR、容器/K8s、Serverless | **GitHub Pages + Actions**，见 [05](./vitepress/05-deploy) |
| 性能与监控 | 度量、告警、持续优化 | Lighthouse、Core Web Vitals、Sentry、自建 RUM/APM | 静态站天然占优，治理见 [06](./vitepress/06-engineering) |
| 安全 | 防注入、越权、传输安全 | XSS 防护、CSRF Token、CSP、CORS、HTTPS、依赖审计 | Pages 自动 HTTPS；评论等动态能力需另行评估 |
| 跨端 | 一套能力触达多端 | Electron/Tauri（桌面）、React Native/Flutter、小程序/uni-app（移动端） | 暂未涉及 |

读这张表的方法：**先看"解决什么问题"，再看"主流选择"**。工具会换，层次与要解决的问题长期稳定。

## 三、两条主线：运行时栈 vs 构建时栈

这是前端与传统后端最不一样的心智点——同一份源码会在两个完全不同的环境被处理。

| 对比项 | 浏览器运行时栈 | Node + CI 构建时栈 |
| --- | --- | --- |
| 在哪里跑 | 每个用户的浏览器 | 开发者机器、CI Runner |
| 典型成员 | 框架、路由、状态、UI 库、通信、Web API | TypeScript、包管理器、Vite/webpack、Lint、测试、SSR/SSG |
| 关心什么 | 首屏体积、运行时性能、兼容、交互体验 | 构建速度、产物体积、可复现、质量门禁 |
| 用户是否感知 | 直接感知（下载并执行的就是它） | 不感知，只拿到它产出的静态文件 |
| 出错表现 | 白屏、卡顿、hydration mismatch | 构建失败、CI 红灯、产物异常 |

两者的**交界处是同构渲染**：VitePress 用同一批 Vue 组件，在构建时（Node）跑 server bundle 预渲染出 HTML，再在浏览器（用户）跑 client bundle 水合——这条"两阶段管线"是理解 [04 构建原理](./vitepress/04-build)的主线。

::: info
**一句话**：凡是"每个用户都要重复付出的成本"（渲染、高亮、建索引），尽量前移到构建时只做一次；凡是"必须因人而异/实时"的（登录态、交互、实时数据），才留在运行时。这正是本站选择 SSG 的根本原因。
:::

## 四、视图框架层：最重的一次技术选型

框架决定了组件模型、响应式机制与整个生态，是栈里迁移成本最高的决策，应先于具体库选择。

| 框架 | 模板/UI 写法 | 响应式与渲染机制 | 生态与适用 |
| --- | --- | --- | --- |
| Vue | SFC（template + script + style） | 基于 Proxy 的细粒度响应式 + 虚拟 DOM，编译期做静态优化 | 渐进式、中文社区强、文档/中后台广；本站底座 |
| React | JSX（一切皆 JS） | 不可变状态 + 重新渲染，运行时调度（Concurrent） | 生态最大、招聘面广、大型复杂应用 |
| Angular | 模板 + 依赖注入 | 框架大而全（路由/表单/CLI 内置），响应式用 RxJS | 强约束、企业级大团队、TypeScript 优先 |
| Svelte | `.svelte` 单文件 | 编译期把响应式编译成命令式 DOM 操作，**无运行时库** | 极小产物、低运行时开销、个人/中小型项目 |
| Solid | JSX | 细粒度信号（Signal），不做整体 VDOM diff | 追求极致运行时性能、信号范式 |

选型维度按权重通常是：**团队既有技术栈 > 长期维护与生态 > 招聘供给 > 运行时性能/体积**。文档/内容站这类"框架由 SSG 替你选好"的场景，跟着 VitePress（Vue）或 Docusaurus（React）走即可，不必单独纠结框架。

**元框架（Meta-framework）** 在视图框架之上再封装"路由 + 数据获取 + 多种渲染范式 + 部署约定"：Vue 生态的 Nuxt、React 生态的 Next.js、Svelte 生态的 SvelteKit，以及内容站取向的 Astro。VitePress 可以理解为"专注内容型 SSG 的轻量元框架"——它不做通用应用的那些能力（鉴权、服务端数据聚合），刻意收敛到文档场景。通用应用与内容站的边界见 [01 的 When/When not](./vitepress/01-ssg)。

## 五、构建与工程化层：为什么需要"构建"这一步

浏览器不能直接、也不应该直接消费我们写的工程化源码，构建环节负责把"对人友好的源码"变成"对浏览器与网络友好的产物"。

- **为什么需要构建**：模块化打包（成百上千模块合成少量文件）、TS/JSX/Vue 编译、样式与图片等资源处理、按目标浏览器降级语法、tree-shaking、压缩与代码分割、开发期热更新（HMR）。
- **打包工具演进**：webpack（插件生态最全、配置复杂）→ esbuild（用 Go 写、极速、主打转译）→ **Vite**（开发期基于浏览器原生 ESM 按需编译、生产用 Rollup，冷启动快）→ Rspack（用 Rust 写、兼容 webpack 生态）/Turbopack 等。主线是"用 Go/Rust 等系统语言重写性能瓶颈 + 开发期利用原生 ESM"。
- **包管理器**：npm/yarn/pnpm 都管依赖与锁文件；pnpm 用硬链接与严格的非扁平 `node_modules` 节省磁盘并避免幽灵依赖，monorepo 体验更好。
- **质量门禁**：ESLint 管代码正确性与风格、Prettier 管格式、`tsc` 管类型、单测/组件测/E2E 管行为，统一在 CI 上作为合入门禁。
- **Monorepo**：多个包放一个仓库共享依赖与工具链，配合 pnpm workspace、Nx、Turborepo 做任务编排与增量缓存；本仓库是单包项目，用不到这层。

本站的构建被 VitePress 完全封装：开发 `npm run docs:dev`、发布 `npm run docs:build`，产物在 `docs/.vitepress/dist`。配置如何透传给底层 Vite，见 [02](./vitepress/02-routing)；构建内部到底做了什么，见 [04](./vitepress/04-build)。

## 六、数据通信与服务端协作

前端很少孤立存在，需要明确"数据从哪来、怎么推、谁聚合"。

| 方式 | 形态 | 典型场景 |
| --- | --- | --- |
| HTTP + REST | 请求/响应、JSON | 绝大多数 CRUD 接口；用 Fetch 或 Axios 调用 |
| WebSocket | 全双工长连接 | 聊天、协作编辑、实时行情 |
| SSE | 服务端单向推送 | 通知、日志流、AI 流式输出 |
| GraphQL | 客户端按需取字段 | 多端、字段聚合复杂的中大型应用 |
| BFF / 网关 | 专为前端聚合的后端层 | 一个页面需要多个后端服务拼装、做鉴权与裁剪 |

协作约定上：接口契约用 OpenAPI/Swagger 对齐，跨域靠 CORS，鉴权常用 Cookie + 会话或 Token（JWT 等），前后端职责边界由 BFF 收敛。本站是纯静态内容站，没有这层实时数据；搜索这类看似"需要后端"的能力也用构建期索引 + 浏览器本地检索替代（见 [03](./vitepress/03-default-theme)），需要评论/表单时再接第三方 API 或 Serverless。

## 七、渲染范式与部署形态：决定首屏、SEO 与成本

把"页面 HTML 在什么时刻生成"与"部署在哪"对应起来，就串起了整个架构选型（深入对比见 [01](./vitepress/01-ssg) 与 [05](./vitepress/05-deploy)）：

| 渲染范式 | HTML 生成时刻 | 首屏/SEO | 服务器 | 部署形态 |
| --- | --- | --- | --- | --- |
| CSR（客户端渲染） | 浏览器执行 JS 后 | 白屏、SEO 弱 | 仅静态托管 | 纯 CDN |
| SSR（服务端渲染） | 每次请求实时渲染 | 快、好 | 需要 Node 长驻 | Node 服务 + 容器/PM2 |
| SSG（本站） | 构建发布时预渲染 | 极快、好 | 不需要 | **纯静态 CDN / GitHub Pages** |
| ISR（增量静态再生成） | 构建 + 按需再生成 | 快、好 | 需要少量服务端能力 | 支持 ISR 的托管平台 |
| MPA（传统多页） | 服务端套模板 | 取决于后端 | 需要应用服务器 | Nginx + 应用 + 数据库 |

选型本质是按"读写比与时效性"匹配：读多写少、发布才变的内容（文档/博客/手册）→ SSG；强登录态/千人千面 → SSR/CSR；秒级实时数据 → CSR + 实时通信。

## 八、前端知识在本站如何展开（目录规划）

本目录采用"**总览 + 专题知识树**"的组织方式：先有这张全景地图，再对图中的每一层/每个高频工具各沉淀一棵编号知识树。

| 全景中的层 | 对应知识树 | 状态 |
| --- | --- | --- |
| 总览（本篇） | 前端技术栈全景总览 | 已完成 |
| 渲染范式 + 构建工具 + 部署的内容站交叉点 | [VitePress 知识树 01–06](./vitepress/01-ssg) | 已完成 |
| 语言与标准（JS/TS/浏览器原理） | 规划中 | 待沉淀 |
| 视图框架（Vue 深入） | 规划中 | 待沉淀 |
| 工程化（Vite/TS/包管理/测试/Monorepo） | 规划中 | 待沉淀 |
| 性能、安全与跨端 | 规划中 | 待沉淀 |

"规划中"只表示后续可下钻的方向，不影响当前内容；每棵新树都会沿用与 VitePress 相同的结构：定位 → 配置/使用 → 原理 → 部署/工程 → 实战场景 → 分频面试题。

## 九、高频面试：建立全景时常问的 9 题

1. **[高频] 全景题：从输入 URL 到页面可交互，前端各层如何协作？** DNS/网络取到 HTML → 解析构建 DOM/CSSOM → 下载并执行 JS bundle（构建时已由 Vite/webpack 打包、TS/Vue 已编译）→ 框架创建组件、路由匹配、取数（Fetch/BFF）→ 渲染并绑定事件（CSR 水合/SSG 直接激活）→ 异步资源与懒加载补齐。能按"网络 → 浏览器渲染 → 运行时框架 → 数据"四段说清即可。
2. **[高频] 辨析题：CSR/SSR/SSG 的区别与选型？** 区别在 HTML 生成时刻：CSR 在浏览器、SSR 每请求在服务器、SSG 构建时预渲染成文件。读多写少、发布才变的内容站选 SSG（免服务器、首屏快、SEO 好）；强登录态选 SSR/CSR。详见 [01](./vitepress/01-ssg)。
3. **[高频] 原理题：为什么需要构建工具，Vite 为什么快？** 浏览器无法直接消费 TS/Vue/模块化与大量资源，构建负责编译、打包、tree-shaking、压缩与 HMR。Vite 开发期用浏览器原生 ESM 按需编译、用 esbuild 预构建依赖，冷启动不随项目变大变慢；生产用 Rollup 打包。详见 [01](./vitepress/01-ssg)/[04](./vitepress/04-build)。
4. **[高频] 辨析题：Vue 和 React 的核心差异？** Vue 用 SFC 模板 + Proxy 细粒度响应式，编译期做静态提升与补丁标记；React 用 JSX + 不可变状态驱动重渲染，靠运行时调度优化。写法、心智模型与生态不同，没有绝对优劣，按团队与场景选。
5. **[高频] 概念题：客户端路由 hash 和 history 模式区别？** hash 模式靠 `#` 后内容变化，不发请求、兼容性好但 URL 带 `#`；history 模式用 History API 得到干净 URL，但需要服务端/托管把未知路径回退到入口 HTML，否则刷新 404。VitePress 这类静态站用预生成的 HTML 文件直接承载每条路由。
6. **[高频] 原理题：状态管理解决什么问题，状态何时该提升？** 解决跨组件/跨页面共享与状态一致性，避免层层透传 props。状态优先局部化（谁用谁持有），当多个无亲缘关系组件需要同一份可变数据、或需要持久化/调试时再提升到 Pinia/Redux；服务端数据缓存优先用 TanStack Query 这类专门工具而非塞进全局 store。
7. **[中频] 工程题：Monorepo 和多仓库怎么选？** Monorepo 便于多包共享依赖、统一工具链与原子提交、配合 workspace 做增量构建，适合强相关的多个包/组件库；多仓库隔离强、独立发布权限清晰，适合边界稳定、团队独立的产品。不要为"看起来先进"而上 Monorepo。
8. **[高频] 性能题：Core Web Vitals 是哪三个，怎么分层优化？** LCP（最大内容绘制，看首屏主体）、INP（交互到下一次绘制，看响应）、CLS（累积布局偏移，看稳定）。分层：构建期减小体积/路由分包/图片优化，传输层用 CDN 与压缩，运行时减少长任务与渲染次数，必要时用 SSG/预渲染直接消除首屏等待。
9. **[中频] 安全题：XSS 和 CSRF 是什么、前端怎么防？** XSS 是注入恶意脚本在用户浏览器执行，防御靠转义输出、不用不安全的 `v-html`/`innerHTML` 插入不可信内容、CSP 限制脚本源；CSRF 是冒用已登录身份发起请求，防御靠 CSRF Token、SameSite Cookie、校验来源。静态内容站攻击面小，但一旦接入评论/表单等动态能力就要重新评估。
