# VirtuUI

一个以 React + TypeScript 构建的通用 UI 组件库。包含可独立发布的 pnpm Workspace 子包、统一的 Design Token、交互式文档、Storybook、Jest、基于 MCP 的研发规范服务，以及真实的 ESM / UMD 构建产物。

## 快速开始

环境：Node.js **22.12+**、pnpm **10**。建议 Node.js 22 LTS。

```bash
pnpm install
pnpm dev
```

打开 http://localhost:5173。`dev` 首先构建依赖，再启动包监听与文档开发服务。文档站支持搜索、分类过滤、组件 API、代码复制、浅色/深色主题、Design Token 和 MCP 配置说明。

```bash
pnpm storybook           # http://localhost:6006，首次使用前执行 pnpm build
pnpm build               # 全量生产构建（含文档站）
pnpm check               # 构建、ESLint、类型检查、Jest、产物与 MCP 集成检查
pnpm test:coverage       # 覆盖率报告
pnpm build:storybook     # Storybook 静态文档
pnpm test:e2e            # 桌面/移动布局、真实浏览器交互和 axe 检查
```

浏览器测试默认使用 Playwright Chromium（首次执行 `pnpm exec playwright install chromium`）。本机已装 Chrome 时可运行 `PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e`。测试会自行启动预览服务。

## 工作区

```text
apps/docs/                Vite 展示站、Storybook stories
packages/react/           Button、Input、Select、Switch、Tabs、Menu、Badge、Card
packages/hooks/           受控状态、roving focus、外部点击
packages/tokens/          Token 单一数据源、浅色/深色主题、生成 CSS
packages/governance/      结构化组件目录、编码规范、TypeScript AST 检查
packages/mcp/             MCP stdio 服务
scripts/                  开发编排、产物与 MCP 协议验证
tests/                    浏览器与无障碍回归
.changeset/               独立版本发布配置
.github/workflows/        CI 验证及静态文档归档
```

依赖方向：`react → hooks/tokens`，`governance → tokens`，`mcp → governance/tokens`，`docs → react/tokens/governance/catalog`。ESLint 限制底层模块反向导入。文档站仅引入轻量 catalog 子路径，不打包 TypeScript 编译器或 Node MCP 服务。

## 使用组件

子包当前在本地 Workspace 中可用，**尚未发布 npm**。发布前请确认 `@virtuui` scope 归属，或统一替换为自己的 scope。发布后消费者即可安装 `@virtuui/react` 和 React peer dependencies。

```tsx
import { Button, Select, Switch, Tabs } from '@virtuui/react';
import '@virtuui/react/styles.css'; // 在应用入口导入一次，包含 token 和组件样式

function Example() {
  return (
    <>
      <Button onClick={() => console.log('save')}>Save changes</Button>
      <Select
        label="Framework"
        name="framework"
        defaultValue="react"
        options={[
          { value: 'react', label: 'React' },
          { value: 'next', label: 'Next.js' },
        ]}
      />
      <Switch label="Email notifications" defaultChecked />
    </>
  );
}
```

按组件子路径导入：

```tsx
import { Button } from '@virtuui/react/button';
import '@virtuui/react/styles.css';
```

所有组件通过具名导出支持 Tree Shaking。ESM 保留独立组件入口，React / ReactDOM 外置；UMD 将 Hooks 合入，React 外置并使用浏览器 `React` 全局。`dist/virtuui.umd.cjs` 同时支持 CommonJS require 和传统 script 加载（全局名 `VirtuUI`）；使用 script 时需先提供 React，另加载 `dist/styles.css`。CSS 是统一样式文件，不按组件拆分。

构建生成 `.d.ts`、声明映射、ESM sourcemap。`sideEffects` 仅保留 CSS。`pnpm test:artifacts` 验证所有导出目标、ESM / CommonJS / 浏览器 UMD、SSR、仅导入 Button 的 Tree Shaking，以及真正的 MCP stdio 会话。

## 组件契约

| 组件 | 受控接口 | 非受控接口 | 主要行为 |
| --- | --- | --- | --- |
| Button | 原生 `onClick` | — | variant、size、loading、disabled、ref；默认不提交表单 |
| Input | `value` / 原生 `onChange(event)` | `defaultValue` | label、hint、error、原生输入属性、ref |
| Select | `value` / `onValueChange(value)` | `defaultValue` | 原生单选、禁用选项、placeholder、校验、name、ref |
| Switch | `checked` / `onCheckedChange(checked)` | `defaultChecked` | 原生 checkbox + switch 语义、Space 切换、name/value、ref |
| Tabs | `value` / `onValueChange(value)` | `defaultValue` | 自动/手动激活、水平/垂直方向、保留面板状态 |
| Menu | `open` / `onOpenChange(open)` | `defaultOpen` | `onAction(value)`、外部点击关闭、焦点归还、禁用条目 |
| Badge | — | — | 状态颜色、装饰圆点、透传 span 属性 |
| Card | — | — | 中性容器、透传 div 属性和 ref |

`value !== undefined` 决定是否受控；`false` 和空字符串均为合法受控值。不要在组件生命周期中切换受控模式，也不要同时提供受控值和默认值。自定义组件回调传递业务值，原生 Input / Button 保留 DOM 事件。只有值变化时才通知。

