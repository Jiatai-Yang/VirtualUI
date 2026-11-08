# @virtuui/governance

结构化组件目录、编码指南和只读 TSX AST 规范检查器。

```ts
import { checkCode, recommendComponents } from '@virtuui/governance';
import { catalog } from '@virtuui/governance/catalog';
```

浏览器文档仅导入 catalog 子路径，避免打包 TypeScript。检查结果包含风险级别、行列和建议；不会执行代码或读取文件。静态检查不涵盖 spread、动态属性、外部 CSS 或完整安全/无障碍审计。

完整开发、测试、发布和边界说明见工作区根目录 README。MIT License。
