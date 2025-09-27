# 调度器原理解析

> ⏰ 深入React Scheduler机制，解密时间切片与优先级调度的底层实现

## 📋 概述

React Scheduler是React并发特性的核心基础设施，负责任务的优先级调度和时间切片管理。本文将深入分析调度器的实现原理，从任务队列到时间切片，全面解析React如何实现可中断的渲染机制。

### 🎯 核心价值

- **时间切片** - 将长任务分解为可中断的小任务
- **优先级调度** - 根据任务重要性进行智能调度
- **任务协调** - 在浏览器空闲时间执行非紧急任务
- **响应性保证** - 确保用户交互的及时响应

## ⏰ 时间切片机制

### 🕐 帧率与时间切片

```javascript
// React Scheduler的时间切片实现
class TimeSlicing {
  constructor() {
    this.frameInterval = 5; // 5ms时间片
    this.maxYieldInterval = 300; // 最大让步间隔
    this.needsPaint = false;
    this.isMessageLoopRunning = false;
    this.scheduledHostCallback = null;
    this.taskTimeoutID = -1;
    this.yieldInterval = 5;
    this.deadline = 0;
    this.maxYieldInterval = 300;
    this.needsPaint = false;
  }
  
  // 核心调度函数
  scheduleCallback(priorityLevel, callback, options = {}) {
    const currentTime = this.getCurrentTime();
    
    let startTime;
    if (typeof options.delay === 'number' && options.delay > 0) {
      startTime = currentTime + options.delay;
    } else {
      startTime = currentTime;
    }
    
    let timeout;
    switch (priorityLevel) {
      case ImmediatePriority:
        timeout = IMMEDIATE_PRIORITY_TIMEOUT; // -1
        break;
      case UserBlockingPriority:
        timeout = USER_BLOCKING_PRIORITY_TIMEOUT; // 250ms
        break;
      case IdlePriority:
        timeout = IDLE_PRIORITY_TIMEOUT; // 1073741823ms
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
    
    const newTask = {
      id: this.taskIdCounter++,
      callback,
      priorityLevel,
      startTime,
      expirationTime,
      sortIndex: -1,
    };
    
    if (startTime > currentTime) {
      // 延迟任务
      newTask.sortIndex = startTime;
      this.push(this.timerQueue, newTask);
      
      if (this.peek(this.taskQueue) === null && newTask === this.peek(this.timerQueue)) {
        if (this.isHostTimeoutScheduled) {
          this.cancelHostTimeout();
        } else {
          this.isHostTimeoutScheduled = true;
        }
        this.requestHostTimeout(this.handleTimeout, startTime - currentTime);
      }
    } else {
      // 立即任务
      newTask.sortIndex = expirationTime;
      this.push(this.taskQueue, newTask);
      
      if (!this.isHostCallbackScheduled && !this.isPerformingWork) {
        this.isHostCallbackScheduled = true;
        this.requestHostCallback(this.flushWork);
      }
    }
    
    return newTask;
  }
  
  // 工作循环 - 时间切片的核心
  workLoop(hasTimeRemaining, initialTime) {
    let currentTime = initialTime;
    this.advanceTimers(currentTime);
    this.currentTask = this.peek(this.taskQueue);
    
    while (this.currentTask !== null) {
      if (
        this.currentTask.expirationTime > currentTime &&
        (!hasTimeRemaining || this.shouldYieldToHost())
      ) {
        // 时间片用完或需要让出控制权
        break;
      }
      
      const callback = this.currentTask.callback;
      if (typeof callback === 'function') {
        this.currentTask.callback = null;
        this.currentPriorityLevel = this.currentTask.priorityLevel;
        
        const didUserCallbackTimeout = this.currentTask.expirationTime <= currentTime;
        
        const continuationCallback = callback(didUserCallbackTimeout);
        currentTime = this.getCurrentTime();
        
        if (typeof continuationCallback === 'function') {
          // 任务返回了continuation，继续执行
          this.currentTask.callback = continuationCallback;
        } else {
          // 任务完成，移除
          if (this.currentTask === this.peek(this.taskQueue)) {
            this.pop(this.taskQueue);
          }
        }
        
        this.advanceTimers(currentTime);
      } else {
        this.pop(this.taskQueue);
      }
      
      this.currentTask = this.peek(this.taskQueue);
    }
    
    // 返回是否还有更多工作
    if (this.currentTask !== null) {
      return true;
    } else {
      const firstTimer = this.peek(this.timerQueue);
      if (firstTimer !== null) {
        this.requestHostTimeout(this.handleTimeout, firstTimer.startTime - currentTime);
      }
      return false;
    }
  }
  
  // 决定是否让出控制权
  shouldYieldToHost() {
    const timeElapsed = this.getCurrentTime() - this.startTime;
    
    if (timeElapsed < this.frameInterval) {
      // 时间片还没用完
      return false;
    }
    
    // 检查是否需要绘制
    if (this.enableIsInputPending) {
      if (this.needsPaint || this.isInputPending()) {
        return true;
      }
    }
    
    return true;
  }
  
  // 高精度时间获取
  getCurrentTime() {
    if (typeof performance === 'object' && typeof performance.now === 'function') {
      return performance.now();
    } else {
      return Date.now();
    }
  }
  
  // 请求宿主回调
  requestHostCallback(callback) {
    this.scheduledHostCallback = callback;
    
    if (!this.isMessageLoopRunning) {
      this.isMessageLoopRunning = true;
      this.schedulePerformWorkUntilDeadline();
    }
  }
  
  // 调度工作直到截止时间
  schedulePerformWorkUntilDeadline() {
    if (typeof setImmediate === 'function') {
      // Node.js 环境
      setImmediate(this.performWorkUntilDeadline);
    } else if (typeof MessageChannel !== 'undefined') {
      // 浏览器环境使用MessageChannel
      if (this.messageChannel === null) {
        this.messageChannel = new MessageChannel();
        this.port1 = this.messageChannel.port1;
        this.port2 = this.messageChannel.port2;
        this.port1.onmessage = this.performWorkUntilDeadline;
      }
      this.port2.postMessage(null);
    } else {
      // 降级到setTimeout
      setTimeout(this.performWorkUntilDeadline, 0);
    }
  }
  
  // 执行工作直到截止时间
  performWorkUntilDeadline = () => {
    if (this.scheduledHostCallback !== null) {
      const currentTime = this.getCurrentTime();
      
      // 设置截止时间
      this.deadline = currentTime + this.yieldInterval;
      this.hasTimeRemaining = true;
      
      try {
        const hasMoreWork = this.scheduledHostCallback(true, currentTime);
        
        if (!hasMoreWork) {
          this.isMessageLoopRunning = false;
          this.scheduledHostCallback = null;
        } else {
          // 还有更多工作，继续调度
          this.schedulePerformWorkUntilDeadline();
        }
      } catch (error) {
        // 错误处理
        this.schedulePerformWorkUntilDeadline();
        throw error;
      }
    } else {
      this.isMessageLoopRunning = false;
    }
    
    this.needsPaint = false;
  };
}
```

