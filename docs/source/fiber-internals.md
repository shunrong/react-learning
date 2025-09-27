# Fiber内部机制深度解析

> 🔬 深入React Fiber架构核心，解密可中断渲染的底层实现原理

## 📋 概述

Fiber是React 16引入的革命性架构，它将同步的递归渲染过程改造为异步的可中断渲染。本文将深入Fiber的源码实现，从数据结构到工作循环，全面解析这一现代前端框架的核心技术。

### 🎯 核心价值

- **可中断渲染** - 长任务分片，保持UI响应
- **优先级调度** - 重要更新优先处理
- **错误边界** - 局部错误隔离
- **并发基础** - 为React 18并发特性奠定基础

## 🏗️ Fiber数据结构深度解析

### 📦 FiberNode核心结构

```javascript
// React源码中的FiberNode定义 (简化版)
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance属性
  this.tag = tag;                    // Fiber类型标识
  this.key = key;                    // React key
  this.elementType = null;           // 元素类型
  this.type = null;                  // 函数组件的函数或类组件的类
  this.stateNode = null;             // 对应的DOM节点或组件实例

  // Fiber链表结构 - 构建Fiber树
  this.return = null;                // 父Fiber节点
  this.child = null;                 // 第一个子Fiber节点
  this.sibling = null;               // 下一个兄弟Fiber节点
  this.index = 0;                    // 在兄弟节点中的位置

  // 工作相关属性
  this.ref = null;                   // ref引用
  this.pendingProps = pendingProps;  // 新的props
  this.memoizedProps = null;         // 上次渲染使用的props
  this.updateQueue = null;           // 更新队列
  this.memoizedState = null;         // 上次渲染的state

  // 副作用相关
  this.flags = NoFlags;              // 副作用标记
  this.subtreeFlags = NoFlags;       // 子树副作用标记
  this.deletions = null;             // 需要删除的子节点

  // 调度相关
  this.lanes = NoLanes;              // 当前Fiber的优先级
  this.childLanes = NoLanes;         // 子树的优先级

  // 双缓冲机制
  this.alternate = null;             // 指向另一棵Fiber树的对应节点
}

// Fiber节点类型枚举 (部分)
const WorkTag = {
  FunctionComponent: 0,        // 函数组件
  ClassComponent: 1,           // 类组件
  IndeterminateComponent: 2,   // 未确定组件类型
  HostRoot: 3,                 // 根节点
  HostPortal: 4,               // Portal
  HostComponent: 5,            // 原生DOM组件
  HostText: 6,                 // 文本节点
  Fragment: 7,                 // Fragment
  Mode: 8,                     // 模式节点
  ContextConsumer: 9,          // Context消费者
  ContextProvider: 10,         // Context提供者
  ForwardRef: 11,              // ForwardRef
  Profiler: 12,                // Profiler
  SuspenseComponent: 13,       // Suspense
  MemoComponent: 14,           // React.memo
  SimpleMemoComponent: 15,     // 简单memo组件
  LazyComponent: 16,           // React.lazy
  IncompleteClassComponent: 17, // 未完成的类组件
  DehydratedFragment: 18,      // 脱水的Fragment
  SuspenseListComponent: 19,   // SuspenseList
  ScopeComponent: 21,          // Scope组件
  OffscreenComponent: 22,      // Offscreen组件
  LegacyHiddenComponent: 23,   // 遗留隐藏组件
  CacheComponent: 24,          // Cache组件
  TracingMarkerComponent: 25,  // 追踪标记组件
};
```

### 🔗 Fiber树结构详解

```javascript
// Fiber树的构建和遍历
class FiberTree {
  constructor() {
    this.current = null;      // 当前显示的Fiber树
    this.finishedWork = null; // 完成工作的Fiber树
  }
  
  // 深度优先遍历Fiber树
  traverseFiberTree(fiber, callback) {
    if (!fiber) return;
    
    // 处理当前节点
    callback(fiber);
    
    // 遍历子节点
    let child = fiber.child;
    while (child) {
      this.traverseFiberTree(child, callback);
      child = child.sibling;
    }
  }
  
  // 向上冒泡遍历
  bubbleUp(fiber, callback) {
    let current = fiber;
    while (current) {
      callback(current);
      current = current.return;
    }
  }
  
  // 查找具有特定tag的父节点
  findParentOfType(fiber, targetTag) {
    let current = fiber.return;
    while (current) {
      if (current.tag === targetTag) {
        return current;
      }
      current = current.return;
    }
    return null;
  }
}

// Fiber链表操作实用工具
const FiberUtils = {
  // 创建Fiber节点
  createFiber(tag, pendingProps, key, mode) {
    return new FiberNode(tag, pendingProps, key, mode);
  },
  
  // 克隆Fiber节点
  createWorkInProgress(current, pendingProps) {
    let workInProgress = current.alternate;
    
    if (workInProgress === null) {
      // 创建新的WIP节点
      workInProgress = this.createFiber(
        current.tag,
        pendingProps,
        current.key,
        current.mode
      );
      workInProgress.elementType = current.elementType;
      workInProgress.type = current.type;
      workInProgress.stateNode = current.stateNode;
      
      // 建立双向连接
      workInProgress.alternate = current;
      current.alternate = workInProgress;
    } else {
      // 复用已有的WIP节点
      workInProgress.pendingProps = pendingProps;
      workInProgress.type = current.type;
      workInProgress.flags = NoFlags;
      workInProgress.subtreeFlags = NoFlags;
      workInProgress.deletions = null;
    }
    
    // 复制其他属性
    workInProgress.flags = current.flags;
    workInProgress.childLanes = current.childLanes;
    workInProgress.lanes = current.lanes;
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;
    
    return workInProgress;
  },
  
  // 插入子节点
  appendChild(parent, child) {
    if (parent.child === null) {
      parent.child = child;
    } else {
      let sibling = parent.child;
      while (sibling.sibling !== null) {
        sibling = sibling.sibling;
      }
      sibling.sibling = child;
    }
    child.return = parent;
  },
  
  // 删除子节点
  removeChild(parent, child) {
    if (parent.child === child) {
      parent.child = child.sibling;
    } else {
      let sibling = parent.child;
      while (sibling && sibling.sibling !== child) {
        sibling = sibling.sibling;
      }
      if (sibling) {
        sibling.sibling = child.sibling;
      }
    }
    child.return = null;
    child.sibling = null;
  }
};
```

## ⚡ Fiber工作循环机制

### 🔄 调度器(Scheduler)深度解析

