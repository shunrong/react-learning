# 领域驱动架构设计

> 🎯 在前端应用中实践DDD，让复杂业务逻辑更清晰可维护

## 🔍 问题背景：为什么前端需要领域驱动设计？

### 💔 复杂业务逻辑在前端的困境

作为一个经历过多个复杂C端产品开发的架构师，我深刻体会到当业务逻辑复杂度超过某个临界点后，传统的前端开发方式会遇到严重问题。

让我分享一个真实案例：我曾负责一个**电商平台的前端架构**，涉及：

```typescript
// 业务复杂度的真实写照
interface ECommerceBusinessComplexity {
  // 用户体系
  users: {
    types: ['个人用户', '企业用户', 'VIP用户', '分销商'];
    states: ['未激活', '正常', '冻结', '注销'];
    permissions: ['基础权限', '高级权限', '管理权限'];
    behaviors: ['浏览', '下单', '支付', '评价', '退款', '分享'];
  };
  
  // 商品体系
  products: {
    categories: ['实物商品', '虚拟商品', '服务商品', '组合商品'];
    states: ['草稿', '上架', '下架', '售罄', '停售'];
    pricing: ['固定价格', '阶梯价格', '动态价格', '竞拍价格'];
    inventory: ['现货', '预售', '定制', '代发'];
  };
  
  // 订单体系
  orders: {
    types: ['普通订单', '预售订单', '团购订单', '秒杀订单'];
    states: ['待支付', '已支付', '备货中', '已发货', '已收货', '已完成', '已取消', '退款中'];
    operations: ['创建', '修改', '支付', '取消', '退款', '换货', '评价'];
  };
  
  // 业务规则复杂度
  businessRules: {
    promotion: '20+ 种促销规则，可组合使用',
    inventory: '多仓库、多供应商的库存管理',
    logistics: '10+ 物流方式，智能路径规划',
    payment: '15+ 支付方式，风控规则',
    membership: '会员等级、积分、优惠券体系'
  };
}
```

#### 🤯 传统前端架构的痛点

在传统的**组件 + 状态管理**架构下，这些复杂的业务逻辑导致了：

1. **业务逻辑分散**：订单相关的逻辑散落在20+个组件中
2. **状态管理混乱**：订单状态、商品状态、用户状态相互耦合
3. **规则重复实现**：促销规则在不同页面重复编写
4. **调试困难**：Bug定位需要跨越多个文件和状态
5. **新人上手难**：业务逻辑没有统一的表达方式

```typescript
// ❌ 传统方式：业务逻辑分散在各处
// 在商品列表组件中
function ProductList() {
  const handleAddToCart = (product) => {
    // 重复的业务逻辑：库存检查、促销计算、用户权限检查
    if (product.stock <= 0) return;
    if (user.type === 'vip' && product.vipDiscount) {
      // VIP折扣逻辑
    }
    if (isPromotionActive(product.promotions)) {
      // 促销规则计算
    }
    // ... 50行业务逻辑
  };
}

// 在购物车组件中
function ShoppingCart() {
  const handleCheckout = () => {
    // 又是重复的业务逻辑：库存检查、促销计算、配送规则
    cart.items.forEach(item => {
      if (item.stock <= 0) {
        // 处理库存不足
      }
      if (user.type === 'vip' && item.vipDiscount) {
        // 又是VIP折扣逻辑
      }
      // ... 又是50行相似的业务逻辑
    });
  };
}
```

### 🤔 为什么传统MVC模式不够？

传统的前端架构通常采用MVC或类似模式：

```typescript
// 传统MVC在复杂业务下的局限
interface TraditionalMVCLimitations {
  // Model：数据模型
  model: {
    problem: '只关注数据结构，缺乏业务行为',
    example: {
      order: { id: string, amount: number, status: string },
      // 缺少：订单创建逻辑、状态变更规则、业务约束
    }
  };
  
  // View：视图组件  
  view: {
    problem: '承担了过多的业务逻辑责任',
    example: {
      orderComponent: '包含订单状态判断、金额计算、权限检查等业务逻辑',
      // 应该：只关注UI渲染和用户交互
    }
  };
  
  // Controller：控制器
  controller: {
    problem: '成为业务逻辑的垃圾桶',
    example: {
      orderController: '混杂了数据获取、业务计算、状态管理等职责',
      // 应该：只负责协调Model和View
    }
  };
}
```

**核心问题**：传统架构缺乏**业务领域的明确表达**，业务概念和规则没有在代码中得到直接体现。

### 💡 DDD在前端的价值

经过深入实践，我发现DDD能够为前端开发带来关键价值：

#### 1. **业务概念的直接表达**
```typescript
// ✅ DDD方式：业务概念清晰表达
class Order extends AggregateRoot {
  private constructor(
    private orderId: OrderId,
    private customerId: CustomerId,
    private items: OrderItem[],
    private status: OrderStatus,
    private amount: Money
  ) {}
  
  // 业务行为直接表达
  checkout(paymentMethod: PaymentMethod): DomainEvent[] {
    // 业务规则检查
    this.validateOrderItems();
    this.validatePaymentMethod(paymentMethod);
    
    // 业务状态变更
    this.status = OrderStatus.PENDING_PAYMENT;
    
    // 领域事件
    return [new OrderCheckedOut(this.orderId, this.amount)];
  }
  
  cancel(reason: string): DomainEvent[] {
    if (!this.canCancel()) {
      throw new OrderCannotBeCancelledException(this.orderId);
    }
    
    this.status = OrderStatus.CANCELLED;
    return [new OrderCancelled(this.orderId, reason)];
  }
  
  private validateOrderItems() {
    if (this.items.length === 0) {
      throw new EmptyOrderException();
    }
    
    this.items.forEach(item => {
      if (!item.isAvailable()) {
        throw new ProductNotAvailableException(item.productId);
      }
    });
  }
}
```

