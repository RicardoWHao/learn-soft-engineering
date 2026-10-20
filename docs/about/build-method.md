# 本站构建方法

本文讲清楚这个网站从"写下一个 Markdown 文件"到"用户在公网打开页面"之间发生的全部事情：数据源是什么、页面如何渲染、有没有后端、代码写在哪里、为什么 `git push` 之后网站会自动更新。

## 一、核心结论：这是一个"没有后端服务器"的网站

本站属于 **JAMStack / 静态站点（SSG，Static Site Generation）** 架构，由四部分组成：

| 角色 | 用的东西 | 说明 |
|------|---------|------|------|
| 数据源 | GitHub 仓库里的 `docs/**/*.md` | Markdown 文件就是全部内容，**没有数据库** |
| 构建器 | VitePress（Node.js 工具） | 在"构建时"把 Markdown 编译成静态 HTML/CSS/JS |
| CI 流水线 | GitHub Actions | 监听到 push 后，自动执行构建并发布 |
| 托管/服务器 | GitHub Pages | 全球 CDN，只负责把静态文件发给浏览器 |

与传统网站的区别：

| | 传统动态网站（如 Java/PHP 网站） | 本站（静态站点） |
|---|---|---|
| 页面何时生成 | 用户每次请求时，服务器实时查库、套模板渲染 | **推送代码时预先构建好**，请求时直接取文件 |
| 后端服务器 | 需要 7×24 运行的应用服务器 | 不需要 |
| 数据库 | 需要（MySQL 等） | 不需要，Git 仓库承担版本化存储 |
| 访问速度 | 受服务器计算与数据库影响 | 文件走 CDN，极快 |
| 运维成本 | 买服务器、部署、运维、安全补丁 | 零，GitHub 全托管且免费 |

## 二、整体架构总览

```
  ┌──────────┐   ① HTTPS 请求                ┌─────────────────────────┐
  │  用户浏览器 │ ───────────────────────────> │   GitHub Pages（CDN）    │
  │          │ <─────────────────────────── │   只存静态文件            │
  └──────────┘   ② 返回 HTML/CSS/JS          │   HTML / JS / CSS / 图片  │
                                          └─────────────────────────┘
                                                     ↑ ④ 部署构建产物
                                          ┌─────────────────────────┐
                                          │    GitHub Actions（CI）  │
                                          │  npm ci → vitepress build│
                                          └─────────────────────────┘
                                                     ↑ ③ push 触发
                                          ┌─────────────────────────┐
                                          │  GitHub 仓库（数据源）    │
                                          │  learn-soft-engineering  │
                                          │  docs/**/*.md（你写的）   │
                                          └─────────────────────────┘
```

数据流是**单向**的：`Markdown 源码 → 构建 → 静态产物 → CDN → 浏览器`。浏览器永远不会直接读取你的 GitHub 源码或 Markdown，它拿到的只是构建产物的一个"快照"。

## 三、数据源：GitHub 仓库即数据库