```javascript
// React调度器的核心实现
class ReactScheduler {
  constructor() {
    this.taskQueue = [];           // 任务队列
    this.isSchedulerPaused = false; // 调度器是否暂停
    this.currentTask = null;       // 当前执行的任务
    this.currentPriorityLevel = NormalPriority; // 当前优先级
    this.isPerformingWork = false; // 是否正在执行工作
    this.isHostCallbackScheduled = false; // 是否已调度宿主回调
  }
  
  // 调度任务的核心函数
  scheduleCallback(priorityLevel, callback, options = {}) {
    const currentTime = getCurrentTime();
    
    // 计算任务的开始时间
    let startTime;
    if (typeof options.delay === 'number' && options.delay > 0) {
      startTime = currentTime + options.delay;
    } else {
      startTime = currentTime;
    }
    
    // 根据优先级计算过期时间
    let timeout;
    switch (priorityLevel) {
      case ImmediatePriority:
        timeout = IMMEDIATE_PRIORITY_TIMEOUT; // -1ms 立即过期
        break;
      case UserBlockingPriority:
        timeout = USER_BLOCKING_PRIORITY_TIMEOUT; // 250ms
        break;
      case IdlePriority:
        timeout = IDLE_PRIORITY_TIMEOUT; // 1073741823ms (最大值)
        break;
      case LowPriority:
        timeout = LOW_PRIORITY_TIMEOUT; // 10000ms
        break;
      case NormalPriority:
      default:
        timeout = NORMAL_PRIORITY_TIMEOUT; // 5000ms
        break;
    }
    
    const expirationTime = startTime + timeout;
    
    // 创建新任务
    const newTask = {
      id: taskIdCounter++,
      callback,
      priorityLevel,
      startTime,
      expirationTime,
      sortIndex: -1,
    };
    
    if (startTime > currentTime) {
      // 延迟任务
      newTask.sortIndex = startTime;
      this.timerQueue.push(newTask);
      
      if (this.taskQueue.peek() === null && newTask === this.timerQueue.peek()) {
        if (this.isHostTimeoutScheduled) {
          cancelHostTimeout();
        } else {
          this.isHostTimeoutScheduled = true;
        }
        requestHostTimeout(this.handleTimeout, startTime - currentTime);
      }
    } else {
      // 立即任务
      newTask.sortIndex = expirationTime;
      this.taskQueue.push(newTask);
      
      if (!this.isHostCallbackScheduled && !this.isPerformingWork) {
        this.isHostCallbackScheduled = true;
        this.requestHostCallback(this.flushWork);
      }
    }
    
    return newTask;
  }
  
  // 执行工作的主循环
  flushWork(hasTimeRemaining, initialTime) {
    this.isHostCallbackScheduled = false;
    
    if (this.isHostTimeoutScheduled) {
      this.isHostTimeoutScheduled = false;
      cancelHostTimeout();
    }
    
    this.isPerformingWork = true;
    const previousPriorityLevel = this.currentPriorityLevel;
    
    try {
      return this.workLoop(hasTimeRemaining, initialTime);
    } finally {
      this.currentTask = null;
      this.currentPriorityLevel = previousPriorityLevel;
      this.isPerformingWork = false;
    }
  }
  
  // 工作循环 - 时间切片的核心
  workLoop(hasTimeRemaining, initialTime) {
    let currentTime = initialTime;
    this.advanceTimers(currentTime);
    this.currentTask = this.taskQueue.peek();
    
    while (this.currentTask !== null) {
      if (
        this.currentTask.expirationTime > currentTime &&
        (!hasTimeRemaining || shouldYieldToHost())
      ) {
        // 时间片用完，需要让出控制权
        break;
      }
      
      const callback = this.currentTask.callback;
      if (typeof callback === 'function') {
        this.currentTask.callback = null;
        this.currentPriorityLevel = this.currentTask.priorityLevel;
        
        const didUserCallbackTimeout = 
          this.currentTask.expirationTime <= currentTime;
        
        // 执行任务回调
        const continuationCallback = callback(didUserCallbackTimeout);
        currentTime = getCurrentTime();
        
        if (typeof continuationCallback === 'function') {
          // 任务还没完成，继续执行
          this.currentTask.callback = continuationCallback;
        } else {
          // 任务完成，从队列中移除
          if (this.currentTask === this.taskQueue.peek()) {
            this.taskQueue.pop();
          }
        }
        
        this.advanceTimers(currentTime);
      } else {
        this.taskQueue.pop();
      }
      
      this.currentTask = this.taskQueue.peek();
    }
    
    // 返回是否还有更多工作
    if (this.currentTask !== null) {
      return true;
    } else {
      const firstTimer = this.timerQueue.peek();
      if (firstTimer !== null) {
        this.requestHostTimeout(
          this.handleTimeout,
          firstTimer.startTime - currentTime
        );
      }
      return false;
    }
  }
  
  // 时间切片的实现
  shouldYieldToHost() {
    const timeElapsed = getCurrentTime() - startTime;
    if (timeElapsed < frameInterval) {
      return false; // 时间片还没用完
    }
    
    // 检查是否有更高优先级的任务
    if (enableIsInputPending) {
      if (needsPaint || scheduling.isInputPending()) {
        return true; // 需要让出控制权
      }
    }
    
    return true; // 时间片用完，让出控制权
  }
}
```

### 🔧 WorkLoop工作机制