#### 2. **复杂业务规则的集中管理**
```typescript
// 领域服务：处理跨聚合的业务逻辑
class PricingService {
  calculateOrderAmount(
    order: Order, 
    customer: Customer, 
    promotions: Promotion[]
  ): Money {
    let totalAmount = order.getBaseAmount();
    
    // 会员折扣
    if (customer.isVIP()) {
      totalAmount = this.applyVIPDiscount(totalAmount, customer.getVIPLevel());
    }
    
    // 促销规则
    for (const promotion of promotions) {
      if (promotion.isApplicable(order, customer)) {
        totalAmount = promotion.apply(totalAmount);
      }
    }
    
    // 运费计算
    const shippingCost = this.calculateShipping(order, customer);
    totalAmount = totalAmount.add(shippingCost);
    
    return totalAmount;
  }
}
```

#### 3. **状态变化的可追踪性**
```typescript
// 领域事件：记录业务状态变化
interface DomainEvent {
  eventId: string;
  aggregateId: string;
  occurredOn: Date;
  eventType: string;
}

class OrderCheckedOut implements DomainEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly amount: Money,
    public readonly occurredOn: Date = new Date()
  ) {}
}

// 事件驱动的业务流程
class OrderEventHandler {
  handle(event: OrderCheckedOut) {
    // 触发库存扣减
    this.inventoryService.reserveItems(event.orderId);
    
    // 发送订单通知
    this.notificationService.sendOrderConfirmation(event.orderId);
    
    // 更新用户积分
    this.membershipService.addPoints(event.customerId, event.amount);
  }
}
```

## 🧠 DDD在前端的架构设计思考

### 🎯 前端DDD的核心挑战

将DDD应用到前端面临几个特有的挑战：

#### 挑战1：前端的"无状态"特性
**问题**：前端应用通常是无状态的，刷新页面就重置，如何保持领域对象的生命周期？

**思考过程**：
- **服务端DDD**：对象生命周期由ORM和数据库管理
- **前端DDD**：对象生命周期需要通过状态管理工具维护
- **解决方案**：结合状态管理 + 持久化的混合方案

```typescript
// 前端领域对象的生命周期管理
class DomainObjectManager {
  private aggregates: Map<string, AggregateRoot> = new Map();
  private eventStore: DomainEventStore;
  private persistenceStore: PersistenceStore;
  
  // 领域对象的重建
  async rehydrate<T extends AggregateRoot>(
    aggregateId: string, 
    aggregateType: new (...args: any[]) => T
  ): Promise<T> {
    // 1. 从持久化存储加载快照
    const snapshot = await this.persistenceStore.getSnapshot(aggregateId);
    
    // 2. 从事件存储加载事件
    const events = await this.eventStore.getEvents(aggregateId, snapshot.version);
    
    // 3. 重建领域对象
    const aggregate = aggregateType.fromSnapshot(snapshot);
    events.forEach(event => aggregate.apply(event));
    
    // 4. 缓存到内存
    this.aggregates.set(aggregateId, aggregate);
    
    return aggregate as T;
  }
  
  // 领域对象的持久化
  async persist(aggregate: AggregateRoot) {
    const uncommittedEvents = aggregate.getUncommittedEvents();
    
    // 保存事件
    await this.eventStore.saveEvents(aggregate.getId(), uncommittedEvents);
    
    // 保存快照（定期）
    if (this.shouldCreateSnapshot(aggregate)) {
      const snapshot = aggregate.createSnapshot();
      await this.persistenceStore.saveSnapshot(snapshot);
    }
    
    // 标记事件已提交
    aggregate.markEventsAsCommitted();
  }
}
```

#### 挑战2：UI状态 vs 领域状态的分离
**问题**：前端同时存在UI状态（loading、展开/折叠等）和业务状态，如何分离？

**我的解决方案**：**双状态模型**

```typescript
// 双状态模型：UI状态和领域状态分离
interface StateArchitecture {
  // 领域状态：纯业务逻辑
  domain: {
    aggregates: Map<string, AggregateRoot>;
    services: DomainService[];
    events: DomainEvent[];
  };
  
  // UI状态：界面相关
  ui: {
    loading: boolean;
    errors: UIError[];
    modals: ModalState[];
    forms: FormState[];
  };
  
  // 应用状态：协调领域和UI
  application: {
    currentUser: User;
    permissions: Permission[];
    navigation: NavigationState;
  };
}

// 实现示例
class OrderPageViewModel {
  // UI状态
  @observable loading = false;
  @observable selectedTab = 'details';
  @observable isModalOpen = false;
  
  // 领域状态（通过领域服务获取）
  @computed get order(): Order {
    return this.domainService.getOrder(this.orderId);
  }
  
  // 应用逻辑：协调UI和领域
  @action async cancelOrder(reason: string) {
    this.loading = true;
    
    try {
      // 调用领域方法
      const events = this.order.cancel(reason);
      
      // 处理领域事件
      await this.eventHandler.handle(events);
      
      // 更新UI状态
      this.isModalOpen = false;
      this.showSuccessMessage('订单已取消');
    } catch (error) {
      this.showErrorMessage(error.message);
    } finally {
      this.loading = false;
    }
  }
}
```

#### 挑战3：异步数据获取与领域完整性
**问题**：前端数据通过API异步获取，如何保证领域对象的完整性？

**解决策略**：**分层数据加载 + 领域完整性检查**

```typescript
// 分层数据加载策略
class DomainDataLoader {
  // 1. 基础数据加载
  async loadOrderBasics(orderId: string): Promise<Order> {
    const basicData = await this.api.getOrder(orderId);
    return Order.fromBasicData(basicData);
  }
  
  // 2. 完整领域对象加载
  async loadCompleteOrder(orderId: string): Promise<Order> {
    const [orderData, itemsData, customerData] = await Promise.all([
      this.api.getOrder(orderId),
      this.api.getOrderItems(orderId),
      this.api.getCustomer(orderData.customerId)
    ]);
    
    // 构建完整的领域对象
    const order = Order.fromCompleteData({
      orderData,
      items: itemsData.map(item => OrderItem.fromData(item)),
      customer: Customer.fromData(customerData)
    });
    
    // 领域完整性验证
    order.validateCompleteness();
    
    return order;
  }
  
  // 3. 渐进式数据加载
  async loadOrderProgressive(orderId: string): Promise<Observable<Order>> {
    return new Observable(observer => {
      // 首先发送基础数据
      this.loadOrderBasics(orderId).then(basicOrder => {
        observer.next(basicOrder);
        
        // 然后加载完整数据
        this.loadCompleteOrder(orderId).then(completeOrder => {
          observer.next(completeOrder);
          observer.complete();
        });
      });
    });
  }
}
```

