# @virtuui/react

8 个通用 React 组件，支持键盘操作、受控状态、ESM 按需导入和 UMD。

```tsx
import { Button } from '@virtuui/react/button';
import '@virtuui/react/styles.css';

<Button onClick={() => console.log('save')}>Save</Button>
```

需要 React / ReactDOM 18.2+ 或 19。使用 `value`、`checked`、`open` 时传入对应变更回调；不要同时传默认值。UMD 导出全局 `VirtuUI`，需先提供全局 React。

完整开发、测试、发布和边界说明见工作区根目录 README。MIT License。