```javascript
// Fiber工作循环的详细实现
class FiberWorkLoop {
  constructor() {
    this.workInProgress = null;     // 当前工作的Fiber节点
    this.workInProgressRoot = null; // 当前工作的根节点
    this.workInProgressRootRenderLanes = NoLanes; // 当前渲染的车道
    this.currentEventTime = NoTimestamp;
    this.currentEventTransitionLane = NoLane;
  }
  
  // 开始工作循环
  performUnitOfWork(unitOfWork) {
    // 获取当前Fiber节点
    const current = unitOfWork.alternate;
    
    // 开始工作阶段 - 向下递归
    let next = this.beginWork(current, unitOfWork, this.renderLanes);
    
    // 更新props
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    
    if (next === null) {
      // 如果没有子节点，完成当前工作单元
      this.completeUnitOfWork(unitOfWork);
    } else {
      // 继续处理子节点
      this.workInProgress = next;
    }
  }
  
  // 开始工作 - 递的过程
  beginWork(current, workInProgress, renderLanes) {
    const updateLanes = workInProgress.lanes;
    
    if (current !== null) {
      const oldProps = current.memoizedProps;
      const newProps = workInProgress.pendingProps;
      
      if (
        oldProps !== newProps ||
        hasLegacyContextChanged() ||
        (workInProgress.type !== current.type)
      ) {
        // Props或type发生变化，需要更新
        didReceiveUpdate = true;
      } else if (!includesSomeLane(renderLanes, updateLanes)) {
        // 没有工作要做，可以复用
        didReceiveUpdate = false;
        return this.bailoutOnAlreadyFinishedWork(
          current,
          workInProgress,
          renderLanes
        );
      }
    }
    
    // 清除lanes
    workInProgress.lanes = NoLanes;
    
    // 根据组件类型执行相应的更新逻辑
    switch (workInProgress.tag) {
      case IndeterminateComponent: {
        return this.mountIndeterminateComponent(
          current,
          workInProgress,
          workInProgress.type,
          renderLanes
        );
      }
      case LazyComponent: {
        const elementType = workInProgress.elementType;
        return this.mountLazyComponent(
          current,
          workInProgress,
          elementType,
          renderLanes
        );
      }
      case FunctionComponent: {
        const Component = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
        return this.updateFunctionComponent(
          current,
          workInProgress,
          Component,
          resolvedProps,
          renderLanes
        );
      }
      case ClassComponent: {
        const Component = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
        return this.updateClassComponent(
          current,
          workInProgress,
          Component,
          resolvedProps,
          renderLanes
        );
      }
      case HostRoot:
        return this.updateHostRoot(current, workInProgress, renderLanes);
      case HostComponent:
        return this.updateHostComponent(current, workInProgress, renderLanes);
      case HostText:
        return this.updateHostText(current, workInProgress);
      // ... 其他类型的处理
    }
  }
  
  // 完成工作单元 - 归的过程
  completeUnitOfWork(unitOfWork) {
    let completedWork = unitOfWork;
    
    do {
      const current = completedWork.alternate;
      const returnFiber = completedWork.return;
      
      if ((completedWork.flags & Incomplete) === NoFlags) {
        // 工作正常完成
        let next = this.completeWork(current, completedWork, this.renderLanes);
        
        if (next !== null) {
          // 如果completeWork返回了新工作，继续处理
          this.workInProgress = next;
          return;
        }
      } else {
        // 工作异常，处理错误
        const next = this.unwindWork(current, completedWork, this.renderLanes);
        if (next !== null) {
          next.flags &= HostEffectMask;
          this.workInProgress = next;
          return;
        }
      }
      
      const siblingFiber = completedWork.sibling;
      if (siblingFiber !== null) {
        // 如果有兄弟节点，处理兄弟节点
        this.workInProgress = siblingFiber;
        return;
      }
      
      // 回到父节点
      completedWork = returnFiber;
      this.workInProgress = completedWork;
    } while (completedWork !== null);
    
    // 已经回到根节点，工作完成
    if (this.workInProgressRootExitStatus === RootInProgress) {
      this.workInProgressRootExitStatus = RootCompleted;
    }
  }
  
  // 完成工作 - 创建或更新DOM
  completeWork(current, workInProgress, renderLanes) {
    const newProps = workInProgress.pendingProps;
    
    switch (workInProgress.tag) {
      case IndeterminateComponent:
      case LazyComponent:
      case SimpleMemoComponent:
      case FunctionComponent:
      case ForwardRef:
      case Fragment:
      case Mode:
      case Profiler:
      case ContextConsumer:
      case MemoComponent:
        return null;
        
      case ClassComponent: {
        const Component = workInProgress.type;
        if (isLegacyContextProvider(Component)) {
          popLegacyContext(workInProgress);
        }
        return null;
      }
      
      case HostRoot: {
        const fiberRoot = workInProgress.stateNode;
        
        if (fiberRoot.pendingContext) {
          fiberRoot.context = fiberRoot.pendingContext;
          fiberRoot.pendingContext = null;
        }
        
        if (current === null || current.child === null) {
          // 根节点的初始挂载
          const wasHydrated = popHydrationState(workInProgress);
          if (wasHydrated) {
            markUpdate(workInProgress);
          }
        }
        
        updateHostContainer(current, workInProgress);
        return null;
      }
      
      case HostComponent: {
        popHostContext(workInProgress);
        const rootContainerInstance = getRootHostContainer();
        const type = workInProgress.type;
        
        if (current !== null && workInProgress.stateNode != null) {
          // 更新现有DOM节点
          this.updateHostComponent(
            current,
            workInProgress,
            type,
            newProps,
            rootContainerInstance
          );
          
          if (current.ref !== workInProgress.ref) {
            markRef(workInProgress);
          }
        } else {
          // 创建新DOM节点
          if (!newProps) {
            if (workInProgress.stateNode === null) {
              throw new Error('需要有stateNode');
            }
            return null;
          }
          
          const currentHostContext = getHostContext();
          const wasHydrated = popHydrationState(workInProgress);
          
          if (wasHydrated) {
            // 服务端渲染的情况
            if (prepareToHydrateHostInstance(
              workInProgress,
              rootContainerInstance,
              currentHostContext
            )) {
              markUpdate(workInProgress);
            }
          } else {
            // 创建DOM实例
            const instance = createInstance(
              type,
              newProps,
              rootContainerInstance,
              currentHostContext,
              workInProgress
            );
            
            // 添加子节点到DOM实例
            appendAllChildren(instance, workInProgress, false, false);
            workInProgress.stateNode = instance;
            
            // 设置初始属性
            if (finalizeInitialChildren(
              instance,
              type,
              newProps,
              rootContainerInstance,
              currentHostContext
            )) {
              markUpdate(workInProgress);
            }
          }
          
          if (workInProgress.ref !== null) {
            markRef(workInProgress);
          }
        }
        return null;
      }
      
      case HostText: {
        const newText = newProps;
        
        if (current && workInProgress.stateNode != null) {
          const oldText = current.memoizedProps;
          this.updateHostText(current, workInProgress, oldText, newText);
        } else {
          if (typeof newText !== 'string') {
            if (workInProgress.stateNode === null) {
              throw new Error('需要有stateNode');
            }
          }
          
          const rootContainerInstance = getRootHostContainer();
          const currentHostContext = getHostContext();
          const wasHydrated = popHydrationState(workInProgress);
          
          if (wasHydrated) {
            if (prepareToHydrateHostTextInstance(workInProgress)) {
              markUpdate(workInProgress);
            }
          } else {
            workInProgress.stateNode = createTextInstance(
              newText,
              rootContainerInstance,
              currentHostContext,
              workInProgress
            );
          }
        }
        return null;
      }
      
      // ... 其他类型的处理
    }
  }
  
  // 错误恢复机制
  unwindWork(current, workInProgress, renderLanes) {
    switch (workInProgress.tag) {
      case ClassComponent: {
        const Component = workInProgress.type;
        if (isLegacyContextProvider(Component)) {
          popLegacyContext(workInProgress);
        }
        const flags = workInProgress.flags;
        if (flags & ShouldCapture) {
          workInProgress.flags = (flags & ~ShouldCapture) | DidCapture;
          if ((workInProgress.mode & ProfileMode) !== NoMode) {
            transferActualDuration(workInProgress);
          }
          return workInProgress;
        }
        return null;
      }
      
      case HostRoot: {
        const root = workInProgress.stateNode;
        popHostContainer(workInProgress);
        popTopLevelLegacyContextObject(workInProgress);
        resetMutableSourceWorkInProgressVersions();
        const flags = workInProgress.flags;
        if (
          (flags & ShouldCapture) !== NoFlags &&
          (flags & DidCapture) === NoFlags
        ) {
          workInProgress.flags = (flags & ~ShouldCapture) | DidCapture;
          return workInProgress;
        }
        return null;
      }
      
      case HostComponent: {
        popHostContext(workInProgress);
        return null;
      }
      
      case SuspenseComponent: {
        popSuspenseContext(workInProgress);
        const flags = workInProgress.flags;
        if (flags & ShouldCapture) {
          workInProgress.flags = (flags & ~ShouldCapture) | DidCapture;
          if ((workInProgress.mode & ProfileMode) !== NoMode) {
            transferActualDuration(workInProgress);
          }
          return workInProgress;
        }
        return null;
      }
      
      // ... 其他类型的错误处理
      
      default:
        return null;
    }
  }
}
```

