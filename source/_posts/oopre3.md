---
title: 一周通关oopre（三）
date: 2026-10-28 19:20:00
tags:
   - oopre
---

## 十一，背包查户口
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


















