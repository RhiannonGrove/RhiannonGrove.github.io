---
title: 一周通关oopre（三）
date: 2026-10-28 19:20:00
tags:
   - oopre
---

## 十一、背包查户口
这一部分我们将学习有关哈希的部分，`hashCode`、`HashMap`、`HashSet`。

我们想要实现：
> 已经知道物品的ID，如何快速的找到对应的物品，并不是从头遍历背包？

目前我们使用`ArrayList`，每次寻找时都要进行遍历，当背包很大时，这样干就会花费不少时间。那有咩有更有效率的方法？

### 1 Hash：先算个数，再找
其实这个方法我们在数据结构课程中学过，现在我们来重新看一下。

Hash通常译为“哈希”或“散列”。可以把它先理解为：按照某种规则，把输入数据计算成一个数，用来帮助组织和查找数据。

假设有八个存放区域，从0开始编号。那么，我们先为物品ID计算一个数，再决定放到哪个区域。

假设："heal1" →计算结果18 → 分到区域2；"damage1" → 计算结果29 → 分到区域5。

那么以后查`heal1`时，我们可以按照：计算 "heal1" 对应的数->确定区域2->在区域2中寻找匹配项 这个顺序进行，而不必从所有物体中遍历寻找。

### 2 `hashCode()`：Java对象提供的哈希值
Java的对象可以调用：
```Java
object.hashCode()
```
得到一个 `int` 类型的哈希值。

例如：
```Java
String id = "heal1";

int code = id.hashCode();
```
`code`在这就是字符串 "heal1" 的哈希值。

需要记住三个性质：
1. 哈希值是一个整数，可能是负数。
2. 它不是唯一编号。
3. 哈希值相同，不代表对象内容一定相同。

为什么不是唯一编号呢？因为对象内容有非常多种可能，但 `int` 的取值范围有限。不同内容可能算出相同的哈希值。

这种情况称为**哈希碰撞**。

### 3 `hashCode`和`equals`搭配食用更美味哦
假设两个不同的键最终进入同一个区域（目前我们姑且将键视为查找的字段）：
```
区域 2
├── 键 A → 对象 A
└── 键 B → 对象 B
```
只知道区域编号，还不能确定具体找哪一个。此时，查找是需要进一步比较键是否相等。

也就是说，`hashCode`负责定位以及缩小范围，而`equals`则判断是不是要找的那个键。

它们之间需要遵守一个约定：
> 两个对象如果`equals`判断相等，那么它们的`hashCode`必须相同。反过来则不成立。

### 4 `HashMap`：保存键与值的对应关系
先引入：
```Java
import java.util.HashMap;
```
然后创建：
```Java
HashMap<String, Item> items = new HashMap<>();
```
它表示：创建一个映射表，用字符串作为键，用物品引用作为值。

两个类型参数的顺序是：`HashMap<键的类型, 值的类型>`

在所举的例子中，键 `key`是物品 ID，例如 "heal1"，而值 `value`则对应的 `Item` 对象引用。

添加两件物品：
```Java
items.put("heal1", new HealPotion("heal1", 5));
items.put("damage1", new DamagePotion("damage1", 6));
```
关系是：
```
items
├── "heal1"   → HealPotion 对象
└── "damage1" → DamagePotion 对象
put 表示保存这个键值对应关系。
```

也可以先创建对象：
```Java
Item potion = new HealPotion("heal1", 5);

items.put(potion.getItemId(), potion);
```
与列表一样，保存的是对象引用，不会因此复制出第二件物品。

### 5 根据键查找：`get`
```Java
Item found = items.get("heal1");
```
返回对应的值：“heal1”→HealPotion对象。

但如果没有这个键：
```Java
Item missing = items.get("unknown");
```
由于没有对象的键是`"unknown"`，那么会得到`null`。

但也有可能表示“这个键对应的值就是`null`”，注意区分哦~

### 6    检查、删除和数量
检查键是否存在：
```Java
boolean exists = items.containsKey("heal1");
```
删除某个键及其映射：
```Java
Item removed = items.remove("heal1");
```
`remove` 返回原来对应的值。

