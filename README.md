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

首页侧边栏的“网站信息”会自动统计已发布文章数量、正文总字数（中文按字、英文按词，不含代码块），最后更新时间取最近一次 Git 提交时间。所有主题页面统一使用 `themes/grove/_config.yml` 中的 `home_cover` 背景设置。

访客数（UV）和总浏览量（PV）使用[不蒜子](https://ibruce.info/2015/04/04/busuanzi/)统计，正式网站的首页、文章、归档、关于和标签页面都会计数，本地预览不计数。统计从接入后累计，不能还原此前的访问记录；服务不可用时显示“—”，悬停可查看提示。


## 切换动态／静态背景

编辑 `themes/grove/_config.yml` 中这一段：

```yaml
home_cover:
  type: video                     # video：动态视频；image：静态图片
  image: /images/home-cover.jpg    # 静态背景，也是视频无法播放时的备用图
  video: /videos/home-cover.mp4    # MP4 动态背景
  title: Rhiannon Grove
  subtitle: 在字里行间，慢慢生长。
```

- 切回静态：只把 `type: video` 改为 `type: image`，无需删除视频路径。
- 更换图片：上传图片至 `source/images/`，将 `image` 改为对应的网站路径，例如 `/images/new-background.jpg`。
- 更换视频：上传 MP4 至 `source/videos/`，将 `video` 改为对应的网站路径，例如 `/videos/new-background.mp4`。建议使用压缩后的 H.264 MP4。
- 图片和视频均可填写完整的 `https://` 地址。这里填写网站路径，不能使用桌面文件的 `C:\...` 路径。
- 修改并提交到 `main` 后会自动发布；首页、文章、归档、标签和关于页一起切换。

视频全屏铺满、静音循环播放，切到其他浏览器标签时暂停；无法加载或自动播放时显示备用图片。访客系统开启“减少动态效果”时使用静态图片且不加载视频。静态模式也不会下载视频。

## 三套视觉主题与外观设置

页面左下角的“外观”入口提供三套主题：Original（保留原有玻璃主题）、Morandi Light（莫兰迪浅色）和 Wangxiang Dark（万象深色）。首次访问仍使用 Original，不根据系统深浅色自动切换。主题切换不刷新页面，正文、导航和侧边栏的布局保持一致。

同一面板可以独立选择“动态视频”或“静态图片”。主题与背景偏好分别保存在访客当前浏览器的 localStorage 中，刷新、页面跳转、重新访问和同源多标签页会保持同步。浏览器不允许存储时仍可切换，但会提示偏好无法保存。

`home_cover.type`、`home_cover.image` 和 `home_cover.video` 仍是站点默认模式与资源路径的配置入口。首次访问使用配置中的背景模式；访客自行选择后以该浏览器的选择为准。视频路径留空时动态选项不可用，自动使用图片。减少动态效果、视频加载失败和自动播放受限时保留图片回退。

外观面板支持 Tab、方向键、空格和 Escape；选中项有明确标记。独立生日页也会沿用所选配色，同时保留自身的布局、背景结构、祝福与动画交互。

实现入口：

- `themes/grove/source/css/style.css`：原有样式，保留不动。
- `themes/grove/source/css/visual-themes.css`：两套新增主题的语义变量、组件配色和设置面板。文字、表面、边界、焦点、状态色、阴影和代码高亮均通过变量统一管理。
- `themes/grove/source/js/theme-preload.js`：样式加载前读取并验证偏好，防止错误主题闪烁。
- `themes/grove/source/js/theme-switcher.js`：切换控件、键盘与焦点处理、偏好保存及跨标签同步。
- `themes/grove/source/js/background.js`：视频播放、静态切换、减少动态效果及图片回退。
- `themes/grove/layout/layout.ejs` 与 `source/birthday/index.html`：公共资源接入。