## 🚦 优先级系统与Lane模型

### 🛣️ Lane优先级系统

```javascript
// React的Lane优先级系统
const Lanes = {
  NoLanes: 0b0000000000000000000000000000000,
  NoLane: 0b0000000000000000000000000000000,
  
  // 同步优先级
  SyncLane: 0b0000000000000000000000000000001,
  
  // 输入优先级
  InputContinuousHydrationLane: 0b0000000000000000000000000000010,
  InputContinuousLane: 0b0000000000000000000000000000100,
  
  // 默认优先级
  DefaultHydrationLane: 0b0000000000000000000000000001000,
  DefaultLane: 0b0000000000000000000000000010000,
  
  // 过渡优先级
  TransitionHydrationLane: 0b0000000000000000000000000100000,
  TransitionLanes: 0b0000000001111111111111111000000,
  
  // 重试优先级
  RetryLanes: 0b0000001110000000000000000000000,
  
  // 选择性水合优先级
  SelectiveHydrationLane: 0b0000010000000000000000000000000,
  
  // 空闲优先级
  IdleHydrationLane: 0b0000100000000000000000000000000,
  IdleLane: 0b0001000000000000000000000000000,
  
  // 屏幕外优先级
  OffscreenLane: 0b0010000000000000000000000000000,
};

// Lane工具函数
const LaneUtils = {
  // 获取最高优先级的lane
  getHighestPriorityLane(lanes) {
    return lanes & -lanes; // 位运算技巧：获取最低位的1
  },
  
  // 获取下一个优先级
  getNextLanes(root, wipLanes) {
    // 检查是否有过期的lanes
    const expiredLanes = this.getExpiredLanes(root, now());
    if (expiredLanes !== NoLanes) {
      return expiredLanes;
    }
    
    // 检查挂起的lanes
    const pendingLanes = root.pendingLanes;
    if (pendingLanes === NoLanes) {
      return NoLanes;
    }
    
    // 排除挂起的lanes
    const suspendedLanes = root.suspendedLanes;
    const pingedLanes = root.pingedLanes;
    const nonIdlePendingLanes = pendingLanes & NonIdleLanes;
    
    if (nonIdlePendingLanes !== NoLanes) {
      const nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes;
      if (nonIdleUnblockedLanes !== NoLanes) {
        return this.getHighestPriorityLanes(nonIdleUnblockedLanes);
      } else {
        const nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes;
        if (nonIdlePingedLanes !== NoLanes) {
          return this.getHighestPriorityLanes(nonIdlePingedLanes);
        }
      }
    } else {
      // 只有空闲工作
      const unblockedLanes = pendingLanes & ~suspendedLanes;
      if (unblockedLanes !== NoLanes) {
        return this.getHighestPriorityLanes(unblockedLanes);
      } else {
        if (pingedLanes !== NoLanes) {
          return this.getHighestPriorityLanes(pingedLanes);
        }
      }
    }
    
    return NoLanes;
  },
  
  // 获取优先级组
  getHighestPriorityLanes(lanes) {
    // 同步优先级
    if (this.includesNonIdleWork(lanes)) {
      if ((lanes & SyncLane) !== NoLanes) {
        return SyncLane;
      }
      if ((lanes & InputContinuousLane) !== NoLanes) {
        return InputContinuousLane;
      }
      if ((lanes & DefaultLane) !== NoLanes) {
        return DefaultLane;
      }
    }
    
    // 过渡优先级
    const transitionLanes = lanes & TransitionLanes;
    if (transitionLanes !== NoLanes) {
      return this.getHighestPriorityLane(transitionLanes);
    }
    
    // 重试优先级
    const retryLanes = lanes & RetryLanes;
    if (retryLanes !== NoLanes) {
      return this.getHighestPriorityLane(retryLanes);
    }
    
    // 空闲优先级
    if ((lanes & IdleLane) !== NoLanes) {
      return IdleLane;
    }
    
    return lanes;
  },
  
  // Lane和优先级的转换
  lanesToEventPriority(lanes) {
    const lane = this.getHighestPriorityLane(lanes);
    
    if (lane === SyncLane) {
      return DiscreteEventPriority;
    }
    if ((lane & InputContinuousLane) !== NoLanes) {
      return ContinuousEventPriority;
    }
    if ((lane & DefaultLane) !== NoLanes) {
      return DefaultEventPriority;
    }
    if ((lane & (TransitionLanes | RetryLanes)) !== NoLanes) {
      return DefaultEventPriority;
    }
    if ((lane & IdleLane) !== NoLanes) {
      return IdleEventPriority;
    }
    
    return DefaultEventPriority;
  },
  
  // 合并lanes
  mergeLanes(a, b) {
    return a | b;
  },
  
  // 移除lanes
  removeLanes(set, subset) {
    return set & ~subset;
  },
  
  // 检查是否包含特定lanes
  includesSomeLane(a, b) {
    return (a & b) !== NoLanes;
  },
  
  // 检查是否是非空闲工作
  includesNonIdleWork(lanes) {
    return (lanes & NonIdleLanes) !== NoLanes;
  }
};
```

