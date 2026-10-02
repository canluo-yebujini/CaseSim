# 使用与排错

## 选择运行方式

请在项目根目录操作。先安装 Python 3.13、Node.js 24（含 npm），确保命令行可找到它们。首次安装需要网络。

- 本地体验：运行 `start-local.bat`，访问 `http://127.0.0.1:8110/teacher/login` 或 `/student`。窗口需保持打开，Ctrl+C 退出。
- 前端开发：先启动本地后端，再在另一个终端进入 `frontend`，执行 `npm run dev`；访问终端显示的地址（默认 5174）。`/api`、`/media` 转发至 8110。
- 隔离空间测试：运行 `start-public.bat --local-only`，默认网关 8200，各空间数据库独立。
- 临时公网：将经核验的 Cloudflare 工具放入根目录 `tools/cloudflared.exe`，运行 `start-public.bat`。链接和密钥分别位于 `private/public-test/links.json` 与 `access-keys.json`，只向授权人员分享。

第一次启动自动创建 `backend/.env`。修改教师口令 `TEACHER_PASSWORD`；真实 AI 需自行填写模型地址、名称和密钥。不要公开默认口令的服务，不要上传 `.env`、数据库、日志或访问密钥。

## 端口及更新

后端默认 8110，前端开发默认 5174，公网测试网关默认 8200，三者用途不同。自定义后端端口时，同步修改 `backend/.env` 的 `APP_PORT` 和 `frontend/.env` 的 `VITE_BACKEND_PORT`，然后重启两个服务。

已有 `.env.local`、模式配置或环境变量也可能覆盖端口。不要把端口错误当作账号或业务故障。

源码更新后重新运行启动脚本；需强制重建可加 `--rebuild`。不要通过删除数据库解决页面缓存或依赖错误。操作业务数据前自行备份。

## 常见报错

| 现象 | 检查与处理 |
|---|---|
| Python/Node/npm 找不到 | 检查 PATH 和版本，安装后重新打开终端。Python 应为 3.13，Node 为 24。 |
| EALLOWREMOTE | 检查是否使用本仓库官方源锁文件、组织 npm 策略；联系管理员批准软件源，不关闭安全限制。 |
| EPERM / 文件占用 | 关闭本项目开发服务、编辑器相关任务后重试；不要结束不相关进程，不盲目递归删除目录。 |
| EADDRINUSE / address already in use | 端口被占用。确认占用者，关闭自己此前启动的服务，或同步调整后端和代理端口。 |
| 页面能开，API ECONNREFUSED / 502 | 检查后端窗口是否启动成功；访问 `http://127.0.0.1:8110/api/health`。检查开发代理及个人 env 是否仍为 8100。 |
| 教师登录失败 | 核对当前项目 `backend/.env` 的口令；修改后重启。勿混用公网空间口令和本地口令。 |
| JSON 文件缺失 | 从同版本源码恢复 `docs/商科规则.json` 和 `docs/标杆案例.json`，不能删改路径。 |
| cloudflared 缺失 | 新建 `tools`，放入正确命名的 exe；仅本机测试可用 `--local-only`。 |
| 公网链接打不开 | 检查启动窗口、`private/public-test/tunnel.log`、links.json 状态；临时地址可能随重启变化。 |
| AI 失败/超时 | 核对模型配置、额度、网络及任务错误。确定性推演不意味着 AI 可断网运行；不要提供虚构密钥。 |

## 报错反馈

提交问题时附：操作步骤、预期/实际结果、发生时间、Python/Node 版本、启动方式和脱敏错误信息。说明是本地 8110、开发 5174 还是公网空间。

本地日志通常位于 `logs`；公网空间日志位于 `private/public-test/spaces`。先去除 API 密钥、token、口令、学生资料及案例敏感内容，只提供相关片段。不要直接上传整个日志/数据库文件夹。

开发验证：前端 `npm test`、`npm run build`；后端在独立测试环境运行 `python -m pytest backend/tests ai_component/tests -q`，不得连接生产数据库。