### 🎛️ 动态时间片调整

```javascript
// 自适应时间切片机制
class AdaptiveTimeSlicing {
  constructor() {
    this.baseFrameInterval = 5; // 基础时间片5ms
    this.currentFrameInterval = 5;
    this.performanceHistory = [];
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.frameDropCount = 0;
    this.lastFrameTime = 0;
  }
  
  // 检测设备性能
  detectDeviceCapabilities() {
    return {
      // 硬件并发数
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      // 设备内存
      deviceMemory: navigator.deviceMemory || 4,
      // 是否为移动设备
      isMobile: /Mobi|Android/i.test(navigator.userAgent),
      // 是否支持高精度时间
      supportsHighResTime: typeof performance !== 'undefined' && 
                          typeof performance.now === 'function',
      // 网络连接类型
      connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection
    };
  }
  
  // 根据性能动态调整时间片
  adjustTimeSlice() {
    const recentPerformance = this.getRecentPerformance();
    const deviceScore = this.calculateDeviceScore();
    const networkScore = this.calculateNetworkScore();
    
    // 综合评分
    const overallScore = (recentPerformance + deviceScore + networkScore) / 3;
    
    if (overallScore > 0.8) {
      // 性能良好，可以使用较长的时间片
      this.currentFrameInterval = Math.min(this.baseFrameInterval * 2, 16);
    } else if (overallScore > 0.6) {
      // 性能一般，使用标准时间片
      this.currentFrameInterval = this.baseFrameInterval;
    } else {
      // 性能较差，使用较短的时间片
      this.currentFrameInterval = Math.max(this.baseFrameInterval / 2, 1);
    }
    
    // 移动设备特殊处理
    if (this.deviceCapabilities.isMobile) {
      this.currentFrameInterval = Math.max(this.currentFrameInterval * 0.8, 1);
    }
  }
  
  getRecentPerformance() {
    if (this.performanceHistory.length === 0) return 0.5;
    
    const recent = this.performanceHistory.slice(-10);
    const avgFrameTime = recent.reduce((sum, time) => sum + time, 0) / recent.length;
    
    // 理想帧时间是16.67ms (60fps)
    const idealFrameTime = 16.67;
    return Math.max(0, Math.min(1, idealFrameTime / avgFrameTime));
  }
  
  calculateDeviceScore() {
    let score = 0.5; // 基础分数
    
    // CPU核心数评分
    if (this.deviceCapabilities.hardwareConcurrency >= 8) {
      score += 0.3;
    } else if (this.deviceCapabilities.hardwareConcurrency >= 4) {
      score += 0.2;
    } else {
      score += 0.1;
    }
    
    // 内存评分
    if (this.deviceCapabilities.deviceMemory >= 8) {
      score += 0.2;
    } else if (this.deviceCapabilities.deviceMemory >= 4) {
      score += 0.1;
    }
    
    return Math.min(1, score);
  }
  
  calculateNetworkScore() {
    const connection = this.deviceCapabilities.connection;
    if (!connection) return 0.5;
    
    const effectiveType = connection.effectiveType;
    const downlink = connection.downlink;
    
    let score = 0.5;
    
    // 网络类型评分
    switch (effectiveType) {
      case '4g':
        score += 0.3;
        break;
      case '3g':
        score += 0.2;
        break;
      case '2g':
        score += 0.1;
        break;
      case 'slow-2g':
        score += 0.05;
        break;
    }
    
    // 下载速度评分
    if (downlink >= 10) {
      score += 0.2;
    } else if (downlink >= 5) {
      score += 0.1;
    }
    
    return Math.min(1, score);
  }
  
  // 记录帧性能
  recordFramePerformance(frameTime) {
    this.performanceHistory.push(frameTime);
    
    // 保持历史记录在合理范围内
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }
    
    // 检测掉帧
    if (frameTime > 16.67) {
      this.frameDropCount++;
    }
    
    // 定期调整时间片
    if (this.performanceHistory.length % 10 === 0) {
      this.adjustTimeSlice();
    }
  }
  
  // 获取当前推荐的时间片大小
  getCurrentTimeSlice() {
    return this.currentFrameInterval;
  }
  
  // 获取性能统计
  getPerformanceStats() {
    const recentFrames = this.performanceHistory.slice(-60); // 最近60帧
    const avgFrameTime = recentFrames.length > 0 
      ? recentFrames.reduce((sum, time) => sum + time, 0) / recentFrames.length 
      : 0;
    
    return {
      currentTimeSlice: this.currentFrameInterval,
      averageFrameTime: avgFrameTime.toFixed(2),
      frameDropRate: this.performanceHistory.length > 0 
        ? (this.frameDropCount / this.performanceHistory.length * 100).toFixed(2) + '%'
        : '0%',
      deviceScore: this.calculateDeviceScore().toFixed(2),
      networkScore: this.calculateNetworkScore().toFixed(2),
      totalFrames: this.performanceHistory.length
    };
  }
}
```