### ⏰ 过期时间与饥饿防护

```javascript
// 过期时间管理系统
class ExpirationTimeManager {
  constructor() {
    this.SYNC = MAX_SIGNED_31_BIT_INT;
    this.BATCHED = this.SYNC - 1;
    this.UNIT_SIZE = 10;
    this.MAGIC_NUMBER_OFFSET = this.BATCHED - 1;
  }
  
  // 计算过期时间
  computeExpirationTime(currentTime, expirationInMs) {
    return this.ceiling(
      currentTime + expirationInMs / this.UNIT_SIZE,
      this.bucketSizeOf(expirationInMs)
    );
  }
  
  // 批处理相同过期时间的更新
  ceiling(num, precision) {
    return (((num / precision) | 0) + 1) * precision;
  }
  
  // 获取bucket大小用于批处理
  bucketSizeOf(expirationInMs) {
    if (expirationInMs <= 120) {
      return 1;
    } else if (expirationInMs <= 480) {
      return 5;
    } else if (expirationInMs <= 1200) {
      return 25;
    } else if (expirationInMs <= 6000) {
      return 125;
    } else {
      return 625;
    }
  }
  
  // 计算不同优先级的过期时间
  computeAsyncExpiration(currentTime) {
    return this.computeExpirationTime(
      currentTime,
      LOW_PRIORITY_EXPIRATION
    );
  }
  
  computeInteractiveExpiration(currentTime) {
    return this.computeExpirationTime(
      currentTime,
      HIGH_PRIORITY_EXPIRATION
    );
  }
  
  // 检查是否过期
  isExpired(expirationTime, currentTime) {
    return expirationTime <= currentTime;
  }
  
  // 获取过期的lanes
  getExpiredLanes(root, currentTime) {
    const pendingLanes = root.pendingLanes;
    const suspendedLanes = root.suspendedLanes;
    const pingedLanes = root.pingedLanes;
    const expirationTimes = root.expirationTimes;
    
    let lanes = pendingLanes;
    let expiredLanes = NoLanes;
    
    while (lanes > 0) {
      const index = pickArbitraryLaneIndex(lanes);
      const lane = 1 << index;
      const expirationTime = expirationTimes[index];
      
      if (expirationTime === NoTimestamp) {
        // 没有设置过期时间
        if (
          (lane & suspendedLanes) === NoLanes ||
          (lane & pingedLanes) !== NoLanes
        ) {
          // 设置过期时间
          expirationTimes[index] = this.computeExpirationTime(
            currentTime,
            this.getTimeoutForLane(lane)
          );
        }
      } else if (expirationTime <= currentTime) {
        // 已过期
        root.expiredLanes |= lane;
        expiredLanes |= lane;
      }
      
      lanes &= ~lane;
    }
    
    return expiredLanes;
  }
  
  // 获取lane对应的超时时间
  getTimeoutForLane(lane) {
    if ((lane & SyncLane) !== NoLanes) {
      return SYNC;
    }
    if ((lane & InputContinuousLane) !== NoLanes) {
      return USER_BLOCKING_PRIORITY_TIMEOUT;
    }
    if ((lane & DefaultLane) !== NoLanes) {
      return NORMAL_PRIORITY_TIMEOUT;
    }
    if ((lane & TransitionLanes) !== NoLanes) {
      return LOW_PRIORITY_TIMEOUT;
    }
    if ((lane & RetryLanes) !== NoLanes) {
      return LOW_PRIORITY_TIMEOUT;
    }
    if ((lane & IdleLane) !== NoLanes) {
      return IDLE_PRIORITY_TIMEOUT;
    }
    
    return NORMAL_PRIORITY_TIMEOUT;
  }
}
```

## 💾 双缓冲机制深度解析

### 🔄 Current树与WorkInProgress树

