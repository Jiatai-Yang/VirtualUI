# 贡献指南

1. 使用 Node.js 22.12+ / pnpm 10，先 `pnpm install`。
2. `pnpm dev` 构建并监听工作区；`pnpm storybook` 开发状态示例。
3. 组件放在 `packages/react/src`，公共交互在 `packages/hooks/src`，Token 只能从 tokens 修改。
4. 新组件需同时加入 `src/index.tsx`、Vite ESM entry、package.json exports、governance catalog、展示站、Storybook 和交互测试。
5. 不引入反向跨包依赖。事件、受控状态、ref、label、disabled 与键盘契约应在提交前确定。
6. 运行 `pnpm check`、`pnpm test:coverage`、`pnpm build:storybook` 和浏览器测试。
7. 公共 API / 样式 / Token 变化执行 `pnpm changeset`。记录行为变化和升级方式。

命名：组件 PascalCase、Hook 以 use 开头、CSS 使用 vui- 前缀、Token 使用 --vui- 前缀。回调优先使用业务值；原生输入事件不重新包装。

不要把构建产物、node_modules、用户数据或凭据提交到仓库。缺陷报告请包含最小复现和键盘操作步骤。