### 🏗️ 前端DDD架构设计

基于以上思考，我设计了一套适合前端的DDD架构：

#### 🎯 分层架构设计

```typescript
// 前端DDD分层架构
interface FrontendDDDArchitecture {
  // 1. 用户界面层 (UI Layer)
  ui: {
    components: ReactComponent[];     // React组件
    viewModels: ViewModel[];          // 视图模型
    eventHandlers: UIEventHandler[];  // UI事件处理
  };
  
  // 2. 应用服务层 (Application Layer)
  application: {
    services: ApplicationService[];   // 应用服务
    queries: QueryService[];          // 查询服务
    commands: CommandService[];       // 命令服务
    eventHandlers: AppEventHandler[]; // 应用事件处理
  };
  
  // 3. 领域层 (Domain Layer)
  domain: {
    aggregates: AggregateRoot[];      // 聚合根
    entities: Entity[];               // 实体
    valueObjects: ValueObject[];      // 值对象
    services: DomainService[];        // 领域服务
    events: DomainEvent[];            // 领域事件
    specifications: Specification[];  // 规约
  };
  
  // 4. 基础设施层 (Infrastructure Layer)
  infrastructure: {
    repositories: Repository[];       // 仓储实现
    api: APIService[];               // API服务
    storage: StorageService[];       // 存储服务
    eventBus: EventBus;             // 事件总线
  };
}
```

## 💡 核心方案设计

### 🎯 1. 聚合设计与实现

#### 📦 聚合根的设计原则

```typescript
// 聚合根基类
abstract class AggregateRoot {
  protected id: string;
  protected version: number = 0;
  private uncommittedEvents: DomainEvent[] = [];
  
  constructor(id: string) {
    this.id = id;
  }
  
  // 获取聚合标识
  getId(): string {
    return this.id;
  }
  
  // 获取版本号（用于乐观锁）
  getVersion(): number {
    return this.version;
  }
  
  // 应用领域事件
  protected applyEvent(event: DomainEvent): void {
    this.applyChange(event, true);
  }
  
  // 重放历史事件（重建聚合时使用）
  public apply(event: DomainEvent): void {
    this.applyChange(event, false);
  }
  
  private applyChange(event: DomainEvent, isNew: boolean): void {
    // 调用具体的事件处理方法
    const handlerName = `on${event.constructor.name}`;
    if (typeof this[handlerName] === 'function') {
      this[handlerName](event);
    }
    
    if (isNew) {
      this.uncommittedEvents.push(event);
    }
    
    this.version++;
  }
  
  // 获取未提交的事件
  getUncommittedEvents(): DomainEvent[] {
    return [...this.uncommittedEvents];
  }
  
  // 标记事件已提交
  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }
  
  // 创建快照（用于性能优化）
  abstract createSnapshot(): AggregateSnapshot;
  
  // 从快照恢复
  static fromSnapshot(snapshot: AggregateSnapshot): AggregateRoot {
    throw new Error('Must be implemented by subclass');
  }
}

// 订单聚合实现
class Order extends AggregateRoot {
  private customerId: CustomerId;
  private items: OrderItem[] = [];
  private status: OrderStatus = OrderStatus.DRAFT;
  private amount: Money = Money.zero();
  private createdAt: Date;
  private updatedAt: Date;
  
  constructor(
    orderId: OrderId, 
    customerId: CustomerId
  ) {
    super(orderId.value);
    this.customerId = customerId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  
  // 业务方法：添加商品
  addItem(productId: ProductId, quantity: number, price: Money): void {
    // 业务规则验证
    if (this.status !== OrderStatus.DRAFT) {
      throw new OrderNotEditableException(this.getId());
    }
    
    if (quantity <= 0) {
      throw new InvalidQuantityException(quantity);
    }
    
    // 检查是否已存在该商品
    const existingItem = this.items.find(item => 
      item.getProductId().equals(productId)
    );
    
    if (existingItem) {
      // 更新数量
      existingItem.updateQuantity(existingItem.getQuantity() + quantity);
    } else {
      // 添加新商品
      const item = new OrderItem(productId, quantity, price);
      this.items.push(item);
    }
    
    // 重新计算总额
    this.recalculateAmount();
    
    // 发布领域事件
    this.applyEvent(new OrderItemAdded(
      new OrderId(this.getId()),
      productId,
      quantity,
      price
    ));
  }
  
  // 业务方法：结算订单
  checkout(): void {
    // 业务规则验证
    if (this.items.length === 0) {
      throw new EmptyOrderException(this.getId());
    }
    
    if (this.status !== OrderStatus.DRAFT) {
      throw new OrderNotCheckoutableException(this.getId());
    }
    
    // 库存检查（这里简化，实际应该通过领域服务）
    this.validateItemsAvailability();
    
    // 状态变更
    this.status = OrderStatus.PENDING_PAYMENT;
    this.updatedAt = new Date();
    
    // 发布领域事件
    this.applyEvent(new OrderCheckedOut(
      new OrderId(this.getId()),
      this.customerId,
      this.amount,
      this.createdAt
    ));
  }
  
  // 业务方法：取消订单
  cancel(reason: string): void {
    if (!this.canCancel()) {
      throw new OrderCannotBeCancelledException(this.getId());
    }
    
    this.status = OrderStatus.CANCELLED;
    this.updatedAt = new Date();
    
    this.applyEvent(new OrderCancelled(
      new OrderId(this.getId()),
      reason,
      new Date()
    ));
  }
  
  // 业务查询方法
  canCancel(): boolean {
    return [
      OrderStatus.DRAFT,
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PAID
    ].includes(this.status);
  }
  
  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.getQuantity(), 0);
  }
  
  getAmount(): Money {
    return this.amount;
  }
  
  getStatus(): OrderStatus {
    return this.status;
  }
  
  // 私有方法：重新计算总额
  private recalculateAmount(): void {
    this.amount = this.items.reduce(
      (sum, item) => sum.add(item.getTotalPrice()),
      Money.zero()
    );
  }
  
  // 私有方法：验证商品可用性
  private validateItemsAvailability(): void {
    // 这里应该通过领域服务来检查库存
    // 简化处理
    this.items.forEach(item => {
      if (!item.isAvailable()) {
        throw new ProductNotAvailableException(item.getProductId());
      }
    });
  }
  
  // 事件处理方法
  private onOrderItemAdded(event: OrderItemAdded): void {
    // 事件已经在业务方法中处理了状态变更
    // 这里可以处理一些额外的逻辑
  }
  
  private onOrderCheckedOut(event: OrderCheckedOut): void {
    // 状态已经变更，这里可以处理其他逻辑
  }
  
  private onOrderCancelled(event: OrderCancelled): void {
    // 状态已经变更，这里可以处理清理逻辑
  }
  
  // 快照操作
  createSnapshot(): OrderSnapshot {
    return {
      aggregateId: this.getId(),
      version: this.getVersion(),
      customerId: this.customerId.value,
      items: this.items.map(item => item.toSnapshot()),
      status: this.status,
      amount: this.amount.toSnapshot(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
  
  static fromSnapshot(snapshot: OrderSnapshot): Order {
    const order = Object.create(Order.prototype);
    order.id = snapshot.aggregateId;
    order.version = snapshot.version;
    order.customerId = new CustomerId(snapshot.customerId);
    order.items = snapshot.items.map(itemSnapshot => 
      OrderItem.fromSnapshot(itemSnapshot)
    );
    order.status = snapshot.status;
    order.amount = Money.fromSnapshot(snapshot.amount);
    order.createdAt = snapshot.createdAt;
    order.updatedAt = snapshot.updatedAt;
    order.uncommittedEvents = [];
    
    return order;
  }
}
```

