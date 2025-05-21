## patch 更新流程
```mermaid
graph TD
    A["调用patch方法"] --> B{"是否是首次渲染?"}
    B -->|是| C["获取真实DOM元素"]
    C --> D["创建新DOM元素"]
    D --> E["插入到父节点"]
    E --> F["移除旧节点"]
    F --> Z["结束"]
    B -->|否| G["调用patchVnode"]
    G --> Z
```

## patchVnode 核心流程
```mermaid
graph TD
    A["patchVnode"] --> B{"是否是相同节点?"}
    B -->|否| C["创建新节点替换旧节点"]
    C --> Z["结束"]
    B -->|是| D["复用旧节点DOM元素"]
    D --> E{"是否是文本节点?"}
    E -->|是| F{"文本内容是否相同?"}
    F -->|否| G["更新文本内容"]
    F -->|是| H["跳过更新"]
    E -->|否| I["更新节点属性"]
    I --> J["比较子节点"]
    G --> Z
    H --> Z
    J --> K{"新旧子节点情况?"}
    K -->|都有子节点| L["调用updateChildren"]
    K -->|只有新子节点| M["挂载所有新子节点"]
    K -->|只有旧子节点| N["清空innerHTML"]
    K -->|都没有子节点| O["无需操作"]
    L --> Z
    M --> Z
    N --> Z
    O --> Z
```

## updateChildren 双指针Diff算法
```mermaid
graph TD
    A["updateChildren"] --> B["初始化头尾指针"]
    B --> C["开始while循环比较"]
    C --> D{"旧开始或旧结束节点是否为null?"}
    D -->|是| E["移动对应指针"]
    D -->|否| F{"头头比较是否相同?"}
    F -->|是| G["递归patchVnode"]
    G --> H["移动头指针"]
    F -->|否| I{"尾尾比较是否相同?"}
    I -->|是| J["递归patchVnode"]
    J --> K["移动尾指针"]
    I -->|否| L{"交叉比较:旧尾与新头?"}
    L -->|是| M["递归patchVnode"]
    M --> N["将旧尾节点DOM移到旧头前"]
    N --> O["移动对应指针"]
    L -->|否| P{"交叉比较:旧头与新尾?"}
    P -->|是| Q["递归patchVnode"]
    Q --> R["将旧头节点DOM移到旧尾后"]
    R --> S["移动对应指针"]
    P -->|否| T["乱序比较"]
    T --> U["根据key建立索引映射"]
    U --> V{"能否找到对应节点?"}
    V -->|是| W["移动已有节点"]
    V -->|否| X["创建新节点"]
    W --> Y["继续循环"]
    X --> Y
    E --> Y
    H --> Y
    K --> Y
    O --> Y
    S --> Y
    Y --> C
    C -->|循环结束| Z1{"新节点是否有剩余?"}
    Z1 -->|是| Z2["批量添加剩余新节点"]
    Z1 -->|否| Z3{"旧节点是否有剩余?"}
    Z3 -->|是| Z4["批量删除剩余旧节点"]
    Z3 -->|否| Z5["Diff完成"]
    Z2 --> Z5
    Z4 --> Z5
```

## 虚拟DOM和Diff关系图
```mermaid
classDiagram
    class VNode {
        +tag
        +key
        +data
        +children
        +text
        +el
    }
    class Patch {
        +patch(oldVNode, vNode)
        +patchVnode(oldVNode, vNode)
        +updateChildren(el, oldChildren, newChildren)
        +createElm(vNode)
        +patchProps(el, oldProps, props)
    }
    class Render {
        +_update(vNode)
        +_render()
    }
    class Vue {
        +$options
        +_vnode
        +__patch__
        +_update()
        +_render()
    }
    Vue --> Render : 调用
    Render --> Patch : 使用patch方法
    Patch --> VNode : 操作VNode
    Vue --> VNode : 生成VNode
    note for Patch "处理更新、比对和渲染虚拟DOM"
    note for Render "管理渲染过程"
    note for VNode "保存真实DOM引用的虚拟节点"
    note for Vue "调用render生成VNode再调用update更新"
```

## Diff算法的核心策略
```mermaid
graph TD
    A["Diff策略"] --> B["同级比较"]
    A --> C["key标识复用"]
    A --> D["四种假设性优化"]
    B --> B1["避免跨层级比较"]
    B --> B2["复杂度从O(n³)降至O(n)"]
    C --> C1["识别相同节点"]
    C --> C2["提高列表diff效率"]
    D --> D1["新旧头部比较"]
    D --> D2["新旧尾部比较"]
    D --> D3["旧尾新头比较"]
    D --> D4["旧头新尾比较"]
    D --> D5["都不匹配时使用key映射查找"]
```

## Diff算法的特点总结：
1. **同级比较**：只比较同一层级的节点，不做跨层级比较
2. **高效识别**：通过tag和key快速识别相同节点
3. **双端比较**：采用双指针法从两端向中间比较，优化常见DOM操作场景
4. **映射复用**：对于乱序的情况，通过key建立映射以提高查找效率
5. **就地复用**：尽可能复用已有DOM节点，减少DOM操作