Menu / Tabs 支持方向键、Home / End 和跳过禁用项。Menu 支持单字符首字母匹配、Escape 关闭并归还焦点、Tab 自然退出；Tabs 支持 `activationMode="manual"`，通过 Enter / Space 激活。Tab 项失效时展示首个可用项，不隐式通知父组件修改数据。

边界：Select 为单选原生控件；Menu 是内联、单层弹出菜单，不包含 portal、碰撞避让或子菜单，父容器应避免裁剪；组件不含业务数据请求。受控或内部状态管理的 Select / Switch 如需通过原生表单 reset 重置，请在表单 `onReset` 中更新受控值或重新挂载组件。Input 保留原生 reset 语义。图标按钮需要 `aria-label`；颜色不能替代状态文字。交互组件适用于 React 客户端；SSR 输出可生成，React Server Components 框架中请在客户端边界使用。

## Design Token 与主题

`packages/tokens/src/index.ts` 是颜色、间距、圆角、字体、动效的唯一数据源。构建自动生成 CSS；MCP 与规范检查读取同一份数据，避免文档与实现漂移。

```tsx
import { tokens, flattenTokens } from '@virtuui/tokens';

<section data-vui-theme="dark">...</section>
```

```css
.my-panel {
  color: var(--vui-color-text);
  background: var(--vui-color-surface);
  padding: var(--vui-space-6);
  border-radius: var(--vui-radius-lg);
}
/* 在库样式之后加载覆盖 */
:root { --vui-color-accent: #52734d; }
```

`data-vui-theme="light" | "dark"` 可设置在根元素或局部容器；组件响应 `prefers-reduced-motion`。展示站的主题选择只存储在本机 localStorage。

## AI / MCP 规范服务

```bash
pnpm build
node packages/mcp/dist/index.js
```

这是 stdio 服务，直接启动后等待客户端输入属于正常行为。不要向 stdout 添加日志。客户端配置示例：

```json
{
  "mcpServers": {
    "virtuui": {
      "command": "node",
      "args": ["/absolute/path/to/VirtualUI/packages/mcp/dist/index.js"]
    }
  }
}
```

| Tool | 输入 | 输出 |
| --- | --- | --- |
| `recommend_components` | `query`：中英文需求 | 支持的候选组件、评分、API、示例 |
| `get_component_docs` | `name`：组件名称枚举 | 属性、默认值、示例、无障碍说明 |
| `get_design_tokens` | `{}` | CSS 变量及深色覆盖值 |
| `check_code` | `code`：最长 100,000 字符 TSX | 规则、级别、行列、说明与修改建议 |

Resources：`virtuui://components`、`virtuui://tokens`、`virtuui://guidelines`。

检查器使用 TypeScript AST，不运行用户代码、不读取任意文件、不访问网络。支持混合受控/非受控状态、缺失回调、显式标签缺失、未知 Token、字面量颜色、原生按钮绕过组件规范、危险 HTML 提示；识别组件别名和命名空间导入。

这是**静态辅助检查**：不会推断 spread props、动态表达式、外部 CSS，也不替代 TypeScript、完整安全审计或无障碍审计。`passed` 表示没有 error，仍可能含 warning。选型使用确定性的关键词匹配，无匹配时返回空数组，不生成不存在的组件。

## 测试与贡献

Jest + Testing Library 测试真实交互结果：焦点移动、键盘触发、状态归属、禁用选项、表单提交、ARIA 关联、空数据、移除 Tab、菜单关闭、Hook 清理与 AST 规则。Storybook 为 8 个组件提供自动文档、Controls、状态示例和交互 play 函数。浏览器测试额外覆盖桌面/移动站点、主题、过滤、详情导航及 axe。

克隆仓库后，`pnpm install` 会通过 prepare 自动启用 Husky。如使用不含 Git 历史的源码副本，可先初始化仓库：

```bash
git init
pnpm prepare
```

pre-commit 执行 ESLint / 类型检查，pre-push 执行 Jest；CI 执行完整构建、测试、覆盖率和 Storybook。最低覆盖率为 statements / lines 80%、functions 75%、branches 65%。每次公共 API 变更应补充对应文档、交互测试和 Changeset。

## 独立发布

```bash
pnpm changeset           # 选择受影响包及 major / minor / patch
pnpm version-packages    # 写入版本和 CHANGELOG
pnpm release             # 完整检查成功后，使用当前 npm 凭据发布
```

所有可发布包包含 dist、README、MIT License，docs 为 private。Changesets 独立版本配置会更新内部依赖。`pnpm pack` 将 `workspace:^` 转为正常 semver。发布属于显式操作，本项目实现过程没有执行 npm publish。

产物：`apps/docs/dist`、`apps/docs/storybook-static` 可以部署到静态托管。若部署到子路径，请在 Vite 中配置对应 `base`。

## 实现参考

- [Vite Library Mode](https://vite.dev/guide/build.html#library-mode)：ESM 多入口与独立 UMD 构建。
- [MCP TypeScript SDK v1](https://ts.sdk.modelcontextprotocol.io/server)：基于锁定的 1.x SDK 注册 Tool / Resource，通过 stdio 提供服务。

MIT License。