#### 🎯 值对象的设计

```typescript
// 值对象基类
abstract class ValueObject {
  // 值对象的相等性比较
  equals(other: ValueObject): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    
    if (this.constructor !== other.constructor) {
      return false;
    }
    
    return this.getEqualityComponents().every((component, index) => {
      const otherComponent = other.getEqualityComponents()[index];
      return component === otherComponent;
    });
  }
  
  // 子类需要实现：返回用于比较的组件
  protected abstract getEqualityComponents(): any[];
}

// 金额值对象
class Money extends ValueObject {
  private readonly amount: number;
  private readonly currency: string;
  
  constructor(amount: number, currency: string = 'CNY') {
    super();
    if (amount < 0) {
      throw new InvalidAmountException(amount);
    }
    this.amount = Math.round(amount * 100) / 100; // 保留两位小数
    this.currency = currency;
  }
  
  static zero(currency = 'CNY'): Money {
    return new Money(0, currency);
  }
  
  static fromYuan(yuan: number): Money {
    return new Money(yuan, 'CNY');
  }
  
  static fromCents(cents: number): Money {
    return new Money(cents / 100, 'CNY');
  }
  
  // 业务方法
  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }
  
  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }
  
  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }
  
  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new DivisionByZeroException();
    }
    return new Money(this.amount / divisor, this.currency);
  }
  
  // 查询方法
  getAmount(): number {
    return this.amount;
  }
  
  getCurrency(): string {
    return this.currency;
  }
  
  getCents(): number {
    return Math.round(this.amount * 100);
  }
  
  isZero(): boolean {
    return this.amount === 0;
  }
  
  isPositive(): boolean {
    return this.amount > 0;
  }
  
  isNegative(): boolean {
    return this.amount < 0;
  }
  
  // 格式化
  format(): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }
  
  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchException(this.currency, other.currency);
    }
  }
  
  protected getEqualityComponents(): any[] {
    return [this.amount, this.currency];
  }
  
  toSnapshot(): MoneySnapshot {
    return {
      amount: this.amount,
      currency: this.currency
    };
  }
  
  static fromSnapshot(snapshot: MoneySnapshot): Money {
    return new Money(snapshot.amount, snapshot.currency);
  }
}

// 订单状态值对象
class OrderStatus extends ValueObject {
  static readonly DRAFT = new OrderStatus('DRAFT', '草稿');
  static readonly PENDING_PAYMENT = new OrderStatus('PENDING_PAYMENT', '待支付');
  static readonly PAID = new OrderStatus('PAID', '已支付');
  static readonly SHIPPED = new OrderStatus('SHIPPED', '已发货');
  static readonly DELIVERED = new OrderStatus('DELIVERED', '已送达');
  static readonly COMPLETED = new OrderStatus('COMPLETED', '已完成');
  static readonly CANCELLED = new OrderStatus('CANCELLED', '已取消');
  
  private constructor(
    private readonly code: string,
    private readonly name: string
  ) {
    super();
  }
  
  getCode(): string {
    return this.code;
  }
  
  getName(): string {
    return this.name;
  }
  
  // 状态转换规则
  canTransitionTo(nextStatus: OrderStatus): boolean {
    const transitions = new Map([
      [OrderStatus.DRAFT, [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED]],
      [OrderStatus.PENDING_PAYMENT, [OrderStatus.PAID, OrderStatus.CANCELLED]],
      [OrderStatus.PAID, [OrderStatus.SHIPPED, OrderStatus.CANCELLED]],
      [OrderStatus.SHIPPED, [OrderStatus.DELIVERED]],
      [OrderStatus.DELIVERED, [OrderStatus.COMPLETED]],
      [OrderStatus.COMPLETED, []],
      [OrderStatus.CANCELLED, []]
    ]);
    
    const allowedTransitions = transitions.get(this) || [];
    return allowedTransitions.includes(nextStatus);
  }
  
  static fromCode(code: string): OrderStatus {
    const statuses = [
      OrderStatus.DRAFT,
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PAID,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED
    ];
    
    const status = statuses.find(s => s.code === code);
    if (!status) {
      throw new InvalidOrderStatusException(code);
    }
    
    return status;
  }
  
  protected getEqualityComponents(): any[] {
    return [this.code];
  }
}
```