- **唯一事实来源（Single Source of Truth）**是仓库 [RicardoWHao/learn-soft-engineering](https://github.com/RicardoWHao/learn-soft-engineering) 中 `docs/` 目录下的 Markdown 文件。
- 改内容 = 改文件；发版 = 提交（commit）；历史版本 = Git 提交历史。Git 天然替代了数据库的"增删改查 + 版本回溯"能力。
- 站点结构（顶部导航、侧边栏、标题、搜索开关）不是写死在代码里的，而是声明在配置文件 `docs/.vitepress/config.mts` 中。
- 内容与展示分离：你只管写 Markdown，页面框架、主题、响应式、深浅色模式都由 VitePress 统一负责。

## 四、一次页面访问的完整链路

以访问 `https://ricardowhao.github.io/learn-soft-engineering/middleware/web/tomcat` 为例：

1. **DNS 解析**：域名 `ricardowhao.github.io` 解析到 GitHub Pages 的边缘节点（CDN）。
2. **请求静态文件**：CDN 根据 URL 找到预先构建好的 `tomcat.html`，直接返回给浏览器，**全程没有任何应用服务器做计算**。
3. **加载资源**：浏览器解析 HTML，继续下载其中引用的 CSS 和 JS（路径都带 `/learn-soft-engineering/` 前缀，由 `base` 配置决定）。
4. **水合（Hydration）**：JS 执行，把静态 HTML"激活"为可交互的 Vue 应用——此时搜索框、深浅色切换、侧边栏展开才开始工作。
5. **站内跳转**：之后点击其他菜单，页面不再整刷，而是由前端路由（SPA 模式）直接拉取对应页面片段切换，体验接近 App。

**URL 与源文件的映射关系**（构建时一一对应生成）：

| 你写的源文件 | 构建产物 | 公网访问 URL |
|---|---|---|
| `docs/index.md` | `index.html` | `/learn-soft-engineering/` |
| `docs/middleware/web/tomcat.md` | `middleware/web/tomcat.html` | `/learn-soft-engineering/middleware/web/tomcat` |
| `docs/about/build-method.md` | `about/build-method.html` | `/learn-soft-engineering/about/build-method` |

## 五、页面是如何渲染的：构建时渲染（SSG）

关键在于区分"构建时"和"运行时"：

```
构建时（GitHub Actions 上执行一次）
  Markdown(.md)
    → 解析为带 frontmatter 的组件
    → 每个 .md 编译成一个 Vue 单文件组件
    → Vite 打包、压缩
    → 用 Vue 的服务端渲染能力把每个页面"预渲染"成完整 HTML
    → 输出到 docs/.vitepress/dist/（纯静态文件）

运行时（每个访客浏览器里）
  下载预渲染 HTML（首屏秒开、对搜索引擎友好）
    → 加载同一份 JS
    → Hydration 水合，接管交互
    → 后续跳转走客户端路由
```

这种"先在构建期把页面算好"的方式带来三个直接好处：

- **首屏快**：HTML 里已经有完整内容，不需要等 JS 跑完再请求数据。
- **SEO 友好**：搜索引擎爬虫抓到的就是完整 HTML，而非空白壳。
- **可托管在任意静态服务**：因为产物就是文件，Nginx、对象存储、CDN 都能挂。

### 站内搜索为什么也不需要后端？

配置里的 `search: { provider: 'local' }` 会让 VitePress **在构建时扫描全部 Markdown，生成一份压缩的本地搜索索引（JSON）**。用户搜索时，浏览器内的 MiniSearch 引擎直接在这份索引里匹配，请求不出本机，因此没有搜索服务器。

## 六、前端代码写在哪里

```
knowledge-site/
├── package.json              # 依赖与脚本（dev/build/preview 命令）
├── package-lock.json         # 依赖版本锁定，保证 CI 与本地一致
├── .github/workflows/
│   └── deploy.yml            # CI/CD 流水线定义（自动发布的"开关"）
└── docs/                     # ★ 你日常只需要关心这个目录
    ├── index.md              # 首页（hero 布局写在 frontmatter 里）
    ├── .vitepress/
    │   └── config.mts        # ★ 站点配置：导航栏、侧边栏、搜索、base 路径
    ├── about/
    │   ├── index.md          # 关于本站
    │   └── build-method.md   # 本页
    ├── basics/  framework/  middleware/  database/ ……  # 各知识分区
    └── **/*.md               # 每一个 md 就是一个页面
```

新增一个页面只需两步：

1. 在 `docs/` 下对应目录新建 `xxx.md` 并写内容；
2. 在 `config.mts` 的 `nav`（顶部菜单）和 `sidebar`（左侧栏）登记它的链接和标题。

页面正文就是普通 Markdown，也可以在其中直接写 Vue 组件和 HTML（VitePress 的扩展能力），但本站目前只使用纯 Markdown。

## 七、"前端"和"后端"分别部署在哪

### 前端：GitHub Pages

- 本质是一个**静态文件存储 + 全球 CDN**。构建产物 `dist/` 被上传后，GitHub 把它分发到边缘节点。
- 它只能托管静态文件，不能运行 Java/Node/PHP 这类服务端代码——但本站在运行时根本不需要这些。

### 后端：不存在

本站没有应用服务器，也没有数据库。传统网站里依赖后端的交互，在这里都被"构建期预处理"或"第三方 SaaS"替代：

| 传统上需要后端的功能 | 本站的替代方案 |
|---|---|
| 内容存储与查询 | 构建期把 Markdown 固化进 HTML |
| 全文搜索 | 构建期生成索引，浏览器本地检索 |
| 评论（暂未开启） | 可接入 Giscus，数据存放在 GitHub Discussions |
| 访问统计（暂未开启） | 可接入不蒜子 / Google Analytics 等第三方脚本 |

如果未来确实需要真正的动态接口（例如用户登录、写数据库），才需要额外引入 Serverless 函数或独立后端——对于知识库类站点通常永远用不到。

## 八、为什么 push Markdown 后会自动发布

秘密在 [.github/workflows/deploy.yml](https://github.com/RicardoWHao/learn-soft-engineering/blob/main/.github/workflows/deploy.yml)。它声明了"当 `main` 分支收到 push 时，自动在 GitHub 提供的一台临时虚拟机上执行以下流水线"：

```
你 git push main
   │
   ▼
① actions/checkout        拉取仓库最新代码
② actions/setup-node      安装 Node.js 20，并缓存 npm 依赖
③ npm ci                  严格按 package-lock.json 安装依赖（可复现）
④ npm run docs:build      ★ VitePress 构建，产出 docs/.vitepress/dist
⑤ configure-pages         读取 Pages 配置、准备部署环境
⑥ upload-pages-artifact   把 dist/ 打包为部署产物
⑦ deploy-pages            将产物发布到 GitHub Pages（CDN 全局生效）
   │
   ▼
约 30~60 秒后，公网刷新即可看到新内容
```

几个工程要点：

- **触发条件**：`on.push.branches: [main]`，所以只有合入 `main` 才会发版；推其他分支只更新代码、不动线上。
- **权限模型**：`permissions: pages: write, id-token: write` 使用仓库自带的临时 `GITHUB_TOKEN`，**不需要在任何地方配置密码或密钥**。
- **原子发布**：先在 `build` 作业里完整构建并上传产物，`deploy` 作业依赖（`needs: build`）它成功后才发布，避免线上出现"半成品"。
- **并发控制**：`concurrency: pages` 保证连续多次 push 时部署不会互相踩踏。
- **一次性环境**：运行流水线的虚拟机是 GitHub 临时分配的，用完即销毁，因此它不是"你的服务器"，也无需维护。

## 九、本地开发与日常发布命令

```bash
cd knowledge-site

npm run docs:dev      # 本地起开发服务器（http://localhost:5173），改 md 实时热更新
npm run docs:build    # 本地构建，验证能否编译、链接是否有效
npm run docs:preview  # 在本地预览构建产物（与线上环境一致）

# 写好内容后发布：
git add .
git commit -m "docs: 更新说明"
git push              # 推送到 main → Actions 自动构建 → Pages 自动上线
```

## 十、常见疑问

**Q：为什么配置里要有 `base: '/learn-soft-engineering/'`？**
因为站点部署在"项目页"子路径 `用户名.github.io/仓库名/` 下，而不是域名根目录。`base` 会给所有静态资源 URL 加上这个前缀；若将来绑定自定义独立域名，则需要把它改回 `'/'`。

**Q：推上去的 Markdown，访客能看到源码吗？**
仓库是公开的，访客可以在 GitHub 看到 `.md` 源文件；但网站本身只对外提供构建后的 HTML。不想公开源码可以把仓库设为 Private 并改用 Vercel / Netlify 等平台部署。

**Q：需要域名备案吗？**
不需要。GitHub Pages 的服务器在海外，使用 `*.github.io` 免费二级域名即可访问；只有使用国内云厂商托管并绑定自己的域名时才涉及备案。

**Q：想换成自己的域名怎么做？**
购买域名 → 在仓库 Settings → Pages 的 Custom domain 中绑定并配置 DNS → 把 `base` 改回 `'/'` 后重新推送，其余自动发布链路不变。
