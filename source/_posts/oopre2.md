---
title: 一周通关oopre（二）
date: 2026-10-27 12:29:00
tags:
  - oopre
---

## 六 药水家族谱
这一部分，我们要在药水和装备同一视为“物品”，而药水和装备又细分为不同种类。

那么这就需要学习**继承**：让相关的类共享相同的部分，再分别保存自己的特点。

这一部分我们先来学习一下类之间的关系和构造过程。

### 1 先看重复出现的数据
假设我们分别定义药水和装备如下：
```Java
public class Potion {
    private String potionId;
    private int amplifier;

    // 构造方法、getter 等
}
```
```Java
public class Equipment {
    private String equipmentId;
    private int durability;

    // 构造方法、getter 等
}
```
它们各有特点：药水具有效果数值`amplifier`，而装备具有耐久度`durability`。

但它们也有共同点：都是一件物品，都具有物品ID，都需要对其进行添加、读取、删除等操作。

因此，我们可以把共同部分放进一个新的类：
```Java
public class Item {
    private String itemId;

    public Item(String itemId) {
        this.itemId = itemId;
    }

    public String getItemId() {
        return itemId;
    }
}
```
然后表达：
```
Item：物品
├── Potion：药水
└── Equipment：装备
```
这里`Item` 是父类，`Potion` 和 `Equipment` 是子类。

因此，之前我们药水中专用的`potionId`和`getPotionId()`可以正式更名为`itemId`和`getItemId()`啦~

### 2 `extends`:声明 “是一种”的关系
药水类可以改成：
```Java
public class Potion extends Item {
    private int amplifier;

    public Potion(String itemId, int amplifier) {
        super(itemId);
        this.amplifier = amplifier;
    }

    public int getAmplifier() {
        return amplifier;
    }
}
```
开头第一行，表示：
 > `Potion`继承`Item`，药水（Potion）“是一种”物品（Item）。

此时`Potion`中虽然没有再次编写`getItemId()`，但药水对象仍然可以使用父类提供的这个方法：
```Java
Potion potion = new Potion("heal1", 50);

System.out.println(potion.getItemId());    // heal1
System.out.println(potion.getAmplifier()); // 50
```
不过，不能仅因为两个类有重复代码，就认定它们之间应该建立继承关系，花费的时间精力还不如直接ctrl c+v。

### 3 `super(itemId)`：父类初始化共同部分
来看构造方法：
```Java
public Potion(String itemId, int amplifier) {
    super(itemId);
    this.amplifier = amplifier;
}
```
这里的`super(itemId)`表示父类的构造方法，把ID交给父类初始化。

对应的父类构造方法是：
```Java
public Item(String itemId) {
    this.itemId = itemId;
}
```

### 4 不写`super(...)`会怎样
此时突发一种状况，就是我与昨晚写完第七章后没有保存直接睡觉了，今天早上起来东西还在，但是提交的时候这个**校园网死活登不上，关掉魔法后github无法登录，导致一夜丢失所有存稿。

我很好奇，竟然连github都无法直接访问，是人啊！！！！

好吧，话说回来，我只能凭借印象继续写下去，而且由于过于悲伤，可能会写的有点简略，不过在全书完结后会修文的，大家放心食用！

假设误写：
```Java
public Potion(String itemId, int amplifier) {
    this.amplifier = amplifier;
}
```
没有显式调用父类构造方法时，编译器会尝试调用父类的无参构造方法：
```Java
super();
```
但我们的 `Item` 只有：
```Java
public Item(String itemId) {
    this.itemId = itemId;
}
```
并没有：
```Java
public Item() {
}
```
所以会编译失败。

编译器不会根据参数名相同，就自动替你写：
```Java
super(itemId);
```
你需要明确告诉它，父类构造需要什么参数。

这也引出一个规则：
> 一个类完全没有声明构造方法时，编译器才会为它提供默认的无参构造方法。

