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