### 🎯 2. 应用服务与查询分离

#### 📋 命令查询分离 (CQRS)

```typescript
// 命令接口
interface Command {
  readonly commandId: string;
  readonly timestamp: Date;
}

// 查询接口
interface Query {
  readonly queryId: string;
  readonly timestamp: Date;
}

// 命令：用于改变系统状态
class CreateOrderCommand implements Command {
  readonly commandId = generateId();
  readonly timestamp = new Date();
  
  constructor(
    public readonly customerId: string,
    public readonly items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>
  ) {}
}

class AddOrderItemCommand implements Command {
  readonly commandId = generateId();
  readonly timestamp = new Date();
  
  constructor(
    public readonly orderId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: number
  ) {}
}

// 查询：用于读取数据
class GetOrderQuery implements Query {
  readonly queryId = generateId();
  readonly timestamp = new Date();
  
  constructor(public readonly orderId: string) {}
}

class GetOrdersByCustomerQuery implements Query {
  readonly queryId = generateId();
  readonly timestamp = new Date();
  
  constructor(
    public readonly customerId: string,
    public readonly status?: string,
    public readonly page: number = 1,
    public readonly limit: number = 20
  ) {}
}

// 命令处理器
interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}

class CreateOrderCommandHandler implements CommandHandler<CreateOrderCommand> {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private eventBus: EventBus
  ) {}
  
  async handle(command: CreateOrderCommand): Promise<void> {
    // 1. 验证客户存在
    const customer = await this.customerRepository.findById(
      new CustomerId(command.customerId)
    );
    if (!customer) {
      throw new CustomerNotFoundException(command.customerId);
    }
    
    // 2. 验证商品信息
    const productIds = command.items.map(item => new ProductId(item.productId));
    const products = await this.productRepository.findByIds(productIds);
    
    if (products.length !== productIds.length) {
      throw new ProductNotFoundException('Some products not found');
    }
    
    // 3. 创建订单聚合
    const orderId = OrderId.generate();
    const order = new Order(orderId, new CustomerId(command.customerId));
    
    // 4. 添加订单项
    for (const item of command.items) {
      const product = products.find(p => p.getId().value === item.productId);
      if (product && product.isAvailable()) {
        order.addItem(
          new ProductId(item.productId),
          item.quantity,
          Money.fromYuan(item.price)
        );
      }
    }
    
    // 5. 保存聚合
    await this.orderRepository.save(order);
    
    // 6. 发布领域事件
    const events = order.getUncommittedEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }
    order.markEventsAsCommitted();
  }
}

// 查询处理器
interface QueryHandler<TQuery extends Query, TResult> {
  handle(query: TQuery): Promise<TResult>;
}

class GetOrderQueryHandler implements QueryHandler<GetOrderQuery, OrderView> {
  constructor(private orderViewRepository: OrderViewRepository) {}
  
  async handle(query: GetOrderQuery): Promise<OrderView> {
    const orderView = await this.orderViewRepository.findById(query.orderId);
    
    if (!orderView) {
      throw new OrderNotFoundException(query.orderId);
    }
    
    return orderView;
  }
}

// 应用服务：协调命令和查询
class OrderApplicationService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}
  
  // 命令操作
  async createOrder(customerId: string, items: OrderItemData[]): Promise<void> {
    const command = new CreateOrderCommand(customerId, items);
    await this.commandBus.send(command);
  }
  
  async addOrderItem(orderId: string, productId: string, quantity: number, price: number): Promise<void> {
    const command = new AddOrderItemCommand(orderId, productId, quantity, price);
    await this.commandBus.send(command);
  }
  
  // 查询操作
  async getOrder(orderId: string): Promise<OrderView> {
    const query = new GetOrderQuery(orderId);
    return await this.queryBus.send(query);
  }
  
  async getCustomerOrders(customerId: string, status?: string): Promise<OrderView[]> {
    const query = new GetOrdersByCustomerQuery(customerId, status);
    return await this.queryBus.send(query);
  }
}
```

#### 📊 读写模型分离

```typescript
// 写模型：用于命令操作，强一致性
interface OrderWriteModel {
  id: string;
  customerId: string;
  status: string;
  items: OrderItemWriteModel[];
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  version: number; // 乐观锁
}

// 读模型：用于查询，最终一致性，性能优化
interface OrderView {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: {
    code: string;
    name: string;
    color: string;
  };
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
    quantity: number;
    totalPrice: number;
  }>;
  summary: {
    totalItems: number;
    totalAmount: number;
    formattedAmount: string;
  };
  timeline: Array<{
    status: string;
    timestamp: Date;
    description: string;
  }>;
  actions: Array<{
    type: string;
    label: string;
    enabled: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// 投影器：将领域事件投影到读模型
class OrderProjection {
  constructor(private orderViewRepository: OrderViewRepository) {}
  
  @EventHandler(OrderCreated)
  async onOrderCreated(event: OrderCreated): Promise<void> {
    const orderView: OrderView = {
      id: event.orderId.value,
      orderNumber: event.orderNumber,
      customer: await this.getCustomerInfo(event.customerId),
      status: {
        code: 'DRAFT',
        name: '草稿',
        color: 'gray'
      },
      items: [],
      summary: {
        totalItems: 0,
        totalAmount: 0,
        formattedAmount: '¥0.00'
      },
      timeline: [{
        status: 'CREATED',
        timestamp: event.occurredOn,
        description: '订单已创建'
      }],
      actions: [
        { type: 'edit', label: '编辑', enabled: true },
        { type: 'delete', label: '删除', enabled: true }
      ],
      createdAt: event.occurredOn,
      updatedAt: event.occurredOn
    };
    
    await this.orderViewRepository.save(orderView);
  }
  
  @EventHandler(OrderItemAdded)
  async onOrderItemAdded(event: OrderItemAdded): Promise<void> {
    const orderView = await this.orderViewRepository.findById(event.orderId.value);
    if (!orderView) return;
    
    const productInfo = await this.getProductInfo(event.productId);
    
    const newItem = {
      id: generateId(),
      product: productInfo,
      quantity: event.quantity,
      totalPrice: event.price.getAmount() * event.quantity
    };
    
    orderView.items.push(newItem);
    
    // 更新汇总信息
    orderView.summary.totalItems = orderView.items.reduce(
      (sum, item) => sum + item.quantity, 0
    );
    orderView.summary.totalAmount = orderView.items.reduce(
      (sum, item) => sum + item.totalPrice, 0
    );
    orderView.summary.formattedAmount = Money.fromYuan(orderView.summary.totalAmount).format();
    
    orderView.updatedAt = event.occurredOn;
    
    await this.orderViewRepository.save(orderView);
  }
  
  @EventHandler(OrderCheckedOut)
  async onOrderCheckedOut(event: OrderCheckedOut): Promise<void> {
    const orderView = await this.orderViewRepository.findById(event.orderId.value);
    if (!orderView) return;
    
    // 更新状态
    orderView.status = {
      code: 'PENDING_PAYMENT',
      name: '待支付',
      color: 'orange'
    };
    
    // 添加时间线
    orderView.timeline.push({
      status: 'CHECKED_OUT',
      timestamp: event.occurredOn,
      description: '订单已结算，等待支付'
    });
    
    // 更新可用操作
    orderView.actions = [
      { type: 'pay', label: '支付', enabled: true },
      { type: 'cancel', label: '取消', enabled: true }
    ];
    
    orderView.updatedAt = event.occurredOn;
    
    await this.orderViewRepository.save(orderView);
  }
}
```