### 5 构造方法不会被子类继承
父类中有：
```Java
public Item(String itemId) {
    this.itemId = itemId;
}
```
不代表 `Potion `自动获得一个：
```Java
public Potion(String itemId)
```
构造方法。

我们现在定义的 Potion 构造方法是：
```Java
public Potion(String itemId, int amplifier)
```
所以需要这样创建：
```Java
new Potion("heal1", 50);
```
而不能这样：
```Java
new Potion("heal1"); // 没有对应的 Potion 构造方法
```
区别要记清：
- 父类的合适实例方法，可以被子类继承使用。
- 构造方法不会被继承，需要在各自类中定义。
- 子类构造时，可以通过 super(...) 调用父类构造方法。

### 6 父类字段是 `private`，子类能直接用吗
我们的父类中：
```Java
private String itemId;
```
因此，在 `Potion` 中直接写：
```Java
public void printId() {
    System.out.println(itemId); // 编译错误
}
```
原因是 `itemId` 是 `Item` 的私有字段，子类代码不能直接访问。

但可以使用父类提供的公开方法：
```Java
public void printId() {
    System.out.println(getItemId());
}
```

所以要区分：
> 子类对象包含父类定义的私有状态，但子类代码没有直接访问这些私有字段的权限。

不需要为了让子类方便，就把所有字段改成 `public` 。

### 7 不要在子类里再声明一份同名字段

有时看到不能访问父类的 itemId，可能会这样“修复”：
public class Potion extends Item {
    private String itemId;

    public Potion(String itemId, int amplifier) {
        super(itemId);
        this.itemId = itemId;
    }
}
这实际上增加了另一份字段：
Potion 对象
├── Item 定义的 itemId
└── Potion 自己定义的 itemId
两份字段互相独立，容易出现一份更新了、另一份没有更新的情况。

更合适的设计是：
public class Potion extends Item {
    private int amplifier;

    public Potion(String itemId, int amplifier) {
        super(itemId);
        this.amplifier = amplifier;
    }
}
让 ID 始终由 Item 管理，药水效果由 Potion 管理。

十、再向下细分：恢复药水也是一种药水

第三次作业中，有恢复药水、伤害药水等具体种类。

可以继续建立关系：
Item
├── Potion
│   ├── HealPotion
│   ├── AbsorptionPotion
│   ├── DamagePotion
│   └── StrengthPotion
└── Equipment
以恢复药水为例：
public class HealPotion extends Potion {
    public HealPotion(String itemId, int amplifier) {
        super(itemId, amplifier);
    }
}
这里的直接父类是 Potion，因此：
super(itemId, amplifier);
调用的是 Potion 的构造方法。

创建：
HealPotion heal = new HealPotion("heal1", 50);
关键初始化顺序为：
HealPotion 构造方法
        ↓ 调用
Potion 构造方法
        ↓ 调用
Item 构造方法
        ↓ 初始化 ID，返回
Potion 初始化效果数值，返回
        ↓
HealPotion 构造方法继续执行
最终得到一个 HealPotion 对象，它具有整条继承关系中定义的相关状态和可用方法：
System.out.println(heal.getItemId());    // 来自 Item
System.out.println(heal.getAmplifier()); // 来自 Potion
目前 HealPotion 还没有写恢复血量的行为。下一课会增加具体行为，并解释怎样通过共同的方法调用不同药水的效果。

十一、把今天的最小示例放在一起

下面是三个文件，分别保存。

Item.java：
public class Item {
    private String itemId;

    public Item(String itemId) {
        this.itemId = itemId;
    }

    public String getItemId() {
        return itemId;
    }
}
Potion.java：
public class Potion extends Item {
    private int amplifier;

    public Potion(String itemId, int amplifier) {
        super(itemId);
        this.amplifier = amplifier;
    }

    public int getAmplifier() {
        return amplifier;
    }
}
HealPotion.java：
public class HealPotion extends Potion {
    public HealPotion(String itemId, int amplifier) {
        super(itemId, amplifier);
    }
}
在入口方法中调用：
HealPotion heal = new HealPotion("heal1", 50);

