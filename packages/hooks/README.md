# @virtuui/hooks

useControllableState、useRovingFocus、useOutsideClick 公共交互 Hooks。

```tsx
const [value, setValue] = useControllableState({ value: props.value, defaultValue: '', onChange: props.onValueChange });
```

undefined 为非受控；false、空字符串为合法受控值。不支持生命周期中切换受控模式。

完整开发、测试、发布和边界说明见工作区根目录 README。MIT License。