获取键值对数量：
```Java
int count = items.size();
```
整理成表：
| 操作 | 含义 |
|---|---|
| `put(key, value)` | 添加或更新映射 |
| `get(key)` | 根据键取值 |
| `containsKey(key)` | 判断键是否存在 |
| `remove(key)` | 删除该键对应的映射 |
| `size()` | 当前映射数量 |
| `clear()` | 清空全部映射 |

### 7 相同的键再次`put`，会替换值
`HashMap`中，一个键最多对应一个值。

`HashMap`中，一个键最多对应一个值。

```Java
HashMap<String, Integer> scores = new HashMap<>();

scores.put("Alice", 10);
scores.put("Alice", 20);
```
最后：
```Java
System.out.println(scores.size());       // 1
System.out.println(scores.get("Alice")); // 20
```
从这我们可以看出，`HashMap`不允许重复键出现。

另外，注意`HashMap`的定义应该用泛型类型参数`Integer`。

### 8 `HashSet`
`HashSet`只记录有哪些元素，但不保存键值对应。

例如，统计当前有哪些物品类型：
```Java
import java.util.HashSet;

\\其它

HashSet<String> types = new HashSet<>();

types.add("HealPotion");
types.add("HealPotion");
types.add("DamagePotion");

System.out.println(types.size()); // 2
```
常用指令：
| 操作 | 含义 |
|---|---|
| `add(element)` | 添加元素 |
| `contains(element)` | 判断元素是否存在 |
| `remove(element)` | 删除元素 |
| `size()` | 元素数量 |
| `clear()` | 清空集合 |

`add`还有一个`boolean`：
```Java
System.out.println(types.add("StrengthPotion")); // true
System.out.println(types.add("StrengthPotion")); // false
```
第一次新增成功，第二次由于已经存在不再新增。

与`HashMap`一样，它也不保证插入顺序。

### 9 `HashSet`如何判断重复
如果元素是字符串：
```Java
HashSet<String> names = new HashSet<>();

names.add(new String("Alice"));
names.add(new String("Alice"));

System.out.println(names.size()); // 1
```
两个字符串对象不同，但内容相等。字符串正确实现了 `equals` 和 `hashCode`，因此会被视为重复元素。

如果元素是自定义的书：
```Java
HashSet<Book> books = new HashSet<>();

books.add(new Book("BookA", "#123#"));
books.add(new Book("BookA", "#123#"));
```
我们希望得到几本，取决于书籍的相等规则。

如果规定“名字和魔咒相同就相等”，就应在 `Book` 中配套实现：
```Java
@Override
public boolean equals(Object obj) {
    if (this == obj) {
        return true;
    }

    if (!(obj instanceof Book)) {
        return false;
    }

    Book other = (Book) obj;

    return Objects.equals(name, other.name)
        && Objects.equals(magic, other.magic);
}
@Override
public int hashCode() {
    return Objects.hash(name, magic);
}
```
并引入：
```Java
import java.util.Objects;
```
这里：
```Java
Objects.hash(name, magic)
```
是利用两个字段计算一个哈希值，不是生成唯一编号。

正确配套后，上面的集合大小为1。

如果只重写 `equals`，没有配套重写 `hashCode`，就破坏了相等对象必须具有相同哈希值的约定，集合的去重和查找可能不符合预期。

### 10 可变对象要特别小心
假设：
```Java
Book book = new Book("BookA", "#123#");

HashSet<Book> books = new HashSet<>();
books.add(book);
```
加入时，集合根据当时的哈希信息组织存储。之后：
```Java
book.appendMagic("_new");
```
`magic`变了，而它参与了：
```Java
Objects.hash(name, magic)
```
哈希值可能随之变化。
然而集合不会因为对象内部变化，就自动重新计算哈希值并重新安置。因此，再次操作：
```Java
books.contains(book)
```
或其它操作就有可能出现意外结果。

所以如果想要进行修改，建议先从`HashSet`中删除，然后重新加入。

而对于：
```Java
HashMap<String, Item> items;
```
情况不同。因为这里用来计算查找位置的是字符串键，而不是物品值。