System.out.println(heal.getItemId());
System.out.println(heal.getAmplifier());
输出：
heal1
50
注意，新版 Potion 已经改为继承 Item。如果放入之前的教学工程，应替换旧版定义，并将旧的 getPotionId() 调用相应改为 getItemId()。

Java 的类只能直接继承一个父类。例如：
public class HealPotion extends Potion
是合法的；不能同时写两个直接父类。后面学接口时，会看到一个类可以实现多个接口。

## 七、同招不同味
上一课，我们建立了这条继承关系：
```
Item
└── Potion
    ├── HealPotion
    └── DamagePotion
```
这一次要实现：同样调用 `potion.use(target)`，恢复药水负责恢复体力，伤害药水负责造成伤害。

这里涉及三个概念：
- 方法重写：子类提供自己的实现。
- 多态：通过共同类型调用，执行实际对象对应的实现。
- 抽象类：规定共同要求，把部分实现留给子类。

我们用药水的例子继续进行说明。

### 1 先明确谁负责什么

使用恢复药水时，恢复药水决定恢复多少体力，玩家负责增加体力并保证不超过最大体力。

使用伤害药水时，伤害药水决定，造成多少伤害，玩家负责先扣附加体力，再扣普通体力。

所以，药水类中可以写：
```Java
target.restoreHitPoint(getAmplifier());
```
或者：
```Java
target.receiveDamage(getAmplifier());
```
这样，药水不需要直接操作玩家的私有字段，玩家也不需要知道是哪一种药水发起了操作。

那么`Player`就可以写成：
```Java
public class Player {
    private int hitPoint;
    private int maxHitPoint;
    private int extraHitPoint;

    public Player(int hitPoint, int maxHitPoint, int extraHitPoint) {
        this.hitPoint = hitPoint;
        this.maxHitPoint = maxHitPoint;
        this.extraHitPoint = extraHitPoint;
    }

    public void restoreHitPoint(int amount) {
        hitPoint = Math.min(maxHitPoint, hitPoint + amount);
    }

    public void receiveDamage(int damage) {
        int absorbed = Math.min(extraHitPoint, damage);

        extraHitPoint -= absorbed;
        int remaining = damage - absorbed;

        hitPoint = Math.max(0, hitPoint - remaining);
    }

    public int getHitPoint() {
        return hitPoint;
    }

    public int getExtraHitPoint() {
        return extraHitPoint;
    }
}
```

### 2 所有药水都能使用，但不存在统一的使用效果
恢复药水和伤害药水都有：
```Java
use(Player target)
```
但如果问“普通的 `Potion` 使用后应该产生什么效果”，目前无法给出一个明确的答案。

可以把 `Potion` 改成抽象类：
```Java
public abstract class Potion extends Item {
    private int amplifier;

    public Potion(String itemId, int amplifier) {
        super(itemId);
        this.amplifier = amplifier;
    }

    public int getAmplifier() {
        return amplifier;
    }

    public abstract void use(Player target);
}
```
这里新增了两个 `abstract`。
```Java
public abstract class Potion
```
表示 `Potion` 是抽象类，不能直接创建这种类的对象：
```Java
new Potion("p1", 5); // 编译错误
```
而：
```Java
public abstract void use(Player target);
```
表示这是抽象方法：有方法声明,没有方法体,具体实现留给子类。

它表达的要求是：
> 每一种可以实例化的具体药水，都必须提供如何使用的实现。

### 3 方法重写：子类实现自己的 `use`
恢复药水：
```Java
public class HealPotion extends Potion {
    public HealPotion(String itemId, int amplifier) {
        super(itemId, amplifier);
    }

    @Override
    public void use(Player target) {
        target.restoreHitPoint(getAmplifier());
    }
}
```
伤害药水：
```Java
public class DamagePotion extends Potion {
    public DamagePotion(String itemId, int amplifier) {
        super(itemId, amplifier);
    }

    @Override
    public void use(Player target) {
        target.receiveDamage(getAmplifier());
    }
}
```
两个类都实现了：
```Java
public void use(Player target)
```
但方法体不同。