```javascript
// Fiber双缓冲机制的核心实现
class FiberDoubleBuffering {
  constructor() {
    this.current = null;        // 当前屏幕显示的树
    this.workInProgress = null; // 正在构建的树
    this.finishedWork = null;   // 完成的工作树
  }
  
  // 创建WorkInProgress树
  createWorkInProgress(current, pendingProps) {
    let workInProgress = current.alternate;
    
    if (workInProgress === null) {
      // 首次渲染，创建新的WIP树
      workInProgress = this.createFiber(
        current.tag,
        pendingProps,
        current.key,
        current.mode
      );
      
      workInProgress.elementType = current.elementType;
      workInProgress.type = current.type;
      workInProgress.stateNode = current.stateNode;
      
      // 建立双向链接
      workInProgress.alternate = current;
      current.alternate = workInProgress;
    } else {
      // 复用现有的WIP节点
      workInProgress.pendingProps = pendingProps;
      workInProgress.type = current.type;
      
      // 重置副作用
      workInProgress.flags = NoFlags;
      workInProgress.subtreeFlags = NoFlags;
      workInProgress.deletions = null;
      
      if (enableProfilerTimer) {
        workInProgress.actualDuration = 0;
        workInProgress.actualStartTime = -1;
      }
    }
    
    // 复制状态和引用
    workInProgress.flags = current.flags & StaticMask;
    workInProgress.childLanes = current.childLanes;
    workInProgress.lanes = current.lanes;
    
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;
    
    // 复制context依赖
    workInProgress.dependencies = current.dependencies;
    
    // 复制profiler相关
    workInProgress.selfBaseDuration = current.selfBaseDuration;
    workInProgress.treeBaseDuration = current.treeBaseDuration;
    
    return workInProgress;
  }
  
  // 树的切换机制
  commitRootImpl(root, renderPriorityLevel) {
    // 准备提交阶段
    const finishedWork = root.finishedWork;
    const lanes = root.finishedLanes;
    
    if (finishedWork === null) {
      return null;
    }
    
    root.finishedWork = null;
    root.finishedLanes = NoLanes;
    
    if (finishedWork === root.current) {
      throw new Error('不能提交相同的树');
    }
    
    // 清理根节点上的lanes
    root.callbackNode = null;
    root.callbackPriority = NoLane;
    
    // 计算剩余的lanes
    let remainingLanes = this.mergeLanes(finishedWork.lanes, finishedWork.childLanes);
    this.markRootFinished(root, remainingLanes);
    
    // 如果这是根的初始渲染或者我们挂起了，清除现有的root
    if (root === workInProgressRoot) {
      workInProgressRoot = null;
      workInProgress = null;
      workInProgressRootRenderLanes = NoLanes;
    } else {
      // 这表明我们在提交阶段还有另一个root
    }
    
    // 检查是否有副作用
    if (
      (finishedWork.subtreeFlags & MutationMask) !== NoFlags ||
      (finishedWork.flags & MutationMask) !== NoFlags
    ) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalSchedulerPriority, () => {
          this.flushPassiveEffects();
          return null;
        });
      }
    }
    
    // 检查是否有副作用需要处理
    const subtreeHasEffects = 
      (finishedWork.subtreeFlags & 
        (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
      NoFlags;
    const rootHasEffect = 
      (finishedWork.flags & 
        (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
      NoFlags;
    
    if (subtreeHasEffects || rootHasEffect) {
      // 提交阶段的三个子阶段
      
      // 阶段1: before mutation
      const shouldFireAfterActiveInstanceBlur = commitBeforeMutationEffects(
        root,
        finishedWork
      );
      
      // 阶段2: mutation - 执行DOM操作
      commitMutationEffects(root, finishedWork, lanes);
      
      // 切换树的引用
      root.current = finishedWork;
      
      // 阶段3: layout - 在DOM操作后执行
      commitLayoutEffects(finishedWork, root, lanes);
      
      if (shouldFireAfterActiveInstanceBlur) {
        afterActiveInstanceBlur();
      }
      
      // 告诉调度器在帧的末尾让出
      requestPaint();
    } else {
      // 没有副作用，直接切换树
      root.current = finishedWork;
    }
    
    // 执行剩余的副作用
    const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;
    
    if (rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = false;
      rootWithPendingPassiveEffects = root;
      pendingPassiveEffectsLanes = lanes;
    }
    
    // 清理完成的工作
    this.ensureRootIsScheduled(root, now());
    
    return null;
  }
  
  // 树的比较和复用
  bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
    if (current !== null) {
      // 复用current的子树
      workInProgress.dependencies = current.dependencies;
    }
    
    // 标记跳过的lanes
    this.markSkippedUpdateLanes(workInProgress.lanes);
    
    if (!this.includesSomeLane(renderLanes, workInProgress.childLanes)) {
      // 子树也没有工作，完全跳过
      return null;
    } else {
      // 子树有工作，克隆子节点并继续
      this.cloneChildFibers(current, workInProgress);
      return workInProgress.child;
    }
  }
  
  // 克隆子节点
  cloneChildFibers(current, workInProgress) {
    if (workInProgress.child === null) {
      return;
    }
    
    let currentChild = workInProgress.child;
    let newChild = this.createWorkInProgress(currentChild, currentChild.pendingProps);
    workInProgress.child = newChild;
    
    newChild.return = workInProgress;
    while (currentChild.sibling !== null) {
      currentChild = currentChild.sibling;
      newChild = newChild.sibling = this.createWorkInProgress(
        currentChild,
        currentChild.pendingProps
      );
      newChild.return = workInProgress;
    }
    newChild.sibling = null;
  }
  
  // 内存优化：复用已删除的节点
  detachFiberAfterEffects(fiber) {
    const alternate = fiber.alternate;
    if (alternate !== null) {
      fiber.alternate = null;
      this.detachFiberAfterEffects(alternate);
    }
    
    // 清理引用以便垃圾回收
    fiber.child = null;
    fiber.deletions = null;
    fiber.sibling = null;
    fiber.stateNode = null;
    fiber.return = null;
    fiber.dependencies = null;
    fiber.memoizedProps = null;
    fiber.memoizedState = null;
    fiber.pendingProps = null;
    fiber.stateNode = null;
    fiber.updateQueue = null;
  }
}
```

## 🔍 副作用系统与提交阶段

### 🏷️ 副作用标记系统

