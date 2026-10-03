# hxy-asdw.github.io

Aeneas 的 Personal Lab / Digital Garden，使用静态 HTML、CSS 和 JavaScript，发布到 GitHub Pages。

## 本地预览

在仓库根目录运行：

```sh
python3 -m http.server 8000
```

打开 `http://localhost:8000/`。首页需要通过 HTTP 预览，子页面和游戏入口也由同一个服务提供。

## 首页维护

- `index.html`：首页结构、导航与分享信息。
- `home.css` / `home.js`：连续粒子场景、可拖动实验节点、详情侧栏和目录预览。
- `home-intro.css` / `home-intro.js`：保留的多语言开场；开场结束后进入首页或 URL 指定的详情。
- `content.js`：首页与 Lab / Garden 共用的内容数据。只有 `repoPublic: true` 的项目会显示仓库链接。
- `styles.css` / `script.js`：保留给现有内容索引和文章页面。

项目详情使用 URL hash，支持直接访问、浏览器返回和前进；关闭后恢复原来的滚动位置。保留 `#lab`、`#garden`、`#now`、`#side-quests` 和 `#about` 入口。手机纵向滑动用于浏览页面；开启“减少动态效果”时直接显示实验节点。

## 发布

GitHub Actions 通过 `.github/workflows/deploy.yml` 的文件清单构建站点。新增公开资源时，也需要加入这个清单。`design-preview/` 存放设计原型、效果截图和验证记录，不进入发布产物。