这称为方法重写，也叫 `override`。这里是子类对父类声明的实例方法提供具体实现。

你可以直接分别调用：
```Java
HealPotion heal = new HealPotion("heal1", 5);
DamagePotion damage = new DamagePotion("damage1", 6);

heal.use(target);
damage.use(target);
```

### 4 父类引用可以指向子类对象
除了：
```Java
HealPotion heal = new HealPotion("heal1", 5);
```
还可以写：
```Java
Potion potion = new HealPotion("heal1", 5);
```
左边是父类类型，右边创建的是子类对象。

这成立，因为恢复药水是一种药水。

这种将子类引用作为父类类型使用的过程，称为向上转型，一般不需要显式写强制转换。

这里有两个需要区分的类型：
| 概念 | 本例是什么 |
|---|---|
| 变量的声明类型 | `Potion` |
| 所引用对象的实际类型 | `HealPotion` |

关系是：`Potion` 类型的变量 `potion`,实际指向一个 `HealPotion` 对象
对象并没有因为左边写了 `Potion`，就变成普通药水，也没有丢掉恢复药水的身份。

### 5 多态
多态能够帮助我们实现同一条调用执行不同实现。

现在看：
```Java
Potion first = new HealPotion("heal1", 5);
Potion second = new DamagePotion("damage1", 6);
```
调用：
```Java
first.use(target);
second.use(target);
```
执行时：
```
first.use(target)
        ↓
first 指向 HealPotion 对象
        ↓
执行 HealPotion 的 use
```
```
second.use(target)
        ↓
second 指向 DamagePotion 对象
        ↓
执行 DamagePotion 的 use
```
这就是当前我们要掌握的多态：
> 通过父类类型的引用调用被重写的实例方法，实际执行哪一份实现，由对象的实际类型决定。

这个选择实现的过程也被称为动态绑定。

### 6 声明类型决定能否调用
虽然：
```Java
Potion potion = new HealPotion("heal1", 5);
```
实际指向恢复药水，但编译器首先根据变量声明的 `Potion` 类型检查调用是否合法。

可以调用：
```Java
potion.getItemId();    // Item 提供
potion.getAmplifier(); // Potion 提供
potion.use(target);    // Potion 声明
```
假设你额外在 `HealPotion` 中定义了：
```Java
public void showHealingMessage() {
    System.out.println("恢复药水准备好了");
}
```
但 `Potion` 没有这个方法，那么：
```Java
Potion potion = new HealPotion("heal1", 5);

potion.showHealingMessage(); // 编译错误
```
即使实际对象是 `HealPotion`，也不能直接通过这个 `Potion` 类型的变量调用它特有的方法。

可以分两步理解：

编译时,根据变量的声明类型，检查有没有这个可调用的方法。

运行时,对于被重写的实例方法，根据对象实际类型选择实现。


同样：
```Java
Item item = new HealPotion("heal1", 5);
```
虽然赋值合法，但当前 `Item` 中没有声明 `use`，所以：
```Java
item.use(target); // 编译错误
```
但不用担心，之后我们学习接口和类型转换时，会解决“从物品背包中取出 Item，怎样判断并使用它”。


### 7 `@Override`：让编译器检查是否重写了方法
看这个错误：
```Java
@Override
public void Use(Player target) {
    target.restoreHitPoint(getAmplifier());
}
```
方法名写成了大写 `Use`。

由于加了 `@Override`，编译器会直接指出这个方法没有重写父类方法。

再看：
```Java
@Override
public void use() {
}
```
父类要求的是：
```Java
use(Player target)
```
少了参数，也不是同一个方法签名。

因此，在重写时应该特别核对方法名、参数类型和顺序、返回类型以及访问权限。

btw，`@Override`本身不负责产生多态，它的主要作用时帮助编译器检查你的重写意图，可以不加，但还是建议加上。