## 🏆 优先级系统

### 📊 优先级分类与处理

```javascript
// React优先级系统的详细实现
class PrioritySystem {
  constructor() {
    // 优先级常量
    this.priorities = {
      ImmediatePriority: 1,      // 立即执行 (事件处理)
      UserBlockingPriority: 2,   // 用户阻塞 (用户输入)
      NormalPriority: 3,         // 正常优先级 (网络请求)
      LowPriority: 4,            // 低优先级 (analytics)
      IdlePriority: 5,           // 空闲优先级 (预加载)
    };
    
    // 超时时间配置
    this.timeouts = {
      [this.priorities.ImmediatePriority]: -1,          // 立即过期
      [this.priorities.UserBlockingPriority]: 250,      // 250ms
      [this.priorities.NormalPriority]: 5000,           // 5s
      [this.priorities.LowPriority]: 10000,             // 10s
      [this.priorities.IdlePriority]: 1073741823,       // 永不过期
    };
    
    this.taskQueue = new MinHeap(this.compareTasks.bind(this));
    this.timerQueue = new MinHeap(this.compareTimers.bind(this));
    this.isPerformingWork = false;
    this.currentPriorityLevel = this.priorities.NormalPriority;
  }
  
  // 任务比较函数 - 用于优先级队列
  compareTasks(a, b) {
    // 首先按sortIndex排序（通常是expirationTime）
    const diff = a.sortIndex - b.sortIndex;
    if (diff !== 0) return diff;
    
    // sortIndex相同时，按id排序（保证稳定性）
    return a.id - b.id;
  }
  
  compareTimers(a, b) {
    const diff = a.startTime - b.startTime;
    if (diff !== 0) return diff;
    return a.id - b.id;
  }
  
  // 根据优先级计算过期时间
  calculateExpirationTime(currentTime, priorityLevel) {
    const timeout = this.timeouts[priorityLevel];
    
    if (timeout === -1) {
      // 立即优先级，设置为已过期
      return currentTime - 1;
    }
    
    return currentTime + timeout;
  }
  
  // 饥饿防护机制
  preventStarvation() {
    const currentTime = this.getCurrentTime();
    const starvationThreshold = 5000; // 5秒饥饿阈值
    
    // 检查低优先级任务是否被饿死
    let task = this.taskQueue.peek();
    while (task) {
      const age = currentTime - task.startTime;
      
      if (age > starvationThreshold && task.priorityLevel > this.priorities.UserBlockingPriority) {
        // 提升优先级防止饥饿
        task.priorityLevel = this.priorities.UserBlockingPriority;
        task.expirationTime = this.calculateExpirationTime(currentTime, task.priorityLevel);
        task.sortIndex = task.expirationTime;
        
        console.warn(`Task ${task.id} priority elevated due to starvation`);
      }
      
      task = this.getNextTask(task);
    }
    
    // 重新排序队列
    this.taskQueue.sort();
  }
  
  // 动态优先级调整
  adjustPriorityDynamically(task, context) {
    const { userInteracting, networkCondition, batteryLevel } = context;
    
    let adjustedPriority = task.originalPriority || task.priorityLevel;
    
    // 用户正在交互时，提升相关任务优先级
    if (userInteracting && this.isUserRelatedTask(task)) {
      adjustedPriority = Math.min(adjustedPriority, this.priorities.UserBlockingPriority);
    }
    
    // 网络条件差时，降低网络相关任务优先级
    if (networkCondition === 'slow' && this.isNetworkTask(task)) {
      adjustedPriority = Math.max(adjustedPriority, this.priorities.LowPriority);
    }
    
    // 电池电量低时，降低非关键任务优先级
    if (batteryLevel < 0.2 && !this.isCriticalTask(task)) {
      adjustedPriority = Math.max(adjustedPriority, this.priorities.LowPriority);
    }
    
    if (adjustedPriority !== task.priorityLevel) {
      this.updateTaskPriority(task, adjustedPriority);
    }
  }
  
  updateTaskPriority(task, newPriority) {
    const currentTime = this.getCurrentTime();
    
    task.priorityLevel = newPriority;
    task.expirationTime = this.calculateExpirationTime(currentTime, newPriority);
    task.sortIndex = task.expirationTime;
    
    // 重新排序队列
    this.taskQueue.sort();
  }
  
  isUserRelatedTask(task) {
    return task.type === 'user-interaction' || 
           task.type === 'animation' ||
           task.category === 'ui-update';
  }
  
  isNetworkTask(task) {
    return task.type === 'fetch' || 
           task.type === 'xhr' ||
           task.category === 'network';
  }
  
  isCriticalTask(task) {
    return task.priorityLevel <= this.priorities.UserBlockingPriority ||
           task.critical === true;
  }
  
  // 批量优先级处理
  batchPriorityUpdates(updates) {
    // 按优先级分组
    const priorityGroups = new Map();
    
    for (const update of updates) {
      const priority = this.determinePriority(update);
      
      if (!priorityGroups.has(priority)) {
        priorityGroups.set(priority, []);
      }
      
      priorityGroups.get(priority).push(update);
    }
    
    // 按优先级顺序处理
    const sortedPriorities = Array.from(priorityGroups.keys()).sort((a, b) => a - b);
    
    for (const priority of sortedPriorities) {
      const groupUpdates = priorityGroups.get(priority);
      this.processPriorityGroup(priority, groupUpdates);
    }
  }
  
  determinePriority(update) {
    // 事件类型映射到优先级
    const eventPriorityMap = {
      'click': this.priorities.ImmediatePriority,
      'keydown': this.priorities.ImmediatePriority,
      'focus': this.priorities.ImmediatePriority,
      'scroll': this.priorities.UserBlockingPriority,
      'mousemove': this.priorities.UserBlockingPriority,
      'resize': this.priorities.UserBlockingPriority,
      'network': this.priorities.NormalPriority,
      'timer': this.priorities.NormalPriority,
      'analytics': this.priorities.LowPriority,
      'prefetch': this.priorities.IdlePriority,
    };
    
    return eventPriorityMap[update.type] || this.priorities.NormalPriority;
  }
  
  processPriorityGroup(priority, updates) {
    const batchProcessor = {
      priority,
      updates,
      processed: 0,
      
      process() {
        const startTime = performance.now();
        const timeSlice = this.getTimeSliceForPriority(priority);
        
        while (this.processed < this.updates.length) {
          const update = this.updates[this.processed];
          this.processUpdate(update);
          this.processed++;
          
          // 检查时间片
          if (performance.now() - startTime > timeSlice) {
            // 时间片用完，让出控制权
            setTimeout(() => this.process(), 0);
            return;
          }
        }
      },
      
      processUpdate(update) {
        // 实际处理更新逻辑
        update.callback?.();
      }
    };
    
    batchProcessor.process();
  }
  
  getTimeSliceForPriority(priority) {
    // 不同优先级使用不同的时间片大小
    const timeSlices = {
      [this.priorities.ImmediatePriority]: 0,     // 不限制时间
      [this.priorities.UserBlockingPriority]: 5,  // 5ms
      [this.priorities.NormalPriority]: 10,       // 10ms
      [this.priorities.LowPriority]: 25,          // 25ms
      [this.priorities.IdlePriority]: 50,         // 50ms
    };
    
    return timeSlices[priority] || 10;
  }
}
```