### 🎯 3. 事件驱动架构

#### 🔄 领域事件设计

```typescript
// 领域事件基类
abstract class DomainEvent {
  public readonly eventId: string = generateId();
  public readonly occurredOn: Date = new Date();
  public readonly eventType: string;
  
  constructor() {
    this.eventType = this.constructor.name;
  }
  
  abstract getAggregateId(): string;
}

// 具体领域事件
class OrderCreated extends DomainEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly customerId: CustomerId,
    public readonly orderNumber: string
  ) {
    super();
  }
  
  getAggregateId(): string {
    return this.orderId.value;
  }
}

class OrderItemAdded extends DomainEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly productId: ProductId,
    public readonly quantity: number,
    public readonly price: Money
  ) {
    super();
  }
  
  getAggregateId(): string {
    return this.orderId.value;
  }
}

class OrderCheckedOut extends DomainEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly customerId: CustomerId,
    public readonly amount: Money,
    public readonly checkedOutAt: Date
  ) {
    super();
  }
  
  getAggregateId(): string {
    return this.orderId.value;
  }
}

// 事件总线
interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventType: string, handler: EventHandler): void;
}

class InMemoryEventBus implements EventBus {
  private handlers = new Map<string, EventHandler[]>();
  
  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventType) || [];
    
    // 并行处理所有事件处理器
    const promises = eventHandlers.map(handler => 
      this.safeHandle(handler, event)
    );
    
    await Promise.all(promises);
  }
  
  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    this.handlers.get(eventType)!.push(handler);
  }
  
  private async safeHandle(handler: EventHandler, event: DomainEvent): Promise<void> {
    try {
      await handler.handle(event);
    } catch (error) {
      console.error(`Event handler error for ${event.eventType}:`, error);
      // 这里可以实现重试机制或者死信队列
    }
  }
}

// 事件处理器
interface EventHandler {
  handle(event: DomainEvent): Promise<void>;
}

// 库存管理事件处理器
class InventoryEventHandler implements EventHandler {
  constructor(private inventoryService: InventoryService) {}
  
  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof OrderCheckedOut) {
      await this.handleOrderCheckedOut(event);
    }
  }
  
  private async handleOrderCheckedOut(event: OrderCheckedOut): Promise<void> {
    // 预扣库存
    const order = await this.orderRepository.findById(event.orderId);
    if (order) {
      for (const item of order.getItems()) {
        await this.inventoryService.reserve(
          item.getProductId(),
          item.getQuantity(),
          event.orderId
        );
      }
    }
  }
}

// 通知事件处理器
class NotificationEventHandler implements EventHandler {
  constructor(
    private emailService: EmailService,
    private smsService: SMSService
  ) {}
  
  async handle(event: DomainEvent): Promise<void> {
    switch (event.constructor) {
      case OrderCheckedOut:
        await this.handleOrderCheckedOut(event as OrderCheckedOut);
        break;
      case OrderCancelled:
        await this.handleOrderCancelled(event as OrderCancelled);
        break;
    }
  }
  
  private async handleOrderCheckedOut(event: OrderCheckedOut): Promise<void> {
    const customer = await this.customerRepository.findById(event.customerId);
    if (customer) {
      await this.emailService.sendOrderConfirmation(
        customer.getEmail(),
        event.orderId.value,
        event.amount.format()
      );
    }
  }
}
```

### 🎯 4. 仓储模式实现

#### 📦 前端仓储实现