### 8 重写与重载
这两个名字很像，但不是一回事。

重写：父子类之间，对同一个实例方法提供不同实现。
```Java
// 父类
public abstract void use(Player target);
// 子类
@Override
public void use(Player target) {
    target.restoreHitPoint(getAmplifier());
}
```
重载：方法名相同，参数列表不同。

在同一个类中：
```Java
public void printInfo() {
    System.out.println("基本信息");
}

public void printInfo(String prefix) {
    System.out.println(prefix + " 基本信息");
}
```
调用时通过参数区分：
```Java
printInfo();
printInfo("玩家");
```

列表对照一下：
| 概念 | 核心区别 |
|---|---|
| 重写 override | 子类重新实现父类的同一个实例方法 |
| 重载 overload | 同名方法使用不同参数列表 |

哦对，如果不改变参数列表，只改变返回类型可以实现重载吗？

答案是不能！不改变参数列表无法在调用时对两者进行区分。

### 9 抽象类可以有什么？
抽象类是不是只能放抽象方法？

不是哦~
我们的 `Potion` 同时包含：
```Java
private int amplifier;              // 字段
public Potion(...) { ... }          // 构造方法
public int getAmplifier() { ... }   // 普通方法
public abstract void use(...);      // 抽象方法
```
抽象类很适合表达：一部分东西已经统一（例如ID、效果数值等），另一部分必须由具体种类决定。

### 10 多态的效用
现在可以把不同药水放进同一个列表：
```Java
ArrayList<Potion> potions = new ArrayList<>();

potions.add(new HealPotion("heal1", 5));
potions.add(new DamagePotion("damage1", 6));
```
然后：
```Java
for (Potion potion : potions) {
    potion.use(target);
}
```
这样就不需要我们通过`else`和`if`来实现啦！


## 八、技能通行证
上一课，我们已经能通过
```Java
Potion potion = new HealPotion("heal1", 5);
potion.use(target);
```
调用具体药水的效果。
但现在我们的背包统一保存的是：
```Java
ArrayList<Item> items;
```
取出来的引用类型是`Item`，比如`Potion`可以使用，但目前`Equipment`却没有使用功能。

这次我们就学习如何取出一个`item`后判断能否进行使用。

在Java中，我们使用**接口**来实现这一判断，用`interface`来表达这种约定。

### 1 定义`Usable`接口
建立`Usable.java`：
```Java
public interface Usable {
    void use(Player target);
}
```
首先，`public interface Usable`表示定义一个名为`Usable`的公开接口。

接口名`Usable`是我们自己定义的。

里面`void use(Player target)`声明：具备这种能力的对象，应该提供什么方法：方法名为`use`，接收一个`Player`引用，不返回值。

这个接口其实隐含了：
```Java
public abstract void use(Player target);
```
接口当然也可以定义其它种类的方法，但目前我们先掌握这种抽象方法形式。

### 2 `implements`：声明自己实现了这份约定
上一课的`Potion`可以修改为：
```Java
public abstract class Potion extends Item implements Usable {
    private int amplifier;

    public Potion(String itemId, int amplifier) {
        super(itemId);
        this.amplifier = amplifier;
    }

    public int getAmplifier() {
        return amplifier;
    }

    @Override
    public abstract void use(Player target);
}
```
重点看类声明;
```Java
public abstract class Potion extends Item implements Usable
```
它表达三个信息：
| 部分 | 含义 |
|---|---|
| `abstract class Potion` | 药水是抽象类 |
| `extends Item` | 药水是一种物品 |
| `implements Usable` | 药水具有接口约定的可使用能力 |

恢复药水仍然可以写：
```Java
public class HealPotion extends Potion {
    public HealPotion(String itemId, int amplifier) {
        super(itemId, amplifier);
    }

    @Override
    public void use(Player target) {
        target.restoreHitPoint(getAmplifier());
    }
}
```
它通过继承 `Potion`，也具有 `Usable` 能力。

