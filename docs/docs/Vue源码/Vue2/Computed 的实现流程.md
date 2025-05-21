## 初始化流程
```mermaid
graph TD
    A[Vue实例化] --> B[initState]
    B --> C{是否有computed选项}
    C -->|是| D[initComputed]
    C -->|否| Z[结束]
    D --> E[创建_computedWatchers空对象]
    E --> F[遍历computed选项]
    F --> G[提取getter函数]
    G --> H[创建计算属性Watcher]
    H --> I[设置lazy为true]
    I --> J[defineComputed定义计算属性]
    J --> K[Object.defineProperty定义]
    K --> L[设置getter为createComputedGetter]
    L --> M[设置setter]
    F -->|遍历结束| Z
```

## 计算属性的计算和依赖收集流程
```mermaid
graph TD
    A[访问计算属性] --> B[调用createComputedGetter]
    B --> C[获取对应的watcher]
    C --> D{watcher.dirty是否为true}
    D -->|是| E[watcher.evaluate计算值]
    D -->|否| F[跳过计算]
    E --> G[调用watcher.get方法]
    G --> H[pushTarget设置当前watcher]
    H --> I[执行getter函数]
    I --> J[触发data属性的getter]
    J --> K[data属性收集计算属性watcher]
    K --> L[popTarget恢复之前的watcher]
    L --> M[设置dirty为false]
    M --> N{Dep.target是否存在}
    F --> N
    N -->|是| O[调用watcher.depend]
    O --> P[遍历计算属性依赖的所有dep]
    P --> Q[调用dep.depend]
    Q --> R[将渲染watcher添加到data属性的dep中]
    N -->|否| S[返回watcher.value]
    R --> S
```

## 计算属性的更新流程
```mermaid
graph TD
    A[依赖的data属性变化] --> B[触发setter]
    B --> C[调用dep.notify]
    C --> D[遍历所有watcher]
    D --> E[调用watcher.update]
    E --> F{watcher是否为lazy}
    F -->|是| G[设置dirty为true]
    G --> H[下次访问计算属性时重新计算]
    F -->|否| I[加入更新队列]
    H --> J[渲染watcher更新]
    I --> J
```

## watcher、dep 与 computed 的关系
```mermaid
graph TD
    A[渲染Watcher] -->|依赖| B[计算属性]
    B -->|依赖| C[data属性]
    C -->|收集| D[dep]
    D -->|存储| E[计算属性Watcher]
    E -->|存储| F[data属性的dep]
    F -->|通知| E
    E -->|更新dirty标记| G{dirty标记}
    G -->|true| H[重新计算]
    G -->|false| I[使用缓存]
    H --> J[更新计算属性值]
    I --> J
    J -->|通知| A
```

## 类之间的调用关系
```mermaid
classDiagram
    class Vue {
        +$options
        +_data
        +_computedWatchers
        +initState()
    }

    class Watcher {
        +id
        +vm
        +getter
        +deps
        +depsId
        +lazy
        +dirty
        +value
        +get()
        +addDep(dep)
        +evaluate()
        +depend()
        +update()
    }

    class Dep {
        +id
        +subs
        +depend()
        +addSub(watcher)
        +notify()
        +static target
    }

    class ComputedProperty {
        +getter
        +setter
    }

    Vue --> Watcher : 创建_computedWatchers
    Vue --> ComputedProperty : 定义计算属性
    Watcher --> Dep : addDep/depend
    Dep --> Watcher : addSub/notify
    ComputedProperty --> Watcher : 调用_computedWatchers中的watcher
    Watcher --> ComputedProperty : 提供计算结果

    note for Vue "初始化computed选项时创建watcher并定义计算属性"
    note for Watcher "计算属性watcher设置lazy为true，依赖数据变化时只标记dirty"
    note for Dep "存储和通知依赖该数据的watcher"
    note for ComputedProperty "通过createComputedGetter实现懒计算和缓存"
```

## 计算属性的特点总结：
1. **懒计算**：计算属性只有在被访问时才会计算
2. **缓存**：计算结果会被缓存，只有依赖变化时才会重新计算
3. **依赖追踪**：自动收集计算过程中访问的响应式数据作为依赖
4. **依赖传递**：将计算属性的依赖传递给渲染 watcher，形成依赖链

