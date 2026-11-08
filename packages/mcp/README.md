# @virtuui/mcp

VirtuUI MCP stdio 服务：4 个 Tool、3 个 Resource。

发布安装后运行 `virtuui-mcp`，或本地构建后 `node dist/index.js`。

Tools: `recommend_components`、`get_component_docs`、`get_design_tokens`、`check_code`。Resources: `virtuui://components`、`virtuui://tokens`、`virtuui://guidelines`。通过 stdio 与 MCP 客户端通信，stdout 不输出诊断日志。只读服务，不运行输入代码、不读取任意文件。

完整开发、测试、发布和边界说明见工作区根目录 README。MIT License。
