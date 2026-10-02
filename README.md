# AI 商科案例推演平台

独立源码版，不包含生产数据与密钥。React/Ant Design → 同源 FastAPI → SQLite；`ai_component` 负责 AI 工作流，`contracts` 保存数据契约。

## 安装与启动

安装 Python **3.13**、Node.js **24**（含 npm）并加入 PATH。Windows 双击 `start-local.bat`，或执行 `python scripts/bootstrap.py local`。

统一启动程序会创建 `.venv`、安装依赖、构建页面、建表、迁移、初始化演示案例，再启动 http://127.0.0.1:8110 。教师入口 `/teacher/login`，学生入口 `/student`。首次安装需要网络；没有打包 node_modules 或 dist。

首次生成 `backend/.env`，开发教师口令 `local-dev-only`，请修改。数据保存在 `backend/data/app.db`，重复启动不清空。需在`backend/.env`中配置自己的 `LLM_BASE_URL`、`LLM_API_KEY`、`LLM_MODEL`；没有密钥不能生成真实 AI 结果。模型可以是外部服务或兼容的本地服务。

仅安装构建：`python scripts/bootstrap.py setup`。强制重建：加 `--rebuild`。程序根据前端源码哈希识别变动，避免修改源码后继续显示旧页面。锁文件改为官方 npm 源，保留版本与 integrity；不会修改全局 npm 设置或降低安全限制。

## 可选公网测试（Windows）

先运行 `start-public.bat --local-only` 测试本机 8200 的五个隔离空间。实际公网请从 Cloudflare 官方发布页
https://github.com/cloudflare/cloudflared/releases
获取并校验 cloudflared，放到 `tools/cloudflared.exe`，再运行 `start-public.bat`。Quick Tunnel 不需要命名隧道令牌。

cloudflared生成的公网链接在 `private/public-test/links.json`，密钥在同目录 `access-keys.json`；只分享给授权测试者。各空间数据库独立且初始为空。Ctrl+C 退出。禁止直接公开默认口令的 8110 端口。本次整理不自动发布公网服务。

## 开发与测试

激活专用虚拟环境后：

```sh
python -m pip install -r backend/requirements-dev.txt
python -m pytest backend/tests ai_component/tests -q
cd frontend
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run build
```

测试勿使用生产 DATABASE_URL。GitHub Actions 使用 Python 3.13、Node 24 执行构建和测试。Python 直接依赖固定版本，传递依赖仍由安装器解析，不是完全离线依赖包。

## 必需资料与开发模式

`docs` 只需保留 `商科规则.json`、`标杆案例.json`。两者在启动时读取，不能删除或改名；不需要内部文档生成工具。缺失时请从同版本源码恢复。

一键启动使用后端 8110 端口直接提供编译页面，不经过 Vite 开发代理。单独运行 `npm run dev` 时，页面默认使用 5174，API 和媒体请求默认转发到后端 8110。若已有 `frontend/.env` 或 `.env.local` 写着旧端口，请手动更新 `VITE_BACKEND_PORT` 并重启开发服务器；不会自动覆盖个人配置。

Git 不保存空目录。公网测试前，在启动脚本同级创建 `tools`，将已核验来源的 `cloudflared.exe` 放入；该工具不随源码提交。

详细步骤及报错处理见 [使用与排错](USAGE.md)。