因此，改变物品的效果等对象的状态，并不会让字符串键的哈希位置因此失效。当然，如果你修改了物品ID，那么同样也会发生上述的错误。

因此，在使用哈希时，应尽量选择不变值（除了加入删除）作为键。

### 11 `ArrayList`与`HashMap`、`HashSet`的选择
在后面的作业中，我们会遇到槽位编号与物品ID同时存在的情况。他们回答不同问题：槽位编号负责回答“物品放在那里”，而物品ID则用于回答“这是哪件物品”。

对于三者来说，我们可以根据需求进行选择：
| 需求 | 优先考虑 |
|---|---|
| 按位置访问、保留排列顺序 | 数组、`ArrayList` |
| 根据唯一 ID 查对象 | `HashMap` |
| 去重、判断某元素是否存在 | `HashSet` |
| 固定编号的槽位，允许中间为空 | 数组通常很直接 |

## 十二、bug追踪
前面我们已经了解了空指针、类型转换和对象共享等问题，这一部分我们主要用于处理第四次作业中的常见错误（我的作业🥲）。

### 1 `substring`：含左不含右
```Java
String result = text.substring(1, 3);
```
结果是：`12`。因为它使用左闭右开区间：`[1,3)`。例如：
```Java
String text = "012345";

System.out.println(text.substring(0, 2)); // 01
System.out.println(text.substring(2, 5)); // 234
System.out.println(text.substring(0, 6)); // 012345
```
因此第二个参数可以等于字符串长度。所以：
```Java
text.charAt(6);      // 越界
text.substring(0, 6); // 合法
```

### 2 正序删除需格外注意
加入列表中有：
```
下标：  0  1  2
元素：  1  2  8
```
而我们的目标是删除所有小于5的数字。第一版写法是：
```Java
for (int i = 0; i < numbers.size(); i++) {
    if (numbers.get(i) < 5) {
        numbers.remove(i);
    }
}
```
还记得之前说过什么吗？在Java中列表会自动向前部位，因此在第一轮循环后，列表变成：
```Java
下标：  0  1
元素：  2  8
```
下一步`i++`就会漏掉下标为0的2。

知道了问题所在，那么解决方法就比较容易想到了。

第一种解决方法是倒序删除：
```Java
for (int i = numbers.size() - 1; i >= 0; i--) {
    if (numbers.get(i) < 5) {
        numbers.remove(i);
    }
}
```
这样顶多会增加一点循环次数，但可以保证正确性。

第二种方法是正序删除后不增加下标：
```Java
int i = 0;

while (i < numbers.size()) {
    if (numbers.get(i) < 5) {
        numbers.remove(i);
    } else {
        i++;
    }
}
```
我个人比较喜欢这种方法。

### 3 JML：写明“应该做什么”
第四次作业有一些这样的注释：
```Java
/*@
  @ requires suffix != null;
  @ ensures this.magic.equals(\old(this.magic).concat(suffix));
  @ assignable this.magic;
  @*/
public void appendMagic(String suffix) {
    magic = magic.concat(suffix);
}
```
这叫**JML**，即Java Modeling Language，用于描述方法的规格或契约。不过不用担心，我们目前不需要掌握，只需要认识几个词：
| 写法 | 含义 |
|---|---|
| `requires` | 调用前需要满足的条件 |
| `ensures` | 方法正常结束后应满足的条件 |
| `assignable` | 允许修改哪些状态 |
| `\result` | 方法返回值 |
| `\old(...)` | 表达式在方法执行前的值 |

普通 Java 编译器会把这些当作注释，不会因为程序中写了规格，就自动实现或检查这些要求。专门的 JML 工具才能进一步处理它们。（而我们作业程序中也不会出现）

## 十三、装备生产线
之前我们只有药水一个类需要操心，现在我们有：头盔、胸甲、护腿、靴子，以及玩家手中的剑。当我们输入`Helmet`或者`Sword`时，程序需要真正创建：`new Helmet(...)`、`new Sword(...)`等等等等。

这一部分，我们将来学习怎样把“根据类型创建对象”集中管理，以及**简单工厂、工厂方法、抽象工厂**分别是什么。

