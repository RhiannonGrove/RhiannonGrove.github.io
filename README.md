# Rhiannon Grove 博客

这是用 Hexo 创建的博客源码。网站地址：<https://rhiannongrove.github.io>。

## 在 Windows 上预览

第一次在电脑上编辑时，打开 PowerShell，运行：

```powershell
cd "$env:USERPROFILE\Documents"
git clone https://github.com/RhiannonGrove/RhiannonGrove.github.io.git
cd RhiannonGrove.github.io
npm.cmd install
npm.cmd run server
```

浏览器打开 <http://localhost:4000>。按 `Ctrl+C` 停止预览。以后只需进入已克隆的目录，运行 `npm.cmd run server`。

往后在电脑上编辑时，打开powershell，运行：

```powershell
cd "$env:USERPROFILE\Documents\RhiannonGrove.github.io"
npm.cmd run server
```

即可开启预览。

## 写文章

运行 `npx.cmd hexo new "文章标题"`，然后编辑 `source/_posts/` 中生成的 Markdown 文件。`source/about/index.md` 是“关于”页面。

## 发布更新

博客源码已经在 [GitHub 仓库](https://github.com/RhiannonGrove/RhiannonGrove.github.io)。请确认仓库 **Settings → Pages → Build and deployment → Source** 已选择 **GitHub Actions**。

修改文章后，在博客目录运行：

```powershell
git add .
git commit -m "Update blog"
git push
```

打开仓库的 **Actions** 页面，等 `Publish blog` 成功，网站就会自动更新。

> GitHub 用户名如果改变，请同时修改 `_config.yml` 中的 `url`、仓库名和 Git 远程地址。

博客使用自定义的 `themes/grove/` 主题。修改首页文字和导航可编辑 `themes/grove/layout/`，修改颜色和排版可编辑 `themes/grove/source/css/style.css`。

首页侧边栏的“网站信息”会自动统计已发布文章数量、正文总字数（中文按字、英文按词，不含代码块），最后更新时间取最近一次 Git 提交时间。所有主题页面统一使用 `themes/grove/_config.yml` 中的 `home_cover.image` 作为背景。

访客数（UV）和总浏览量（PV）使用[不蒜子](https://ibruce.info/2015/04/04/busuanzi/)统计，正式网站的首页、文章、归档、关于和标签页面都会计数，本地预览不计数。统计从接入后累计，不能还原此前的访问记录；服务不可用时显示“—”，悬停可查看提示。

