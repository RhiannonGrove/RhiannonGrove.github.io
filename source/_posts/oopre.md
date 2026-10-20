---
title: 一周通关oopre【连载】
date: 2026-10-20 17:47:00
tags:
  - oopre
---

## 前言
今年oopre大升级！第八次作业迎来史诗级加强！那么，Rhiannon决定先下手为强，先准备着blog，然后就可以在交作业的时候不至于手忙脚乱（计划通✅）。

鉴于Rhiannon每次上课都没好好听🥲，所以结合了几次作业的指导书，将C与java进行类比来梳理一下知识点，~~期待手搓BUAACraft的一天~~。

## 知识/指导书路线
在codex老师的帮助下，整理了一下每次作业的知识要求，制成以下表格（话说每年的hw都一样吗？）：
| 对应作业 | 需要学习的 Java 知识 |
|---|---|
| 第一次 | 程序入口、基本语法、输入输出、类、属性、方法、构造方法、对象和引用 |
| 第二次 | 封装、对象之间的关系、`ArrayList`、字符串比较、查找删除、JUnit 入门 |
| 第三次 | 继承、`super`、方法重写、多态、接口、抽象类、类型转换 |
| 第四次 | 引用共享、深浅复制、`equals` 与 `hashCode`、遍历删除、字符串下标、调试、简单 JML |
| 第五次 | `HashMap`、`HashSet`、有序槽位管理、抽象类、工厂模式 |
| 第六次 | 观察者模式、对象间通知、关注关系的存储与遍历、事件处理顺序 |

那么我们就按照指导书的路线对知识进行梳理和总结。

## 1 从C语言的结构体出发
假设你有一只，哦不，是多只宠物，它们每个个体都有名字和年龄，当你给它们过完生日后，它们会长大一岁。

在C语言中，我们可以写成结构体的形式：
```C
#include <stdio.h>

typedef struct {
    char name[41];
    int age;
} Pet;

void grow(Pet *pet) {
    pet->age++;
}

int main(void) {
    Pet pet = {"Mimi", 2};

    grow(&pet);

    printf("%s %d\n", pet.name, pet.age);
    return 0;
}
```
相信聪明的你能很轻松的理解这套逻辑：
1. `Pet` 定义一组数据的结构体。
2. `pet` 保存一只具体宠物的数据。
3. `grow` 接收宠物的地址，并实现修改年龄的功能。

在Java中，我们把“数据”和“修改数据的函数”放到一起：
```Java
public class Pet {
    private String name;
    private int age;

    public Pet(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void grow() {
        this.age++;
    }

    public String getName() {
        return this.name;
    }

    public int getAge() {
        return this.age;
    }
}
```
先来看一下大致的对应关系：
| C 语言 | Java |
|---|---|
| `struct` 定义数据结构 | `class` 定义类 |
| 结构体成员 | 对象的字段，也常称属性、成员变量 |
| 操作结构体的函数 | 类中的方法 |
| 初始化结构体 | 创建对象时执行构造方法 |
| `char name[41]` | 这里使用 `String name` |
类可以先理解成：一种数据类型的定义，还包括了修改数据的函数。

在这其中, `Pet` 就是类型名称。

## 2 类和对象是什么
先来看下面两行：
```Java
Pet first = new Pet("Mimi", 2);
Pet second = new Pet("Douduo" ,5);
```
这里有：
- 一个类：`Pet`。
- 两个对象：一只叫Mimi的宠物，一只叫Duoduo的宠物。
- 两个引用变量： `first``second`，分别用来找到上面两个对象。

执行：
```Java
first.grow()
```
只会增加第一只宠物的年龄。

所以，类定义“这种东西有哪些数据，能够执行的函数有哪些”，对象是按照这个定义创建出来的具体个体。（~~所以一个类可以有很多对象，而Rhianoon只能孤独的深夜emo~~）

## 3 深入类的定义
先看外层：
```Java
public class Pet {
    // 字段和方法放在这里
}
```
`class Pet` 表示定义一个叫 `Pet` 的类。