相比于抽象类及继承，接口的关注点在于**可使用能力**的约定，它不需要关心具体数据及是心啊方法。

而且，如果玩家除了背包，手中还有东西(比如食物），在判断手中东西是否能用时，也可以实现`Usable`，不必为了获得“可使用能力”就继承`Potion`。

另外，一个类只能继承一个父类，而一个类可以实现多个接口。它可以在保留自身继承关系的同时，声明自己具有多种能力。比如，恢复药水只能用在己方阵营中，而伤害药水只能用于敌方阵营，此时我们可以再添加两个接口。


### 3 问题：背包里取出的是`Item`
现在我们每个玩家都有一个背包，而背包里装的都是`Item`。

假设：
```Java
ArrayList<Item> items = new ArrayList<>();

items.add(new HealPotion("heal1", 5));
items.add(new Equipment("sword1", 100));
```
这里假设装备类的构造方法接收ID和耐久度，并且 `Equipment` 没有实现 `Usable`。

此时我们取出一个物品：
```Java
Item item = items.get(0);
```
虽然它实际上是恢复药水，但直接写`item.use(target);`仍然会编译失败。

因为`Item`中没有提供`use`方法。

但首先，我们需要先判断这个`Item`是`Potion`还是`Equipment`，也就是说，我们先要判断这个`Item`能否使用。为了实现这一功能，我们需要`instanceof`。

### 4 `instanceof`：检查对象能否被视为某种类型
写法：
```Java
item instanceof Usable
```
它返回一个`boolean`。

例如：
```Java
Item first = new HealPotion("heal1", 5);
Item second = new Equipment("sword1", 100);

System.out.println(first instanceof Usable);  // true
System.out.println(second instanceof Usable); // false
```
判断的是对象的实际类型是否符合目标类型，而不是只看变量声明。

因此，即使变量声明为 `Item`，恢复药水仍然会得到 `true`。

但`instanceof`并不是绑死在接口上，它同样可以用于检查类关系：
```Java
System.out.println(first instanceof Item);       // true
System.out.println(first instanceof Potion);     // true
System.out.println(first instanceof HealPotion); // true
```
如果对`null`使用，则会返回`false`。

### 4 强制类型转换
检查通过之后，可以进行转换：
```Java
if (item instanceof Usable) {
    Usable usable = (Usable) item;
    usable.use(target);
}
```
最关键的一行是`Usable usable = (Usable) item;`。现在多了一个`Usable`类型的引用变量，允许调用接口规定的方法。

如果不检查就进行强制转换会发生什么呢？

假设我们有一个：
```Java
Item item = new Equipment("sword1", 100);
```
刚刚说过，`Equipment`无法进行使用，没有`Usable`，如果直接执行：
```Java
Usable usable = (Usable) item;
```
运行时会抛出：`ClassCastException`，即类型转换异常。

在Java中，强制转换不意味着“不管原来时什么，都把它变成我指定的类型”，它要求实际对象本来就符合目标类型。

因此，对于可能包含不同物品的背包，应该先检查：
```Java
if (item instanceof Usable) {
    Usable usable = (Usable) item;
    usable.use(target);
} else {
    // 根据要求进行处理
}
```

那么，这时候我们就想，为什么还要进行强制转换呢？不用不行吗？
来看：
```Java
Item item = new HealPotion("heal1", 5);

if (item instanceof Usable) {
    item.use(target); // 编译错误
}
```
问题是，`Item`类中，并没有声明`use`（`use`是`Potion`中的抽象方法哦），因此编译器无法通过。

在强制类型转换后，创建了一个新的引用变量：`Usable usable`。而`Usable`中声明了`void use(Player target;`，因此允许调用。当然我们也可以强制转换为`Potion`，如果你确定一定是药水而非其它可用类。

总结一下，`item instanceof Usable`回答“有没有这种使用能力”，而`usable.use(target)`负责“执行这种能力”。

## 九、分身vs克隆
在第四次作业中，我们主要探讨了深复制与浅复制。

以作业题为例。魔法世界中有魔法书架和魔法书，书架可以进行复制，复制之后，原书架爱和副本应该能够独立修改。

但“复制”很容易只做了一半：
- 看起来有两个书架，实际上共用一个书籍列表。
- 列表已经分开了，里面的书却还是同一批对象。

这一部分我们要学会沿着引用逐层检查：**哪些对象是新的，哪些对象仍然共享**。

### 1 先从一本书开始
书有名字和魔咒：
```Java
public class Book {
    private String name;
    private String magic;

    public Book(String name, String magic) {
        this.name = name;
        this.magic = magic;
    }

    public void appendMagic(String suffix) {
        magic = magic + suffix;
    }

    public boolean containsMagic(String text) {
        return magic.contains(text);
    }

    public Book copy() {
        return new Book(name, magic);
    }
}
```
其中：
```Java
magic.contains(text)
```
负责检查魔咒是否包含指定文本，并返回`boolean`。

例如：
```Java
Book book = new Book("BookA", "#123#");

System.out.println(book.containsMagic("123")); // true
```

### 2 引用赋值
```Java
Book first = new Book("BookA", "#123#");
Book second = first;
```
此时`first`和`second`都指向同一个`Book`对象。

执行：
```Java
second.appendMagic("_new");
```
再检查：
```Java
System.out.println(first.containsMagic("_new"));  // true
System.out.println(second.containsMagic("_new")); // true
```
因为修改的是同一本书。

也就是说，`Book second = first;`是引用赋值，并没有赋值书对象。

### 3 创建新书：数据相同，对象独立
改成：
```Java
Book first = new Book("BookA", "#123#");
Book second = new Book("BookA", "#123#");
```
这我不用多说，读者也能明白吧！`first`和`second`指向的是两本不同的书，只是书的数据是一样的。这时候我们修改一个的值并不会影响另一个。

同样我们可以执行：
```Java
Book second = first.copy();
```
因为`copy()`内部执行了：
```Java
return new Book(name, magic);
```

那如果写成：
```Java
public Book copy() {
    return this;
}
```
返回的仍然是原对象，跟上一节中的引用赋值是一样的。

### 4 列表也有两层
现在有一个书籍列表：
```Java
ArrayList<Book> first = new ArrayList<>();

first.add(new Book("BookA", "#123#"));
```
注意这里至少有两个对象：
1. `ArrayList` 对象。
2. `Book` 对象。
如果执行：
```Java
ArrayList<Book> second = first;
```
两个变量引用的是同一个列表。

所以：
```Java
second.clear();
```
清空列表后：
```Java
System.out.println(first.size()); // 0
```
通过 `first` 看到的也已经是空列表。

这仍然只是引用赋值，连列表对象都没有复制。

### 5 新建列表，但没有复制书（浅复制）
Java 可以这样创建列表：
```Java
ArrayList<Book> second = new ArrayList<>(first);
```
这里把现有集合交给构造方法，创建一个包含相同元素的新列表。

但对于 `Book` 这样的引用类型，复制过去的是元素保存的引用：
```
first  → 列表 A ──┐
                  ├──→ 同一个 Book 对象
second → 列表 B ──┘
```
这时：
```Java
first == second
```
是 `false`，因为列表不同。

但：
```Java
first.get(0) == second.get(0)
```
是 `true`，因为里面引用的是同一本书。

观察两种操作。

先修改书：
```Java
second.get(0).appendMagic("_new");

System.out.println(
    first.get(0).containsMagic("_new")
); // true
```
修改会相互影响，因为书仍然共享。

再清空副本列表：
```Java
second.clear();

System.out.println(first.size());  // 1
System.out.println(second.size()); // 0
```
清空不会相互影响，因为列表已经分开。

这就是典型的浅复制：当前这一层创建了新对象，但其中的引用仍然指向原来的内部对象。

这有点像电子小说。我们每个人都拥有自己的书架，然而书架里的书是一样的，如果作者进行了更新和修文，那么我们书架中的书也会进行更新。

### 6 深复制：把需要独立修改的内部对象也复制出来
如果要求列表和书都独立，可以写：
```Java
ArrayList<Book> second = new ArrayList<>();

for (Book book : first) {
    second.add(book.copy());
}
```
关键区别在这里：
```Java
second.add(book.copy());
```
而不是：
```Java
second.add(book);
```
前者添加新书的引用，后者添加原书的引用。

现在：
```Java
second.get(0).appendMagic("_new");
```
不会改变原来的书：
```Java
System.out.println(
    first.get(0).containsMagic("_new")
); // false
```
同时，清空副本列表，也不会影响原列表。

对于这个例子，列表以及其中可变的书对象都被独立复制了，满足我们需要的深复制效果。

### 7 书架代码示意
那么，我们可以这样定义一个书架：
```Java
import java.util.ArrayList;

public class BookShelf {
    private int id;
    private ArrayList<Book> books;

    public BookShelf(int id) {
        this.id = id;
        this.books = new ArrayList<>();
    }

    // 其它方法

    public BookShelf copy(int newId) {
        BookShelf result = new BookShelf(newId);

        for (Book book : books) {
            result.addBook(book.copy());
        }

        return result;
    }
}
```

### 8 `final`究竟指的什么
我突然想起来没有正式介绍过`final`，那么趁着这个机会，来详细说明一下。

书架代码中有：
```Java
private final ArrayList<Book> books;
```
这里的 `final` 限制的是这个字段保存的引用：初始化完成后，不能让它改为引用另一个列表。

因此：
```Java
books = new ArrayList<>(); // 已初始化后再次赋值，不允许
```
但仍然可以：
```Java
books.add(book);
books.clear();
```
因为这些操作没有更换 `books` 保存的引用，只是在修改原列表的内容。

也仍然可以：
```Java
books.get(0).appendMagic("_new");
```
修改里面的书。

也就是说，它规定了字段保存的引用对象不变，而不代表不能对对象进行修改。

所以，看到 `final` 字段时，不能据此判断内部对象已经不可变，更不能据此判断复制已经完成。

## 十、到底是不是你
上一部分，我们复制出两本独立的书：
```Java
Book first = new Book("BookA", "#123#");
Book second = first.copy();
```
它们的数据相同，但不是同一个对象。

现在要解决：程序怎样区分“同一个对象”和“内容相同的两个对象”？

这与第四次作业中的书籍比较、合并去重直接相关，后面学习 `HashSet`、`HashMap` 时也会用到。

### 1 `==`：是不是同一个对象
先看：
```Java
Book first = new Book("BookA", "#123#");
Book second = first;
```
两个变量指向同一个对象。

所以：
```Java
System.out.println(first == second); // true
```
如果改为：
```Java
Book first = new Book("BookA", "#123#");
Book second = new Book("BookA", "#123#");
```
此时创建了两个对象，因此：
```Java
System.out.println(first == second); // false
```
对引用类型而言，`==` 比较的是对象身份，不会逐个比较对象中的字段。

对基本类型则不同：
```Java
int first = 10;
int second = 10;

System.out.println(first == second); // true
```
这里比较的是整数值。

### 2 `equals`：什么算作“内容相同”
如果我们规定：
> 两本书的名字和魔咒都相同，则认为它们内容相等。

那么我们希望：
```Java
Book first = new Book("BookA", "#123#");
Book second = new Book("BookA", "#123#");

System.out.println(first.equals(second)); // 希望为 true
```
但Java不会自动猜测应该比较哪些字段。

如果 `Book` 没有重写 `equals`（还记得重写是什么吗😉），继承来的默认实现仍然按对象身份比较。上面两个独立对象得到的结果仍是 `false`。

为什么没有定义 `equals` 也能调用？

因为Java中的类最终都继承自 `Object`，而 `Object` 提供了：
```Java
public boolean equals(Object obj)
```
我们需要在 `Book` 中重写它，定义书籍自己的相等规则。