```javascript
// Fiber副作用标记系统
const FiberFlags = {
  NoFlags: 0b00000000000000000000000000,
  
  // 生命周期和副作用
  PerformedWork: 0b00000000000000000000000001,
  Placement: 0b00000000000000000000000010,      // 插入
  Update: 0b00000000000000000000000100,         // 更新
  PlacementAndUpdate: 0b00000000000000000000000110,
  Deletion: 0b00000000000000000000001000,       // 删除
  ContentReset: 0b00000000000000000000010000,   // 内容重置
  Callback: 0b00000000000000000000100000,       // 回调
  DidCapture: 0b00000000000000000001000000,     // 错误捕获
  Ref: 0b00000000000000000010000000,            // Ref
  Snapshot: 0b00000000000000000100000000,       // getSnapshotBeforeUpdate
  Passive: 0b00000000000000001000000000,        // useEffect
  Hydrating: 0b00000000000000010000000000,      // 服务端渲染水合
  HydratingAndUpdate: 0b00000000000000010000000100,
  
  // 静态副作用 - 这些副作用不应该从子节点冒泡
  LifecycleEffectMask: 0b00000000000000001110100100,
  HostEffectMask: 0b00000000000000011111111111,
  
  // 突变副作用
  MutationMask: 0b00000000000000011110111110,
  
  // 布局副作用
  LayoutMask: 0b00000000000000000100100100,
  
  // 被动副作用
  PassiveMask: 0b00000000000000001000000000,
};

// 副作用处理器
class FiberEffectProcessor {
  constructor() {
    this.nextEffect = null;
    this.firstEffect = null;
    this.lastEffect = null;
  }
  
  // 在提交阶段执行副作用
  commitBeforeMutationEffects(root, firstChild) {
    this.nextEffect = firstChild;
    this.commitBeforeMutationEffects_begin();
    
    // 触发focus/blur事件
    const shouldFire = this.shouldFireAfterActiveInstanceBlur;
    this.shouldFireAfterActiveInstanceBlur = false;
    return shouldFire;
  }
  
  commitBeforeMutationEffects_begin() {
    while (this.nextEffect !== null) {
      const fiber = this.nextEffect;
      const child = fiber.child;
      
      if (
        (fiber.subtreeFlags & BeforeMutationMask) !== NoFlags &&
        child !== null
      ) {
        ensureCorrectReturnPointer(child, fiber);
        this.nextEffect = child;
      } else {
        this.commitBeforeMutationEffects_complete();
      }
    }
  }
  
  commitBeforeMutationEffects_complete() {
    while (this.nextEffect !== null) {
      const fiber = this.nextEffect;
      
      try {
        this.commitBeforeMutationEffectsOnFiber(fiber);
      } catch (error) {
        this.captureCommitPhaseError(fiber, fiber.return, error);
      }
      
      const sibling = fiber.sibling;
      if (sibling !== null) {
        ensureCorrectReturnPointer(sibling, fiber.return);
        this.nextEffect = sibling;
        return;
      }
      
      this.nextEffect = fiber.return;
    }
  }
  
  commitBeforeMutationEffectsOnFiber(finishedWork) {
    const current = finishedWork.alternate;
    const flags = finishedWork.flags;
    
    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      if ((flags & Deletion) !== NoFlags) {
        if (doesFiberContain(finishedWork, focusedInstanceHandle)) {
          shouldFireAfterActiveInstanceBlur = true;
          beforeActiveInstanceBlur();
        }
      }
    }
    
    if ((flags & Snapshot) !== NoFlags) {
      switch (finishedWork.tag) {
        case FunctionComponent:
        case ForwardRef:
        case SimpleMemoComponent: {
          break;
        }
        case ClassComponent: {
          if (current !== null) {
            const prevProps = current.memoizedProps;
            const prevState = current.memoizedState;
            const instance = finishedWork.stateNode;
            
            const snapshot = instance.getSnapshotBeforeUpdate(
              finishedWork.elementType === finishedWork.type
                ? prevProps
                : resolveDefaultProps(finishedWork.type, prevProps),
              prevState
            );
            
            instance.__reactInternalSnapshotBeforeUpdate = snapshot;
          }
          break;
        }
        case HostRoot: {
          if (supportsMutation) {
            const root = finishedWork.stateNode;
            clearContainer(root.containerInfo);
          }
          break;
        }
      }
    }
  }
  
  // 执行DOM变更
  commitMutationEffects(root, finishedWork, committedLanes) {
    this.inProgressLanes = committedLanes;
    this.inProgressRoot = root;
    
    this.nextEffect = finishedWork;
    this.commitMutationEffects_begin(root);
    
    this.inProgressLanes = null;
    this.inProgressRoot = null;
  }
  
  commitMutationEffects_begin(root) {
    while (this.nextEffect !== null) {
      const fiber = this.nextEffect;
      const child = fiber.child;
      
      if (
        (fiber.subtreeFlags & MutationMask) !== NoFlags &&
        child !== null
      ) {
        ensureCorrectReturnPointer(child, fiber);
        this.nextEffect = child;
      } else {
        this.commitMutationEffects_complete(root);
      }
    }
  }
  
  commitMutationEffects_complete(root) {
    while (this.nextEffect !== null) {
      const fiber = this.nextEffect;
      
      try {
        this.commitMutationEffectsOnFiber(fiber, root);
      } catch (error) {
        this.captureCommitPhaseError(fiber, fiber.return, error);
      }
      
      const sibling = fiber.sibling;
      if (sibling !== null) {
        ensureCorrectReturnPointer(sibling, fiber.return);
        this.nextEffect = sibling;
        return;
      }
      
      this.nextEffect = fiber.return;
    }
  }
  
  commitMutationEffectsOnFiber(finishedWork, root) {
    const flags = finishedWork.flags;
    
    if (flags & ContentReset) {
      this.commitResetTextContent(finishedWork);
    }
    
    if (flags & Ref) {
      const current = finishedWork.alternate;
      if (current !== null) {
        this.commitDetachRef(current);
      }
    }
    
    // 处理Placement、Update、Deletion
    const primaryFlags = flags & (Placement | Update | Deletion | Hydrating);
    
    switch (primaryFlags) {
      case Placement: {
        this.commitPlacement(finishedWork);
        finishedWork.flags &= ~Placement;
        break;
      }
      case PlacementAndUpdate: {
        // Placement
        this.commitPlacement(finishedWork);
        finishedWork.flags &= ~Placement;
        
        // Update
        const current = finishedWork.alternate;
        this.commitWork(current, finishedWork);
        break;
      }
      case Hydrating: {
        finishedWork.flags &= ~Hydrating;
        break;
      }
      case HydratingAndUpdate: {
        finishedWork.flags &= ~Hydrating;
        
        // Update
        const current = finishedWork.alternate;
        this.commitWork(current, finishedWork);
        break;
      }
      case Update: {
        const current = finishedWork.alternate;
        this.commitWork(current, finishedWork);
        break;
      }
      case Deletion: {
        this.commitDeletion(root, finishedWork);
        break;
      }
    }
  }
  
  // DOM插入操作
  commitPlacement(finishedWork) {
    const parentFiber = this.getHostParentFiber(finishedWork);
    
    switch (parentFiber.tag) {
      case HostComponent: {
        const parent = parentFiber.stateNode;
        if (parentFiber.flags & ContentReset) {
          resetTextContent(parent);
          parentFiber.flags &= ~ContentReset;
        }
        
        const before = this.getHostSibling(finishedWork);
        this.insertOrAppendPlacementNode(finishedWork, before, parent);
        break;
      }
      case HostRoot:
      case HostPortal: {
        const parent = parentFiber.stateNode.containerInfo;
        const before = this.getHostSibling(finishedWork);
        this.insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
        break;
      }
    }
  }
  
  // DOM更新操作
  commitWork(current, finishedWork) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case MemoComponent:
      case SimpleMemoComponent: {
        // 这些组件类型可能有useLayoutEffect
        this.commitHookEffectListUnmount(
          HookLayout | HookHasEffect,
          finishedWork,
          finishedWork.return
        );
        this.commitHookEffectListMount(
          HookLayout | HookHasEffect,
          finishedWork
        );
        
        // 调度useEffect
        this.schedulePassiveEffects(finishedWork);
        return;
      }
      case ClassComponent: {
        return;
      }
      case HostComponent: {
        const instance = finishedWork.stateNode;
        if (instance != null) {
          const newProps = finishedWork.memoizedProps;
          const oldProps = current !== null ? current.memoizedProps : newProps;
          const type = finishedWork.type;
          const updatePayload = finishedWork.updateQueue;
          finishedWork.updateQueue = null;
          
          if (updatePayload !== null) {
            this.commitUpdate(
              instance,
              updatePayload,
              type,
              oldProps,
              newProps,
              finishedWork
            );
          }
        }
        return;
      }
      case HostText: {
        const textInstance = finishedWork.stateNode;
        const newText = finishedWork.memoizedProps;
        const oldText = current !== null ? current.memoizedProps : newText;
        this.commitTextUpdate(textInstance, oldText, newText);
        return;
      }
    }
  }
  
  // DOM删除操作
  commitDeletion(root, current) {
    if (supportsMutation) {
      this.unmountHostComponents(root, current);
    } else {
      this.commitNestedUnmounts(root, current);
    }
    
    const alternate = current.alternate;
    this.detachFiberMutation(current);
    if (alternate !== null) {
      this.detachFiberMutation(alternate);
    }
  }
}
```