### 🎯 优先级继承与传播

```javascript
// 优先级继承机制
class PriorityInheritance {
  constructor() {
    this.inheritanceTree = new Map();
    this.priorityLocks = new Map();
  }
  
  // 建立优先级继承关系
  establishInheritance(parentTask, childTask) {
    if (!this.inheritanceTree.has(parentTask.id)) {
      this.inheritanceTree.set(parentTask.id, {
        task: parentTask,
        children: new Set(),
        inheritedPriority: parentTask.priorityLevel
      });
    }
    
    const parentNode = this.inheritanceTree.get(parentTask.id);
    parentNode.children.add(childTask.id);
    
    // 子任务继承父任务的优先级
    if (childTask.priorityLevel > parentTask.priorityLevel) {
      this.propagatePriority(childTask, parentTask.priorityLevel);
    }
    
    // 设置子任务的继承关系
    this.inheritanceTree.set(childTask.id, {
      task: childTask,
      parent: parentTask.id,
      children: new Set(),
      inheritedPriority: Math.min(childTask.priorityLevel, parentTask.priorityLevel)
    });
  }
  
  // 优先级传播
  propagatePriority(task, newPriority) {
    const node = this.inheritanceTree.get(task.id);
    if (!node) return;
    
    const oldPriority = node.inheritedPriority;
    
    if (newPriority < oldPriority) {
      // 优先级提升
      node.inheritedPriority = newPriority;
      task.priorityLevel = newPriority;
      
      // 向下传播到子任务
      for (const childId of node.children) {
        const childNode = this.inheritanceTree.get(childId);
        if (childNode && childNode.inheritedPriority > newPriority) {
          this.propagatePriority(childNode.task, newPriority);
        }
      }
      
      // 向上传播到父任务（优先级倒置处理）
      if (node.parent) {
        const parentNode = this.inheritanceTree.get(node.parent);
        if (parentNode && parentNode.inheritedPriority > newPriority) {
          this.propagatePriority(parentNode.task, newPriority);
        }
      }
    }
  }
  
  // 优先级锁定机制
  lockPriority(task, reason) {
    this.priorityLocks.set(task.id, {
      task,
      lockedPriority: task.priorityLevel,
      reason,
      timestamp: Date.now()
    });
  }
  
  unlockPriority(task) {
    this.priorityLocks.delete(task.id);
  }
  
  // 检查优先级是否被锁定
  isPriorityLocked(task) {
    return this.priorityLocks.has(task.id);
  }
  
  // 优先级倒置检测与处理
  detectPriorityInversion() {
    const inversions = [];
    
    for (const [taskId, node] of this.inheritanceTree) {
      if (node.parent) {
        const parentNode = this.inheritanceTree.get(node.parent);
        
        if (parentNode && node.inheritedPriority < parentNode.inheritedPriority) {
          // 检测到优先级倒置
          inversions.push({
            parent: parentNode.task,
            child: node.task,
            parentPriority: parentNode.inheritedPriority,
            childPriority: node.inheritedPriority
          });
        }
      }
    }
    
    // 处理优先级倒置
    for (const inversion of inversions) {
      this.resolvePriorityInversion(inversion);
    }
    
    return inversions;
  }
  
  resolvePriorityInversion(inversion) {
    // 提升父任务优先级以解决倒置
    const { parent, child } = inversion;
    
    console.warn(`Priority inversion detected: parent ${parent.id} (${parent.priorityLevel}) < child ${child.id} (${child.priorityLevel})`);
    
    // 临时提升父任务优先级
    this.propagatePriority(parent, child.priorityLevel);
    
    // 记录优先级倒置事件
    this.recordInversionEvent(inversion);
  }
  
  recordInversionEvent(inversion) {
    // 记录优先级倒置事件用于分析
    const event = {
      type: 'priority-inversion',
      timestamp: Date.now(),
      parent: {
        id: inversion.parent.id,
        priority: inversion.parentPriority
      },
      child: {
        id: inversion.child.id,
        priority: inversion.childPriority
      }
    };
    
    // 发送到监控系统
    this.reportToMonitoring(event);
  }
  
  reportToMonitoring(event) {
    // 发送事件到监控系统
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('react-scheduler-event', event);
    }
  }
  
  // 清理继承关系
  cleanupInheritance(task) {
    const node = this.inheritanceTree.get(task.id);
    if (!node) return;
    
    // 移除与父任务的关系
    if (node.parent) {
      const parentNode = this.inheritanceTree.get(node.parent);
      if (parentNode) {
        parentNode.children.delete(task.id);
      }
    }
    
    // 重新分配子任务的父级关系
    for (const childId of node.children) {
      const childNode = this.inheritanceTree.get(childId);
      if (childNode) {
        if (node.parent) {
          // 将子任务转移给祖父任务
          childNode.parent = node.parent;
          const grandparentNode = this.inheritanceTree.get(node.parent);
          if (grandparentNode) {
            grandparentNode.children.add(childId);
          }
        } else {
          // 子任务变为根任务
          delete childNode.parent;
        }
      }
    }
    
    // 移除任务节点
    this.inheritanceTree.delete(task.id);
    this.priorityLocks.delete(task.id);
  }
}
```

