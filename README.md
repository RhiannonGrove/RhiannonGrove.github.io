# Rhiannon Grove 博客

这是用 Hexo 创建的博客源码。当前配置的网站地址为 <https://rhiannongrove.github.io>。

## 在 Windows 上预览

在本文件所在目录打开 PowerShell，运行：

```powershell
npm.cmd install
npm.cmd run server
```

浏览器打开 <http://localhost:4000>。按 `Ctrl+C` 停止预览。

## 写文章

运行 `npx.cmd hexo new "文章标题"`，然后编辑 `source/_posts/` 中生成的 Markdown 文件。`source/about/index.md` 是“关于”页面。

## 发布到 GitHub Pages

1. 在 GitHub 新建**空仓库** `RhiannonGrove.github.io`，不要勾选 README。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
3. 在本目录的 PowerShell 中运行：

   ```powershell
   git init -b main
   git add .
   git commit -m "Create blog"
   git remote add origin https://github.com/RhiannonGrove/RhiannonGrove.github.io.git
   git push -u origin main
   ```

4. 打开 GitHub 仓库的 **Actions** 页面，等 `Publish blog` 成功。之后访问 <https://rhiannongrove.github.io>。

以后修改文章后，运行 `git add .`、`git commit -m "Update blog"`、`git push` 即可自动更新网站。

> GitHub 用户名如果改变，请同时修改 `_config.yml` 中的 `url`、仓库名和 Git 远程地址。

博客使用自定义的 `themes/grove/` 主题。修改首页文字和导航可编辑 `themes/grove/layout/`，修改颜色和排版可编辑 `themes/grove/source/css/style.css`。