```typescript
// 仓储接口
interface Repository<T extends AggregateRoot> {
  findById(id: string): Promise<T | null>;
  save(aggregate: T): Promise<void>;
  remove(id: string): Promise<void>;
}

// 订单仓储接口
interface OrderRepository extends Repository<Order> {
  findByCustomerId(customerId: CustomerId): Promise<Order[]>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
}

// 前端仓储实现（结合API和本地存储）
class FrontendOrderRepository implements OrderRepository {
  private cache = new Map<string, Order>();
  
  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private eventStore: EventStore
  ) {}
  
  async findById(id: string): Promise<Order | null> {
    // 1. 先从内存缓存查找
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }
    
    // 2. 从本地存储查找
    const cachedData = await this.storageService.get(`order:${id}`);
    if (cachedData) {
      const order = this.deserializeOrder(cachedData);
      this.cache.set(id, order);
      return order;
    }
    
    // 3. 从服务端API获取
    try {
      const orderData = await this.apiService.getOrder(id);
      const order = this.mapToOrder(orderData);
      
      // 缓存到内存和本地存储
      this.cache.set(id, order);
      await this.storageService.set(`order:${id}`, this.serializeOrder(order));
      
      return order;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }
  
  async save(order: Order): Promise<void> {
    const orderId = order.getId();
    const uncommittedEvents = order.getUncommittedEvents();
    
    if (uncommittedEvents.length === 0) {
      // 没有变更，只更新缓存
      this.cache.set(orderId, order);
      return;
    }
    
    try {
      // 1. 保存到事件存储
      await this.eventStore.saveEvents(orderId, uncommittedEvents);
      
      // 2. 发送到服务端
      await this.syncToServer(order, uncommittedEvents);
      
      // 3. 更新本地缓存
      this.cache.set(orderId, order);
      await this.storageService.set(`order:${orderId}`, this.serializeOrder(order));
      
      // 4. 标记事件已提交
      order.markEventsAsCommitted();
      
    } catch (error) {
      // 离线模式：只保存到本地
      if (this.isOffline()) {
        await this.saveToLocal(order, uncommittedEvents);
        this.markForSync(orderId);
      } else {
        throw error;
      }
    }
  }
  
  async findByCustomerId(customerId: CustomerId): Promise<Order[]> {
    // 这里可以实现更复杂的查询逻辑
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => 
      order.getCustomerId().equals(customerId)
    );
  }
  
  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => 
      order.getStatus().equals(status)
    );
  }
  
  async remove(id: string): Promise<void> {
    // 1. 从缓存移除
    this.cache.delete(id);
    
    // 2. 从本地存储移除
    await this.storageService.remove(`order:${id}`);
    
    // 3. 从服务端删除
    try {
      await this.apiService.deleteOrder(id);
    } catch (error) {
      if (this.isOffline()) {
        this.markForDeletion(id);
      } else {
        throw error;
      }
    }
  }
  
  // 离线同步
  async syncPendingChanges(): Promise<void> {
    const pendingSync = await this.storageService.get('pending_sync') || [];
    
    for (const orderData of pendingSync) {
      try {
        await this.syncToServer(orderData.order, orderData.events);
        // 同步成功，从待同步列表移除
        await this.removePendingSync(orderData.orderId);
      } catch (error) {
        console.warn(`Failed to sync order ${orderData.orderId}:`, error);
      }
    }
  }
  
  private mapToOrder(orderData: any): Order {
    // 将API数据映射为领域对象
    const order = new Order(
      new OrderId(orderData.id),
      new CustomerId(orderData.customerId)
    );
    
    // 重建订单状态
    // 这里可以通过事件重放来重建，或者直接从快照恢复
    return order;
  }
  
  private serializeOrder(order: Order): string {
    const snapshot = order.createSnapshot();
    return JSON.stringify(snapshot);
  }
  
  private deserializeOrder(data: string): Order {
    const snapshot = JSON.parse(data);
    return Order.fromSnapshot(snapshot);
  }
  
  private async syncToServer(order: Order, events: DomainEvent[]): Promise<void> {
    // 将领域事件转换为API命令
    const commands = events.map(event => this.eventToCommand(event));
    
    // 发送到服务端
    for (const command of commands) {
      await this.apiService.executeCommand(command);
    }
  }
  
  private isOffline(): boolean {
    return !navigator.onLine;
  }
}
```

## 🚀 在React组件中集成DDD

### 🎯 React + DDD的集成模式

```typescript
// DDD上下文Provider
const DomainContext = React.createContext<{
  orderService: OrderApplicationService;
  inventoryService: InventoryService;
  eventBus: EventBus;
} | null>(null);

export function DomainProvider({ children }: { children: React.ReactNode }) {
  const domainServices = useMemo(() => {
    const eventBus = new InMemoryEventBus();
    const orderRepository = new FrontendOrderRepository(apiService, storageService, eventStore);
    const orderService = new OrderApplicationService(commandBus, queryBus);
    const inventoryService = new InventoryService(inventoryRepository);
    
    // 注册事件处理器
    eventBus.subscribe('OrderCheckedOut', new InventoryEventHandler(inventoryService));
    eventBus.subscribe('OrderCheckedOut', new NotificationEventHandler(emailService, smsService));
    
    return { orderService, inventoryService, eventBus };
  }, []);
  
  return (
    <DomainContext.Provider value={domainServices}>
      {children}
    </DomainContext.Provider>
  );
}

// 订单页面组件
function OrderPage({ orderId }: { orderId: string }) {
  const domainServices = useContext(DomainContext);
  const [orderView, setOrderView] = useState<OrderView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 加载订单数据
  useEffect(() => {
    loadOrder();
  }, [orderId]);
  
  const loadOrder = async () => {
    try {
      setLoading(true);
      const order = await domainServices.orderService.getOrder(orderId);
      setOrderView(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // 取消订单
  const handleCancelOrder = async (reason: string) => {
    try {
      await domainServices.orderService.cancelOrder(orderId, reason);
      await loadOrder(); // 重新加载数据
    } catch (err) {
      setError(err.message);
    }
  };
  
  // 添加商品
  const handleAddItem = async (productId: string, quantity: number, price: number) => {
    try {
      await domainServices.orderService.addOrderItem(orderId, productId, quantity, price);
      await loadOrder();
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!orderView) return <NotFoundMessage />;
  
  return (
    <div className="order-page">
      <OrderHeader order={orderView} />
      
      <OrderItems 
        items={orderView.items}
        onAddItem={handleAddItem}
        canEdit={orderView.status.code === 'DRAFT'}
      />
      
      <OrderSummary summary={orderView.summary} />
      
      <OrderActions 
        actions={orderView.actions}
        onCancel={handleCancelOrder}
      />
      
      <OrderTimeline timeline={orderView.timeline} />
    </div>
  );
}

// 订单操作组件
function OrderActions({ 
  actions, 
  onCancel 
}: { 
  actions: ActionView[]; 
  onCancel: (reason: string) => void;
}) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  const handleCancel = () => {
    onCancel(cancelReason);
    setShowCancelModal(false);
    setCancelReason('');
  };
  
  return (
    <div className="order-actions">
      {actions.map(action => (
        <button
          key={action.type}
          disabled={!action.enabled}
          onClick={() => {
            if (action.type === 'cancel') {
              setShowCancelModal(true);
            }
            // 处理其他操作...
          }}
        >
          {action.label}
        </button>
      ))}
      
      {showCancelModal && (
        <Modal onClose={() => setShowCancelModal(false)}>
          <h3>取消订单</h3>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="请输入取消原因"
          />
          <div>
            <button onClick={handleCancel}>确认取消</button>
            <button onClick={() => setShowCancelModal(false)}>取消</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// 自定义Hook：订单管理
function useOrder(orderId: string) {
  const domainServices = useContext(DomainContext);
  const [orderView, setOrderView] = useState<OrderView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const order = await domainServices.orderService.getOrder(orderId);
      setOrderView(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId, domainServices]);
  
  const cancelOrder = useCallback(async (reason: string) => {
    try {
      await domainServices.orderService.cancelOrder(orderId, reason);
      await loadOrder();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [orderId, domainServices, loadOrder]);
  
  const addItem = useCallback(async (productId: string, quantity: number, price: number) => {
    try {
      await domainServices.orderService.addOrderItem(orderId, productId, quantity, price);
      await loadOrder();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [orderId, domainServices, loadOrder]);
  
  useEffect(() => {
    loadOrder();
  }, [loadOrder]);
  
  return {
    order: orderView,
    loading,
    error,
    actions: {
      cancel: cancelOrder,
      addItem,
      reload: loadOrder
    }
  };
}
```