这里的`public`表示这个类可以被外部代码使用（比如定义了另一个类`Player`，我们可以为每一位玩家增添一只可爱的小宠物🐕‍🦺）。目前我们可以暂时先按这个格式进行定义，等之后我们再展开。

这个公开的顶层类应保存在`Pet.java`中，注意文件名和类名大小写要保持一致。

接下来是字段：
```Java
private String name;
private int age;
```
`int`不必多说，我们需要注意的是`String`的用法会有所不同：
```Java
String name = "Mimi";
```
我们发现，Java中对于字符串的定义不需要像C那样自己准备字符数组和结尾的`'\0'`。（终于摆脱字符串越界的恐惧了，话说Rhiannon数据结构一个大题全部报废就是因为字符串数组内存太小……我要哭了😭）

`private`表示这些字段只能由`Pet`类内部的代码进行访问和修改，因此，在另一个类中这样写会编译失败：
```Java
first.age = 100;
```
如果想在外部修改宠物年龄，只能通过`Pet`中提供的方法进行操作：
```Java
first.grow();
```
这种组织方式称为**封装**，即由对象自己的方法维护内部数据。

## 4 构造方法：对象刚创建时怎样初始化
这段代码是构造方法：
```Java
public Pet(String name, int age) {
    this.name = name;
    this.age = age;
}
```
相信聪明的你很快发现了两个明显特征：
1. 名称与类名完全相同。
2. 没有返回类型，连`void`都没有。

它会在下面这行创建对象时执行：
```Java
Pet first = new Pet("Mimi", 2);
```
按顺序来看是这样的：
```
创建一个 Pet 对象
        ↓
将 "Mimi" 和 2 交给构造方法
        ↓
设置这个对象的 name 和 age
        ↓
将对象的引用保存到 first 中
```
这个构造方法的作用类似于C中编写的初始化函数。

需要注意的是，有没有返回类型差异是很大的，代表两种完全不同的方法：
```Java
public Pet(String name, int age) {
    // 构造方法
}
```
```Java
public void Pet(String name, int age) {
    // 普通方法，只是名字碰巧叫 Pet
}
```

## 5 `this`:当前正在操作的对象
看下面这行代码:
```Java
this.age = age;
```
两个`age`并不是同一个变量。
| 写法 | 含义 |
|---|---|
| `this.age` | 当前对象的字段 |
| `age` | 构造方法接收到的参数 |
例如，当我们执行：
```Java
new Pet("Mimi", 2);
```
代表着：**把参数中的 2，保存到当前正在初始化的宠物对象的年龄字段中。**

而如果我们写成：
```Java
age = age;
```
则意味着把参数赋给它本身，宠物对象的年龄字段并没有得到这次的赋值。

再看：
```Java
public void grow() {
    this.age++;
}
```
执行：
```Java
first.grow();
```
这是`this`指的是`first`所引用的对象。

如果借助C理解——
```C
grow(&pet);
```
就是把要操作的宠物地址显式传入函数；而在Java中，我们不说（），我们说：
```Java
pet.grow();
```
要操作的对象已经写在了点号之前，方法内部通过`this`进行访问。

btw，这里只是帮助理解的类比，Java引用并不允许像C指针那样进行地址运算。

## 6 方法就是放在类中的功能
看这个方法：
```Java
public int getAge() {
    return this.age;
}
```
拆开来看就是：
| 部分 | 含义 |
|---|---|
| `public` | 允许外部代码调用 |
| `int` | 返回一个整数 |
| `getAge` | 方法名 |
| `()` | 不需要调用者提供参数 |
| `return this.age;` | 返回当前对象的年龄 |
调用方式：
```Java
int result = first.getAge();
```
是不是与C中函数调用超级像！我要爱死函数了！🥰

与C一样，我们需要注意每个函数的返回类型，不要出现返回`int`却用`String`接收它的情况哦( •̀ ω •́ )✧。

`getAge`、`getName`常被称为`getter`，即用于读取字段的方法。不过它们的名字是约定，而不是Java中的关键字。