## 🚀 性能优化技巧

### 📊 性能监控与调试

```javascript
// Fiber性能监控工具
class FiberPerformanceMonitor {
  constructor() {
    this.performanceMarks = new Map();
    this.renderTimes = [];
    this.commitTimes = [];
    this.isEnabled = typeof performance !== 'undefined';
  }
  
  // 监控渲染性能
  markRenderStart(fiber) {
    if (!this.isEnabled) return;
    
    const markName = `render-start-${fiber.type?.name || fiber.tag}`;
    performance.mark(markName);
    this.performanceMarks.set(fiber, markName);
  }
  
  markRenderEnd(fiber) {
    if (!this.isEnabled) return;
    
    const startMark = this.performanceMarks.get(fiber);
    if (startMark) {
      const endMarkName = `render-end-${fiber.type?.name || fiber.tag}`;
      performance.mark(endMarkName);
      
      const measureName = `render-${fiber.type?.name || fiber.tag}`;
      performance.measure(measureName, startMark, endMarkName);
      
      // 记录渲染时间
      const entries = performance.getEntriesByName(measureName);
      if (entries.length > 0) {
        this.renderTimes.push({
          component: fiber.type?.name || fiber.tag,
          duration: entries[entries.length - 1].duration,
          timestamp: Date.now()
        });
      }
      
      this.performanceMarks.delete(fiber);
    }
  }
  
  // 监控提交性能
  markCommitStart() {
    if (!this.isEnabled) return;
    performance.mark('commit-start');
  }
  
  markCommitEnd() {
    if (!this.isEnabled) return;
    performance.mark('commit-end');
    performance.measure('commit', 'commit-start', 'commit-end');
    
    const entries = performance.getEntriesByName('commit');
    if (entries.length > 0) {
      this.commitTimes.push({
        duration: entries[entries.length - 1].duration,
        timestamp: Date.now()
      });
    }
  }
  
  // 分析性能数据
  getPerformanceReport() {
    const avgRenderTime = this.renderTimes.length > 0
      ? this.renderTimes.reduce((sum, entry) => sum + entry.duration, 0) / this.renderTimes.length
      : 0;
    
    const avgCommitTime = this.commitTimes.length > 0
      ? this.commitTimes.reduce((sum, entry) => sum + entry.duration, 0) / this.commitTimes.length
      : 0;
    
    // 找出最慢的组件
    const slowestComponents = this.renderTimes
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
    
    return {
      averageRenderTime: avgRenderTime,
      averageCommitTime: avgCommitTime,
      totalRenders: this.renderTimes.length,
      totalCommits: this.commitTimes.length,
      slowestComponents,
      recommendations: this.generateRecommendations(avgRenderTime, slowestComponents)
    };
  }
  
  generateRecommendations(avgRenderTime, slowestComponents) {
    const recommendations = [];
    
    if (avgRenderTime > 16) {
      recommendations.push({
        type: 'performance',
        message: '平均渲染时间超过16ms，可能导致掉帧',
        solution: '考虑使用React.memo()、useMemo()或代码分割'
      });
    }
    
    slowestComponents.forEach(component => {
      if (component.duration > 5) {
        recommendations.push({
          type: 'component',
          component: component.component,
          message: `组件${component.component}渲染时间为${component.duration.toFixed(2)}ms`,
          solution: '考虑优化组件逻辑或使用记忆化'
        });
      }
    });
    
    return recommendations;
  }
  
  // 内存使用监控
  monitorMemoryUsage() {
    if (typeof performance.memory !== 'undefined') {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        usage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }
  
  // Fiber树分析
  analyzeFiberTree(rootFiber) {
    const analysis = {
      totalNodes: 0,
      maxDepth: 0,
      nodeTypes: new Map(),
      largestSubtrees: []
    };
    
    this.traverseFiberTree(rootFiber, analysis, 0);
    
    return {
      ...analysis,
      nodeTypes: Array.from(analysis.nodeTypes.entries()),
      averageDepth: analysis.totalNodes > 0 ? analysis.totalDepth / analysis.totalNodes : 0
    };
  }
  
  traverseFiberTree(fiber, analysis, depth) {
    if (!fiber) return;
    
    analysis.totalNodes++;
    analysis.maxDepth = Math.max(analysis.maxDepth, depth);
    
    // 统计节点类型
    const typeName = fiber.type?.name || WorkTagNames[fiber.tag] || 'Unknown';
    analysis.nodeTypes.set(typeName, (analysis.nodeTypes.get(typeName) || 0) + 1);
    
    // 分析子树
    let child = fiber.child;
    let childCount = 0;
    while (child) {
      childCount++;
      this.traverseFiberTree(child, analysis, depth + 1);
      child = child.sibling;
    }
    
    // 记录大型子树
    if (childCount > 20) {
      analysis.largestSubtrees.push({
        component: typeName,
        children: childCount,
        depth: depth
      });
    }
  }
}
```

## 🎯 总结

### 🌟 Fiber架构的核心价值

1. **可中断渲染** - 通过时间切片避免长任务阻塞
2. **优先级调度** - 重要更新优先处理，提升用户体验
3. **错误边界** - 局部错误隔离，提高应用稳定性
4. **并发基础** - 为React 18并发特性提供底层支持

### 🔑 关键技术点

- **Fiber节点结构** - 链表形式的虚拟DOM，支持可中断遍历
- **双缓冲机制** - Current和WorkInProgress树的协作
- **Lane优先级模型** - 精细化的优先级控制
- **副作用系统** - 统一的DOM操作和生命周期管理

### 📈 性能优化要点

- **时间切片** - 避免长时间阻塞主线程
- **优先级调度** - 确保重要更新及时响应
- **内存管理** - 节点复用和及时清理
- **批处理** - 合并相同优先级的更新

Fiber架构是React现代化的基石，理解其内部机制对于掌握React性能优化和并发特性至关重要。通过深入源码分析，我们能够更好地利用React的能力，构建高性能的用户界面。

---

*深入理解Fiber，掌握React的核心引擎*
