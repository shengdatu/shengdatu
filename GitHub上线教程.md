# 把网站免费传到 GitHub 上线 · 保姆级教程

全程免费，不用买服务器，不用备案（`github.io` 域名）。
**推荐用「网页上传」方式**，全程点鼠标，不用装任何软件。

---

## 准备工作：先改好你的信息

上传之前，建议先做这两件事（上传后也能改，但一次搞定更省事）：

1. 打开 `assets/js/config.js`，改成你真实的 WhatsApp 号和邮箱
2. 把产品照片命名成 `no1.jpg`…`no8.jpg`，放进 `assets/images/products/`

---

# 方式一：网页上传（推荐新手，10 分钟完成）

## 第 1 步：注册 GitHub 账号

1. 打开 https://github.com/signup
2. 依次填写：邮箱 → 设置密码 → 起一个用户名（**这个用户名会出现在你的网址里，建议用英文品牌名**，例如 `pawnest`）
3. 完成邮箱验证码验证，注册完成

> 记住你的用户名，下面用 `你的用户名` 代指。

## 第 2 步：新建一个仓库（Repository）

1. 登录后，点右上角 **`+`** → 选择 **New repository**
2. 按下面填写：

| 项目 | 填什么 |
|---|---|
| Repository name | `pawnest-wholesale`（可自定义，用英文小写+横线） |
| Description | 随便写，例如 `Cat tree wholesale website` |
| 公开性 | 必须选 **Public**（公开）⚠️ 选 Private 无法免费上线 |
| Add a README file | **不要勾** |

3. 点绿色按钮 **Create repository**

## 第 3 步：上传网站文件

1. 新建好的页面上，找到 **uploading an existing file** 这个蓝色链接，点它
   （如果没看到，就点仓库页面的 **Add file** → **Upload files**）

2. **重要 · 解压后再传**：
   先把我给你的 `pawnest-wholesale.zip` **解压**，
   然后打开解压出来的 `pawnest-wholesale` 文件夹，
   **全选里面的所有文件和文件夹**（`index.html`、`products.html`、`about.html`、
   `contact.html`、`terms.html`、`assets` 文件夹等），
   拖拽到网页的上传区域。

   > ❌ 常见错误：直接上传 zip 压缩包 —— 网站会打不开
   > ❌ 常见错误：上传了外层的 `pawnest-wholesale` 文件夹 —— 网址会多一层，
   >    虽然也能访问，但建议按上面说的传"文件夹里的内容"

3. 等文件上传完（下方会列出所有文件名），在 **Commit changes** 下的输入框随便写点字，
   例如 `upload website`

4. 点绿色按钮 **Commit changes**

## 第 4 步：开启 GitHub Pages（让网站上线）

1. 在仓库页面顶部，点 **Settings**（齿轮图标，最右边）
2. 左侧菜单往下找，点 **Pages**
3. 在 **Build and deployment** 下面：
   - **Source**：选 **Deploy from a branch**
   - **Branch**：左边下拉框选 **main**，右边保持 **/ (root)**
   - 点 **Save**
4. 页面会刷新，等 **1-3 分钟**，然后刷新这个页面

## 第 5 步：拿到你的网址

刷新后页面顶部会出现一个绿色框：

> ✅ Your site is live at `https://你的用户名.github.io/pawnest-wholesale/`

点那个链接就能打开你的网站了！把这个网址发给客户即可。

> 如果显示 404，别慌 —— 再等 2 分钟刷新一次。首次部署有延迟。

---

# 方式二：用 Git 命令行（会用命令行的话更快）

```bash
# 1. 进入网站文件夹
cd pawnest-wholesale

# 2. 初始化并提交
git init
git add .
git commit -m "upload website"
git branch -M main

# 3. 关联你的仓库（把 你的用户名 和 仓库名 换成实际的）
git remote add origin https://github.com/你的用户名/pawnest-wholesale.git

# 4. 推送
git push -u origin main
```

推送完成后，同样按上面 **第 4 步** 去 Settings → Pages 开启即可。

> 提示：现在 GitHub 推送不能用账号密码，需要用 **Personal Access Token**。
> 生成路径：右上头像 → Settings → Developer settings →
> Personal access tokens → Tokens (classic) → Generate new token，
> 勾选 `repo` 权限，生成后复制那串字符，推送时当密码粘贴进去。

---

# 以后想改内容怎么办？

## 改文字或价格
1. 在 GitHub 仓库里点开要改的文件（例如 `assets/js/products.js`）
2. 点右上角 **铅笔图标** ✏️ (Edit this file)
3. 直接在网页上改，改完拉到最下面点 **Commit changes**
4. 等 1-2 分钟，网站自动更新

## 换产品图片
1. 进入仓库的 `assets/images/products/` 文件夹
2. 点 **Add file** → **Upload files**，把 `no1.jpg` 等图片拖进去
3. 点 **Commit changes**，等 1-2 分钟生效

---

# 进阶：绑定自己的域名（可选）

买了域名（例如 `pawnest.com`）后：

1. 在域名商后台加 DNS 解析记录：
   - 4 条 **A 记录**，主机记录填 `@`，指向这 4 个 IP：
     `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`
   - 1 条 **CNAME 记录**，主机记录填 `www`，指向 `你的用户名.github.io`
2. 回到 GitHub 仓库 → Settings → Pages → **Custom domain** 填入 `pawnest.com`，点 Save
3. 等 DNS 生效（几分钟到几小时），然后勾上 **Enforce HTTPS**

---

# 常见问题

**Q：打开网址是 404 页面？**
A：① 确认仓库是 Public；② 确认 `index.html` 在仓库**根目录**（点进仓库首页就能看到它，不是藏在某个文件夹里）；③ 再等 2-3 分钟。

**Q：网页打开了但样式全乱、没有颜色？**
A：说明 `assets` 文件夹没传上去，或者传成了嵌套结构。检查仓库里是否有 `assets` 文件夹，点进去应该能看到 `css`、`js`、`images` 三个子文件夹。

**Q：产品图显示的是示意图，不是我的照片？**
A：图片没放对位置或名字不对。必须是 `assets/images/products/no1.jpg` 这样的路径，文件名全小写。

**Q：点 WhatsApp 按钮没反应 / 打开是错误号码？**
A：去 `assets/js/config.js` 改 `whatsapp` 那一行，必须是「国码+号码」纯数字，不要 `+`、空格、横线。

**Q：客户提交询盘，我在哪里看？**
A：默认模式下，客户点提交会打开他自己的邮箱客户端把询盘发到你邮箱。想让询盘自动进你邮箱（体验更好），照 `使用说明-先看我.md` 第六节配置 Formspree，5 分钟搞定。

**Q：GitHub Pages 免费吗？有流量限制吗？**
A：完全免费。软限制为每月 100GB 流量、仓库 1GB 以内，做外贸展示站远远够用。