## 🔄 任务队列管理

### 📦 高效队列实现

```javascript
// 高性能任务队列实现
class AdvancedTaskQueue {
  constructor() {
    this.heaps = new Map(); // 按优先级分组的最小堆
    this.totalSize = 0;
    this.sequenceNumber = 0;
  }
  
  // 插入任务
  push(task) {
    const priority = task.priorityLevel;
    
    if (!this.heaps.has(priority)) {
      this.heaps.set(priority, new MinHeap((a, b) => {
        // 首先按过期时间排序
        const expirationDiff = a.expirationTime - b.expirationTime;
        if (expirationDiff !== 0) return expirationDiff;
        
        // 过期时间相同时按序列号排序（保证FIFO）
        return a.sequenceNumber - b.sequenceNumber;
      }));
    }
    
    task.sequenceNumber = this.sequenceNumber++;
    this.heaps.get(priority).push(task);
    this.totalSize++;
  }
  
  // 获取最高优先级的任务
  peek() {
    let highestPriorityTask = null;
    let highestPriority = Infinity;
    
    for (const [priority, heap] of this.heaps) {
      if (heap.size() > 0 && priority < highestPriority) {
        highestPriority = priority;
        highestPriorityTask = heap.peek();
      }
    }
    
    return highestPriorityTask;
  }
  
  // 移除最高优先级的任务
  pop() {
    let taskToRemove = null;
    let heapToRemoveFrom = null;
    let highestPriority = Infinity;
    
    for (const [priority, heap] of this.heaps) {
      if (heap.size() > 0 && priority < highestPriority) {
        highestPriority = priority;
        taskToRemove = heap.peek();
        heapToRemoveFrom = heap;
      }
    }
    
    if (taskToRemove && heapToRemoveFrom) {
      heapToRemoveFrom.pop();
      this.totalSize--;
      
      // 清理空的堆
      if (heapToRemoveFrom.size() === 0) {
        this.heaps.delete(highestPriority);
      }
    }
    
    return taskToRemove;
  }
  
  // 移除特定任务
  remove(taskToRemove) {
    for (const [priority, heap] of this.heaps) {
      if (heap.remove(taskToRemove)) {
        this.totalSize--;
        
        if (heap.size() === 0) {
          this.heaps.delete(priority);
        }
        
        return true;
      }
    }
    
    return false;
  }
  
  // 获取队列大小
  size() {
    return this.totalSize;
  }
  
  // 清空队列
  clear() {
    this.heaps.clear();
    this.totalSize = 0;
  }
  
  // 获取队列统计信息
  getStats() {
    const stats = {
      totalTasks: this.totalSize,
      priorityDistribution: {},
      oldestTask: null,
      newestTask: null
    };
    
    let oldestTime = Infinity;
    let newestTime = 0;
    
    for (const [priority, heap] of this.heaps) {
      const tasks = heap.toArray();
      stats.priorityDistribution[priority] = tasks.length;
      
      for (const task of tasks) {
        if (task.startTime < oldestTime) {
          oldestTime = task.startTime;
          stats.oldestTask = task;
        }
        
        if (task.startTime > newestTime) {
          newestTime = task.startTime;
          stats.newestTask = task;
        }
      }
    }
    
    return stats;
  }
}

// 最小堆实现
class MinHeap {
  constructor(compareFn) {
    this.compare = compareFn || ((a, b) => a - b);
    this.heap = [];
  }
  
  push(value) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }
  
  peek() {
    return this.heap[0];
  }
  
  pop() {
    if (this.heap.length === 0) return undefined;
    
    const result = this.heap[0];
    const end = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }
    
    return result;
  }
  
  remove(value) {
    const index = this.heap.indexOf(value);
    if (index === -1) return false;
    
    const end = this.heap.pop();
    
    if (index < this.heap.length) {
      this.heap[index] = end;
      
      if (this.compare(end, value) < 0) {
        this.bubbleUp(index);
      } else {
        this.bubbleDown(index);
      }
    }
    
    return true;
  }
  
  size() {
    return this.heap.length;
  }
  
  toArray() {
    return [...this.heap];
  }
  
  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) {
        break;
      }
      
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }
  
  bubbleDown(index) {
    while (true) {
      let minIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      
      if (leftChild < this.heap.length && 
          this.compare(this.heap[leftChild], this.heap[minIndex]) < 0) {
        minIndex = leftChild;
      }
      
      if (rightChild < this.heap.length && 
          this.compare(this.heap[rightChild], this.heap[minIndex]) < 0) {
        minIndex = rightChild;
      }
      
      if (minIndex === index) break;
      
      this.swap(index, minIndex);
      index = minIndex;
    }
  }
  
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}
```