### 1 先不用工厂，直接创建
假设已经从输入中读到了：
```Java
String type = "Helmet";
String id = "helmet1";
int value = 5;
int durability = 100;
```
你可以直接判断：
```Java
Equipment equipment;

if ("Helmet".equals(type)) {
    equipment = new Helmet(id, value, durability);
} else if ("Sword".equals(type)) {
    equipment = new Sword(id, value, durability);
} else {
    equipment = null;
}
```
这完全可以，这其实就是将具体子类对象统一保存到父类引用中（前提是你已经写完了子类和父类🤭）。

问题在于：如果多处都需要创建设备，就很可能不断重复这套分支。一旦增加装备类型，就需要四处修改。

为了避免我们的代码越写越长，我们可以吧这项工作提取到专门的位置。

### 2 简单工厂：把创建逻辑集中起来
例如：
```Java
public class EquipmentFactory {
    public static Equipment create(
            String type, String id, int value, int durability) {

        if ("Helmet".equals(type)) {
            return new Helmet(id, value, durability);
        } else if ("Chestplate".equals(type)) {
            return new Chestplate(id, value, durability);
        } else if ("Leggings".equals(type)) {
            return new Leggings(id, value, durability);
        } else if ("Boots".equals(type)) {
            return new Boots(id, value, durability);
        } else if ("Sword".equals(type)) {
            return new Sword(id, value, durability);
        } else {
            return null;
        }
    }
}
```
外部调用时：
```Java
Equipment equipment =
    EquipmentFactory.create(type, id, value, durability);
```
这样，调用者只需要提供参数，而工厂负责选择具体类并创建对象。

这被称为“简单工厂”。

### 3 逐步读懂
先看声明：
```Java
public static Equipment create(
        String type, String id, int value, int durability)
```
| 部分 | 含义 |
|---|---|
| `public` | 外部可以调用 |
| `static` | 可以通过类名调用 |
| `Equipment` | 返回装备对象的引用 |
| `create` | 自己起的方法名 |
| 参数列表 | 创建对象所需的信息 |

这里因为使用了`static`因此我们不需要先创建对象，就可以直接写：
```Java
EquipmentFactory.create(...);
```
而不需要写：
```Java
EquipmentFactory factory = new EquipmentFactory();
```
再看方法内部：
```Java
return new Helmet(id,value,durability);
```
完成两件事情：调用`Helmet`构造方法创建对象，返回该对象的引用。

虽然方法声明返回`Equipment`，但返回`Helmet`对象是合法的，因为头盔是一种装备。

**工厂没有取代构造方法，它只是替调用者选择并调用构造方法。**

## 4 创建对象与使用对象
创建时，需要根据字符串选择：
```Java
Potion potion;

if ("HealPotion".equals(type)) {
    potion = new HealPotion(id, amplifier);
} else if ("DamagePotion".equals(type)) {
    potion = new DamagePotion(id, amplifier);
} else {
    potion = null;
}
```
创建之后，如果是有效药水对象，使用时可以：
```Java
potion.use(target);
```
不必每次使用时，重新按字符串判断。

两种机制负责不同阶段：工厂负责决定创建什么对象；多态决定调用时执行什么行为。

### 5 工厂一般不负责整条游戏指令
假设处理添加装备指令，通常包含：解析输入、找到玩家并检查是否存活、创建指定装备、尝试放入背包、输出 这积分阶段，而工厂主要负责“创建指定设备”部分。

它通常不需要知道玩家是否死亡、背包是否满了、应放入哪个槽位、应该输出什么等等问题，只是根据输入进行创建就可，嗯！

### 6 工厂方法：让不同工厂决定创建什么
简单工厂的核心是：一个工厂，根据参数选择不同产品。

