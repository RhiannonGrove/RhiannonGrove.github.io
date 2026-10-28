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
public Potion(String itemId, int amplifier) {
    this.amplifier = amplifier;
}
没有显式调用父类构造方法时，编译器会尝试调用父类的无参构造方法：
super();
但我们的 Item 只有：
public Item(String itemId) {
    this.itemId = itemId;
}
并没有：
public Item() {
}
所以会编译失败。

编译器不会根据参数名相同，就自动替你写：
super(itemId);
你需要明确告诉它，父类构造需要什么参数。

这也引出一个容易记错的规则：
一个类完全没有声明构造方法时，编译器才会为它提供默认的无参构造方法。

例如：
public class Example {
}
可以：
Example example = new Example();
但如果已经声明：
public class Example {
    public Example(int value) {
    }
}
那么：
new Example();
就不能使用，因为没有可匹配的无参构造方法。需要传参数：
new Example(10);
或者自己再定义一个无参构造方法。

七、构造方法不会被子类继承

父类中有：
public Item(String itemId) {
    this.itemId = itemId;
}
不代表 Potion 自动获得一个：
public Potion(String itemId)
构造方法。

我们现在定义的 Potion 构造方法是：
public Potion(String itemId, int amplifier)
所以需要这样创建：
new Potion("heal1", 50);
而不能这样：
new Potion("heal1"); // 没有对应的 Potion 构造方法
区别要记清：
- 父类的合适实例方法，可以被子类继承使用。
- 构造方法不会被继承，需要在各自类中定义。
- 子类构造时，可以通过 super(...) 调用父类构造方法。
八、父类字段是 private，子类能直接用吗

我们的父类中：
private String itemId;
因此，在 Potion 中直接写：
public void printId() {
    System.out.println(itemId); // 编译错误
}
是不允许的。

原因是 itemId 是 Item 的私有字段，子类代码不能直接访问。

但可以使用父类提供的公开方法：
public void printId() {
    System.out.println(getItemId());
}
这里发生的是：
Potion 的方法调用 getItemId()
        ↓
执行 Item 中定义的 getItemId()
        ↓
Item 自己的方法读取自己的私有字段
        ↓
返回结果
所以要区分：
子类对象包含父类定义的私有状态，但子类代码没有直接访问这些私有字段的权限。

不需要为了让子类方便，就把所有字段改成 public 或 protected。

先保持字段私有，再提供确实需要的方法，通常更容易维护规则。

九、不要在子类里再声明一份同名字段

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
