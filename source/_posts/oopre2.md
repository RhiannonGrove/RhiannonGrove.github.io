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