指导书还介绍了工厂方法模式。下面按它采用的接口形式展示：
```
统一的工厂接口
├── 头盔工厂
└── 剑工厂
```
先定义接口（还记得接口是什么吗）：
```Java
public interface EquipmentCreator {
    Equipment create(String id, int value, int durability);
}
```
头盔工厂：
```Java
public class HelmetCreator implements EquipmentCreator {
    @Override
    public Equipment create(String id, int value, int durability) {
        return new Helmet(id, value, durability);
    }
}
```
剑工厂：
```Java
public class SwordCreator implements EquipmentCreator {
    @Override
    public Equipment create(String id, int value, int durability) {
        return new Sword(id, value, durability);
    }
}
```
调用：
```Java
EquipmentCreator creator = new HelmetCreator();

Equipment equipment =
    creator.create("helmet1", 5, 100);
```
如果换成：
```Java
EquipmentCreator creator = new SwordCreator();

Equipment equipment =
    creator.create("sword1", 8, 100);
```
创建的就是剑。

这里又出现了熟悉的多态：
```
creator 的声明类型：EquipmentCreator
creator 指向的实际对象：HelmetCreator 或 SwordCreator
        ↓
执行相应工厂的 create
```
注意，这里`creat`是实例方法，通过工厂对象调用。

### 7 两种工厂区别
| 比较 | 简单工厂 | 工厂方法的上述结构 |
|---|---|---|
| 谁决定具体产品 | 一个集中分支 | 各个具体工厂 |
| 典型调用 | `EquipmentFactory.create(type, ...)` | `creator.create(...)` |
| 增加新产品 | 通常修改分支 | 通常增加产品类和对应工厂 |
| 代码数量 | 较少 | 较多 |

目前，应该先理解两种结构，再结合实际复杂度使用。**工厂类越多，并不意味着设计一定越好。**

### 8 抽象工厂：一个工厂创建一组相关产品
指导书中出现了抽象工厂

它关注的不只是创建一种产品，而是创建一组相互配套的产品。

例如：mc中铁质工具有铁斧、铁镐、铁剑等等，而钻石工具有钻石镐、钻石斧等等。

共同接口可以有多个创建方法：
```Java
public interface EquipmentSetFactory {
    Helmet createHelmet(String id, int value, int durability);

    Sword createSword(String id, int value, int durability);
}
```
哦对，这里会不会产生疑惑？为什么明明是抽象工厂却没有`abstract`？反正我当时有大大的疑惑！

因为接口中，这种没有方法体的普通实例方法默认就是`public abstract`，可以省略。

所以：
```Java
public interface EquipmentSetFactory {
    Helmet createHelmet(String id, int value, int durability);
}
```
等价于：
```Java
public interface EquipmentSetFactory {
    public abstract Helmet createHelmet(
        String id, int value, int durability);
}
```
Java已经隐含了这些显式符。

对比抽象类中的声明，则需要显式写`abstract`：
```Java
public abstract class EquipmentFactory {
    public abstract Helmet createHelmet(
        String id, int value, int durability);
}
```
另外，实现接口时，对应方法必须是`public`：
```Java
@Override
public Helmet createHelmet(String id, int value, int durability) {
    return new Helmet(id, value, durability);
}
```
总之，不同具体工厂提供对应系列的实现。

三种工厂可以这样区分：
| 名称 | 主要思路 |
|---|---|
| 简单工厂 | 根据参数，在一个入口中选择具体产品 |
| 工厂方法 | 通过具体工厂决定创建哪种产品 |
| 抽象工厂 | 通过一个工厂创建一组相关产品 |

## 十四、好友救援队
这一次作业同时涉及模式和图遍历，因此分上下两个部分。

在这一部分我们来了解一下观察者模式和救援事件的触发条件

### 1 观察者模式：通知关心ta的人

先看一个熟悉的场景：你在某站上关注了一个频道，当该频道有更新时，就会通知已关注的用户。

里面有两种角色：被观察者和观察者。被观察者负责保存关注者，在事件发生时发出通知，而观察者则接收通知，并执行自己的响应（例如短信通知、弹窗提醒等等）。

“观察者”并不是程序里不断盯着某个变量。我们要显式编写代码，在合适的时机调用它的方法。这也是一种对象之间协作的方式。

### 2 先定义接收通知的接口
先建立一个简单接口：
```Java
public interface Viewer {
    void onUpdate(String title);
}
```
约定：能接受频道更新通知的对象，必须提供`onUpdate`方法。`title`是新内容的标题。