## 🔍 调度器监控与调试

### 📊 性能监控系统

```javascript
// 调度器性能监控
class SchedulerMonitor {
  constructor() {
    this.metrics = {
      taskExecutionTimes: new Map(),
      priorityStats: new Map(),
      queueWaitTimes: [],
      frameDrops: 0,
      totalTasks: 0,
      completedTasks: 0
    };
    
    this.isEnabled = true;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
  }
  
  // 监控任务执行
  monitorTaskExecution(task, executionFn) {
    if (!this.isEnabled) return executionFn();
    
    const startTime = performance.now();
    const taskInfo = {
      id: task.id,
      priority: task.priorityLevel,
      startTime,
      queueTime: startTime - task.startTime
    };
    
    // 记录队列等待时间
    this.metrics.queueWaitTimes.push(taskInfo.queueTime);
    
    try {
      const result = executionFn();
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      this.recordTaskCompletion(task, executionTime, taskInfo);
      
      return result;
    } catch (error) {
      this.recordTaskError(task, error, taskInfo);
      throw error;
    }
  }
  
  recordTaskCompletion(task, executionTime, taskInfo) {
    // 记录执行时间
    const priority = task.priorityLevel;
    
    if (!this.metrics.taskExecutionTimes.has(priority)) {
      this.metrics.taskExecutionTimes.set(priority, []);
    }
    
    this.metrics.taskExecutionTimes.get(priority).push(executionTime);
    
    // 更新优先级统计
    if (!this.metrics.priorityStats.has(priority)) {
      this.metrics.priorityStats.set(priority, {
        executed: 0,
        totalTime: 0,
        avgTime: 0,
        maxTime: 0,
        minTime: Infinity
      });
    }
    
    const stats = this.metrics.priorityStats.get(priority);
    stats.executed++;
    stats.totalTime += executionTime;
    stats.avgTime = stats.totalTime / stats.executed;
    stats.maxTime = Math.max(stats.maxTime, executionTime);
    stats.minTime = Math.min(stats.minTime, executionTime);
    
    this.metrics.completedTasks++;
    
    // 检测长任务
    if (executionTime > 50) {
      this.reportLongTask(task, executionTime, taskInfo);
    }
  }
  
  recordTaskError(task, error, taskInfo) {
    console.error(`Task ${task.id} failed:`, error);
    
    // 记录错误统计
    if (!this.metrics.taskErrors) {
      this.metrics.taskErrors = [];
    }
    
    this.metrics.taskErrors.push({
      taskId: task.id,
      priority: task.priorityLevel,
      error: error.message,
      timestamp: Date.now(),
      queueTime: taskInfo.queueTime
    });
  }
  
  reportLongTask(task, executionTime, taskInfo) {
    const report = {
      type: 'long-task',
      taskId: task.id,
      priority: task.priorityLevel,
      executionTime,
      queueTime: taskInfo.queueTime,
      timestamp: Date.now()
    };
    
    console.warn('Long task detected:', report);
    
    // 发送到监控系统
    this.sendToMonitoring(report);
  }
  
  // 监控帧率
  monitorFrameRate() {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    
    // 检测掉帧（超过16.67ms）
    if (frameTime > 16.67) {
      this.metrics.frameDrops++;
      
      // 分析掉帧原因
      this.analyzeFrameDrop(frameTime);
    }
    
    this.lastFrameTime = now;
    
    // 请求下一帧监控
    requestAnimationFrame(() => this.monitorFrameRate());
  }
  
  analyzeFrameDrop(frameTime) {
    const analysis = {
      type: 'frame-drop',
      frameTime,
      timestamp: Date.now(),
      possibleCauses: this.identifyFrameDropCauses()
    };
    
    console.warn('Frame drop detected:', analysis);
    this.sendToMonitoring(analysis);
  }
  
  identifyFrameDropCauses() {
    const causes = [];
    
    // 检查是否有长时间执行的任务
    const recentLongTasks = this.getRecentLongTasks();
    if (recentLongTasks.length > 0) {
      causes.push({
        type: 'long-tasks',
        count: recentLongTasks.length,
        details: recentLongTasks
      });
    }
    
    // 检查队列积压
    const queueBacklog = this.calculateQueueBacklog();
    if (queueBacklog > 10) {
      causes.push({
        type: 'queue-backlog',
        count: queueBacklog
      });
    }
    
    // 检查内存使用
    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage.usage > 0.8) {
      causes.push({
        type: 'high-memory',
        usage: memoryUsage.usage
      });
    }
    
    return causes;
  }
  
  getRecentLongTasks() {
    const now = Date.now();
    const recentThreshold = 1000; // 最近1秒
    
    return (this.metrics.taskErrors || [])
      .filter(error => (now - error.timestamp) < recentThreshold)
      .filter(error => error.executionTime > 50);
  }
  
  calculateQueueBacklog() {
    // 这里需要访问实际的任务队列
    // 简化实现，返回估计值
    return Math.max(0, this.metrics.totalTasks - this.metrics.completedTasks);
  }
  
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        usage: performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit
      };
    }
    
    return { usage: 0 };
  }
  
  // 生成性能报告
  generateReport() {
    const now = performance.now();
    const uptime = now - this.startTime;
    
    const report = {
      uptime: uptime.toFixed(2),
      totalTasks: this.metrics.totalTasks,
      completedTasks: this.metrics.completedTasks,
      completionRate: this.metrics.totalTasks > 0 
        ? (this.metrics.completedTasks / this.metrics.totalTasks * 100).toFixed(2) + '%'
        : '0%',
      frameDrops: this.metrics.frameDrops,
      frameDropRate: (this.metrics.frameDrops / (uptime / 16.67) * 100).toFixed(2) + '%',
      
      priorityBreakdown: this.generatePriorityBreakdown(),
      queueWaitStats: this.calculateQueueWaitStats(),
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }
  
  generatePriorityBreakdown() {
    const breakdown = {};
    
    for (const [priority, stats] of this.metrics.priorityStats) {
      breakdown[priority] = {
        executed: stats.executed,
        avgTime: stats.avgTime.toFixed(2) + 'ms',
        maxTime: stats.maxTime.toFixed(2) + 'ms',
        minTime: stats.minTime === Infinity ? '0ms' : stats.minTime.toFixed(2) + 'ms',
        totalTime: stats.totalTime.toFixed(2) + 'ms'
      };
    }
    
    return breakdown;
  }
  
  calculateQueueWaitStats() {
    if (this.metrics.queueWaitTimes.length === 0) {
      return { avg: 0, max: 0, min: 0 };
    }
    
    const times = this.metrics.queueWaitTimes;
    const sum = times.reduce((acc, time) => acc + time, 0);
    
    return {
      avg: (sum / times.length).toFixed(2) + 'ms',
      max: Math.max(...times).toFixed(2) + 'ms',
      min: Math.min(...times).toFixed(2) + 'ms',
      p95: times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)]?.toFixed(2) + 'ms'
    };
  }
  
  generateRecommendations() {
    const recommendations = [];
    
    // 检查帧率问题
    if (this.metrics.frameDrops > 10) {
      recommendations.push({
        type: 'performance',
        issue: '频繁掉帧',
        suggestion: '考虑减少单个任务的执行时间或增加时间切片'
      });
    }
    
    // 检查队列等待时间
    const avgWaitTime = this.metrics.queueWaitTimes.length > 0
      ? this.metrics.queueWaitTimes.reduce((sum, time) => sum + time, 0) / this.metrics.queueWaitTimes.length
      : 0;
    
    if (avgWaitTime > 100) {
      recommendations.push({
        type: 'queue',
        issue: '队列等待时间过长',
        suggestion: '考虑调整任务优先级或增加处理并发度'
      });
    }
    
    return recommendations;
  }
  
  sendToMonitoring(data) {
    // 发送数据到外部监控系统
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('scheduler-metrics', data);
    }
  }
  
  // 清理过期数据
  cleanup() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5分钟
    
    // 清理队列等待时间数据
    this.metrics.queueWaitTimes = this.metrics.queueWaitTimes.slice(-1000);
    
    // 清理错误记录
    if (this.metrics.taskErrors) {
      this.metrics.taskErrors = this.metrics.taskErrors.filter(
        error => (now - error.timestamp) < maxAge
      );
    }
  }
}
```

## 🎯 总结

### 🌟 调度器的核心价值

1. **时间切片** - 将长任务分解为可中断的小任务，保持UI响应性
2. **优先级调度** - 根据任务重要性进行智能调度，确保重要任务优先执行
3. **资源协调** - 在浏览器空闲时间执行非紧急任务，提升整体性能
4. **并发支持** - 为React并发特性提供底层基础设施

### 🔑 关键技术点

- **MessageChannel调度** - 使用宏任务实现非阻塞调度
- **最小堆队列** - 高效的优先级队列实现
- **动态时间片** - 根据设备性能自适应调整时间片大小
- **优先级继承** - 解决优先级倒置问题

### 📈 性能优化要点

- **合理的时间片大小** - 平衡响应性和效率
- **优先级设置** - 正确设置任务优先级避免饥饿
- **监控和调试** - 实时监控调度器性能
- **内存管理** - 及时清理过期任务和数据

React Scheduler是实现并发React的关键组件，理解其工作原理对于优化React应用的性能和用户体验至关重要。通过合理使用调度器的能力，我们可以构建出响应迅速、性能优异的现代Web应用。

---

*深入理解调度器，掌握React并发的核心引擎*