## 🎯 总结与最佳实践

### 💡 前端DDD的核心价值

经过多个复杂项目的实践，我总结出前端DDD的核心价值：

1. **业务逻辑的明确表达**：业务概念和规则在代码中得到直接体现
2. **复杂度的有效管理**：通过领域模型组织复杂的业务逻辑
3. **团队协作的统一语言**：开发者和业务专家使用相同的概念和术语
4. **代码的高内聚低耦合**：相关的业务逻辑聚合在一起，减少跨组件的依赖
5. **变更的影响可控**：业务规则变更时，影响范围局限在特定的领域对象中

### 🚀 实施建议

#### 📋 适用场景评估

```typescript
// DDD适用性评估框架
interface DDDApplicabilityAssessment {
  // 强烈推荐
  highlyRecommended: {
    businessComplexity: 'high';        // 业务逻辑复杂
    domainKnowledge: 'specialized';     // 需要专业领域知识
    teamSize: 'medium-to-large';       // 中大型团队
    projectLifetime: 'long-term';      // 长期维护项目
    changeFrequency: 'high';           // 业务规则变化频繁
  };
  
  // 可以考虑
  consider: {
    businessComplexity: 'medium';      // 中等业务复杂度
    domainKnowledge: 'moderate';       // 适中的领域知识要求
    teamSize: 'small-to-medium';       // 中小型团队
    projectLifetime: 'medium-term';    // 中期项目
    changeFrequency: 'moderate';       // 适中的变化频率
  };
  
  // 不推荐
  notRecommended: {
    businessComplexity: 'low';         // 简单业务逻辑
    domainKnowledge: 'minimal';        // 简单领域知识
    teamSize: 'small';                 // 小型团队
    projectLifetime: 'short-term';     // 短期项目
    changeFrequency: 'low';            // 低变化频率
  };
}
```

#### 🎯 渐进式实施路径

1. **第一阶段：核心领域识别** (2-3周)
   - 识别核心业务领域
   - 梳理关键业务概念
   - 建立领域词汇表

2. **第二阶段：领域模型设计** (3-4周)
   - 设计聚合边界
   - 定义实体和值对象
   - 识别领域服务

3. **第三阶段：基础设施建设** (2-3周)
   - 建立仓储模式
   - 实现事件系统
   - 搭建CQRS架构

4. **第四阶段：React集成** (3-4周)
   - 设计React组件架构
   - 实现自定义Hook
   - 建立状态管理策略

### ⚠️ 常见陷阱与解决方案

#### 陷阱1：过度工程化
**问题**：为简单的CRUD操作引入复杂的DDD架构

**解决方案**：
```typescript
// ❌ 过度工程化：简单的用户资料CRUD
class UserProfileAggregate extends AggregateRoot {
  // 100行代码处理简单的姓名、邮箱更新
}

// ✅ 适度设计：简单场景用简单方案
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile>();
  
  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await api.updateUserProfile(userId, updates);
    setProfile(updated);
  };
  
  return { profile, updateProfile };
}
```

#### 陷阱2：领域模型贫血化
**问题**：领域对象只有数据，没有行为

**解决方案**：
```typescript
// ❌ 贫血模型
interface Order {
  id: string;
  amount: number;
  status: string;
}

function orderService() {
  const calculateTotal = (order: Order, items: OrderItem[]) => {
    // 业务逻辑在服务中
  };
  
  const canCancel = (order: Order) => {
    // 业务逻辑在服务中
  };
}

// ✅ 充血模型
class Order extends AggregateRoot {
  private amount: Money;
  private status: OrderStatus;
  private items: OrderItem[];
  
  // 业务逻辑在领域对象中
  calculateTotal(): Money {
    return this.items.reduce(
      (sum, item) => sum.add(item.getTotalPrice()),
      Money.zero()
    );
  }
  
  canCancel(): boolean {
    return this.status.canTransitionTo(OrderStatus.CANCELLED);
  }
  
  cancel(reason: string): void {
    if (!this.canCancel()) {
      throw new OrderCannotBeCancelledException(this.getId());
    }
    // 执行取消逻辑
  }
}
```

### 🎯 最终建议

DDD在前端的价值不在于技术本身，而在于**让复杂的业务逻辑变得可理解、可维护、可扩展**。

关键成功因素：

1. **业务驱动**：从业务问题出发，而不是为了技术而技术
2. **渐进实施**：从核心领域开始，逐步扩展到其他领域
3. **团队共识**：确保团队理解DDD的价值和实施方法
4. **持续重构**：领域模型需要随着业务理解的深入而演进
5. **工具支持**：建立好的开发工具和流程支持DDD实践

记住：**好的架构是演进出来的，DDD帮助我们以业务为中心进行这种演进**。

---

*在前端应用DDD，让我们能够用代码直接表达业务，让复杂的逻辑变得清晰可理解。希望这些实践经验能够帮助你在复杂业务场景中找到更好的架构解决方案。*