再写一个具体的观众类：
```Java
public class Reader implements Viewer {
    private String name;

    public Reader(String name) {
        this.name = name;
    }

    @Override
    public void onUpdate(String title) {
        System.out.println(name + " 收到更新：" + title);
    }
}
```
实际项目中的响应不一定是打印，也可能是更新界面、处理业务数据，或者作业中的执行一次援助。

### 3 让频道保存观察者，并发出通知
```Java
import java.util.ArrayList;

public class Channel {
    private ArrayList<Viewer> viewers = new ArrayList<>();

    public void addViewer(Viewer viewer) {
        viewers.add(viewer);
    }

    public void removeViewer(Viewer viewer) {
        viewers.remove(viewer);
    }

    public void publish(String title) {
        for (Viewer viewer : viewers) {
            viewer.onUpdate(title);
        }
    }
}
```
先看列表：
```Java
private ArrayList<Viewer> viewers = new ArrayList<>();
```
它保存的是接口类型的引用。只要对象实现了 `Viewer`，就可以放进来。

添加关注：
```Java
public void addViewer(Viewer viewer) {
    viewers.add(viewer);
}
```
保存观察者的引用，之后就能够找到它并调用方法。

发布内容：
```Java
public void publish(String title) {
    for (Viewer viewer : viewers) {
        viewer.onUpdate(title);
    }
}
```
这段循环就是通知过程。

频道不需要知道每个对象具体是什么类，只需要知道它符合`Viewer`的约定。

调用：
```Java
viewer.onUpdate(title);
```
时，再根据实际对象执行相应实现。这正是接口与多态的用途。

### 4 完整调用展示
在入口方法中：
```Java
Channel channel = new Channel();

Reader alice = new Reader("Alice");
Reader bob = new Reader("Bob");

channel.addViewer(alice);
channel.addViewer(bob);

channel.publish("Java 背包整理指南");
```
输出：
```
Alice 收到更新：Java 背包整理指南
Bob 收到更新：Java 背包整理指南
```

### 5 回到作业中

作业里的流程可以理解为：
```
玩家受到伤害
        ↓
体力发生变化
        ↓
检查是否满足援助触发条件
        ↓
找到能够援助这个玩家的人
        ↓
这些玩家依次尝试援助
```
但是，频道示例只有直接关注，作业还允许间接关系：Alice → Bob → Carol

箭头表示左边的玩家关注右边的玩家。于是：
- Alice 可以援助 Bob。
- Bob 可以援助 Carol。
- Alice 也可以沿关注链援助 Carol。

这个关系有方向，所以Bob不能援助 Alice。

## 十五、救援路线图
上一部分我们说明了观察者模式的设定及调用方式，现在我们要解决三个问题：
1. 哪些玩家能援助目标？
2. 多条关注路径怎样避免重复处理？
3. 找到人之后，怎样按题目顺序选择药水、执行援助？

### 1 关注关系有方向

还是上回的箭头：Alice → Bob → Carol

当Carol触发援助时，应当沿着关注方向到达Carol，而不是沿着Carol关注的方向寻找能够救援她的人。

因此我们可以反过来看箭头，变成Alice ← Bob ← Carol。

这种做法时沿着反向关系遍历。

再看一个复杂一点的例子：
```
Alice → Bob  → Carol
Alice → Dave → Carol
Carol → Bob
```
这里同时存在多条路径和循环。因此，不能仅仅沿着箭头走，否则可能重复处理，甚至陷入循环。

### 2 先用名字保存关注关系
可以用：
```Java
HashMap<String, HashSet<String>> following = new HashMap<>();
```
这个类型看起来有点长，拆开来看：键是玩家名，而值是这个玩家正在关注的所有玩家名。

例如：
```
"Alice" → {"Bob", "Dave"}
"Bob"   → {"Carol"}
"Carol" → {"Bob"}
"Dave"  → {"Carol"}
```
初始化每个玩家的空集合：
```Java
following.put("Alice", new HashSet<>());
following.put("Bob", new HashSet<>());
following.put("Carol", new HashSet<>());
following.put("Dave", new HashSet<>());
```