## 7 如何优雅运行程序
截止目前，我们的宠物只需要名字和年龄（有点冷血了啊喂(*/ω＼*)）。我们来看看如何进行优雅的程序运行。

上述的`Pet`负责描述宠物，再用一个类提供程序入口，我们通常命名为`Main`。

文件`MainClass.java`：
```Java
public class MainClass {
    public static void main(String[] args) {
        Pet first = new Pet("Mimi", 2);
        Pet second = new Pet("Doudou", 5);

        first.grow();

        System.out.println(first.getName());
        System.out.println(first.getAge());
        System.out.println(second.getAge());
    }
}
```
运行后，我们会得到：
```
Mimi
3
5
```
需要注意的是，两个文件需要放在同一个源码目录下：
```
src/
    MainClass.java
    Pet.java
```
入口这一行：
```Java
public static void main(String[] args)
```
可以暂时理解为：
| 部分 | 当前需要知道的作用 |
|---|---|
| `public` | 允许启动程序时访问 |
| `static` | 无须先创建 `MainClass` 对象，就可以执行这个方法 |
| `void` | 方法不返回值 |
| `main` | 此处使用的程序入口名称 |
| `String[] args` | 接收命令行参数的字符串数组，目前不用它也可以 |
其中 `args` 只是参数名，也可以写成 `argv`。它与C的 `argv` 有一定相似性，但Java这里没有单独的 `argc`，数组自身能提供长度。

输出这一行：
```
System.out.println(first.getAge());
```
可以暂时将其理解为“输出括号中的内容，然后换行”。（没有令人担忧的`'\n'`了，还真是令人怀念o(*￣︶￣*)o）

## 8 引用赋值问题
这是一个非常容易出错的问题！简而言之，就是**引用赋值不会赋值整个对象**。

C中：
```C
Pet second = first;
```
如果两边都是结构体变量，会复制结构体的内容。

而Java中：
```Java
Pet first = new Pet("Mimi", 2);
Pet second = first;
```
只创建了一个宠物对象，第二行复制的是引用，也就是说，`first``second`指向的是同一个`Pet`对象，两者的`name``age`都是相同的，而且一变都变。

因此：
```Java
second.grow();

System.out.println(first.getAge());
```
输出为`3`。

与下面这段进行对照：
```Java
Pet first = new Pet("Mimi", 2);
Pet second = new Pet("Mimi", 2);
```
这里我们执行了两次`new Pet(...)`，创建了两个独立的宠物对象，它们的起始数据相同，但是修改一只的年龄不会影响另一只。

## 9 声明引用、空引用和创建对象
我们需要对下面三种情况进行区分：

只声明局部变量：
```Java
Pet pet;
```
这没有创建宠物对象，也没有给局部变量`pet`赋值，此时如果直接使用它：
```Java
System.out.println(pet.getAge());
```
会编译失败，因为变量还尚未进行初始化。

显式赋为空引用：
```Java
Pet pet = null;
```
此时`pet`有值，但这个值表示“没有引用任何对象”。

此时我们调用：
```Java
pet.grow();
```
会在运行时出现`NullPointerException`，即空指针异常。

真正创建对象是这样的：
```Java
Pet pet = new Pet("Mimi", 2);
```
此时才有宠物对象可供操作。

此时有些行动能力强的朋友运行程序不会出现报错，这其实与Java的**默认初始化规则**有关，但我们需要注意的是，默认初始化规则并不使用于所有变量。
| 变量所在的位置 | 是否自动获得默认值 |
|---|---|
| 对象的字段 | 是，例如 `int` 默认是 `0`，引用默认是 `null` |
| 数组中的元素 | 是 |
| 方法中的局部变量 | 否，使用前必须保证已经赋值 |
例如：
```Java
public class Example {
    private int count; // 字段，默认是 0
    private Pet pet;   // 字段，默认是 null

    public void test() {
        int number;   // 局部变量，不会自动变成 0
        // System.out.println(number); // 编译错误
    }
}
```




