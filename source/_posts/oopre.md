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

## 一 如何假装自己是个Java糕手
### 1 从C语言的结构体出发
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

### 2 类和对象是什么
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

### 3 深入类的定义
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

### 4 构造方法：对象刚创建时怎样初始化
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

### 5 `this`:当前正在操作的对象
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

### 6 方法就是放在类中的功能
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

### 7 如何优雅运行程序
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

### 8 引用赋值问题
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

### 9 声明引用、空引用和创建对象
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

## 二、完成一些简单交互
这一部分我们会主要学习一下Java的基本类型、字符串、输入输出，以及怎样读取操作指令。
学完这些，你将能够

### 1 基本类型
Java有八种基本类型：
| 类型 | 含义 | 示例 |
|---|---|---|
| `byte` | 8 位有符号整数 | `byte x = 10;` |
| `short` | 16 位有符号整数 | `short x = 100;` |
| `int` | 32 位有符号整数 | `int age = 2;` |
| `long` | 64 位有符号整数 | `long total = 3000000000L;` |
| `float` | 32 位浮点数 | `float x = 1.5F;` |
| `double` | 64 位浮点数 | `double price = 1.5;` |
| `char` | 一个 UTF-16 代码单元 | `char grade = 'A';` |
| `boolean` | 真或假 | `boolean alive = true;` |
1. 与C不同的是，Java的这些类型有固定大小。例如，`int`固定为32位，`long`固定为64位。
2. `long`常量后的`L`表示这是一个`long`类型的整数。
3. 小数通常是`double`，所以写`float`常量时通常加`F`:
```Java
double first = 1.5;
float second = 1.5F;
```
### 2 `boolean`使用守则
C中你可能这样写：
```C
int alive = 1;

if (alive) {
    printf("alive\n");
}
```
但是！attention！Java中我们需要使用专门的真假类型✪ ω ✪：
```Java
boolean alive = true;

if (alive) {
    System.out.println("alive");
}
```
众所周知，`boolean`只有`true`和`false`两个值，在Java中，整数不能当作判断的条件：
```Java
int count = 3;

if (count) { // 编译错误
}
```
必须写出明确的判断：
```Java
if (count != 0) {
    System.out.println("有物品");
}
```

完成了`boolean`，剩下的就简单多了！ヾ(≧▽≦*)o

`&&`、`||`、`!` 的基本用途与 C 一致，并且 `&&` 和 `||` 都有顺序：
```Java
if (pet != null && pet.getAge() > 2) {
    System.out.println("年龄大于 2");
}
```
如果 `pet == null`，左侧条件已经是假，右侧不会执行。

### 3 整数除法与类型转换
和C一样，两个整数相除会进行整数除法，结束向零截断：
```Java
System.out.println(5 / 2);   // 2
System.out.println(-5 / 2);  // -2
```
即使结果最后放进`double`，也不会恢复已经丢失的小数。

如果我们想要得到`2.5`，就需要使用传统浮点大法：
```Java
double first = 5.0 / 2;
double second = (double) 5 / 2;
```
当然，强制转换写法与C相同：
```Java
double value = 3.9;
int number = (int) value;

System.out.println(number); // 3
```
注意！对于这种正常范围内的数，转换后会去掉小数部分，而非我们熟知的四舍五入。

哦对！差点忘了(╹ڡ╹ )，几次作业中伤害计算部分用到了向上取整：
```Java
double value = 3.2;

System.out.println((int) value);    // 3
System.out.println(Math.ceil(value)); // 4.0
```
`Math.ceil` 表示向上取整，返回类型仍是 `double`。题目需要整数结果时，可以在范围允许的情况下写：
```Java
int damage = (int) Math.ceil(value);
```

OK！这一部分就完成啦！（怎么感觉重新学了一遍C语言◑﹏◐）


### 4 先转换再计算
我们之前提到：
> 与C不同的是，Java的这些类型有固定大小。例如，`int`固定为32位，`long`固定为64位。

因此，在Java中如果不注意可能会发生位溢出的情况！(ToT)/~~~

看这段：
```Java
int a = 100000;
int b = 100000;

long result = a * b;
```
虽然 `result` 是 `long`，但 `a * b` 的两个操作数都是 `int`，乘法会先按 `int` 运算。正确结果超出 `int` 范围，因此会发生可怕的溢出！一旦出现这种情况，极有可能会发生呆呆坐在考试机前无助审代码(•_•)。

因此，我们需要来一点强制爱😋！
```Java
long result = (long) a * b;
```
这样输出结果就是`10000000000`。

### 5 `String` ：它是引用类型
上一部分我们写过：
```Java
String name = "Alice";
```
如果你忘了，可以回到这一章的开头，仔细观看就会发现`String`其实不属于Java的八大类型之一。那秉承着好奇宝宝的性格，我们发现，`String`其实是Java提供的类，用于表示字符串。

对于`String`类型，我们先掌握以下这些常用操作：
```Java
String name = "Alice";

System.out.println(name.length()); // 5
System.out.println(name.charAt(0)); // A
System.out.println(name.charAt(4)); // e
```
注意：
1. 字符串长度使用`length()`。
2. 下标从`0`开始。
3. 长度为`5`的字符串，有效下标是`0`到`4`。
4. `charAt`返回`char`。

另外需要提醒大家的是：还记得我们上文说过字符串中我们不需要加入`'\0'`吗？因此，`name.charAt(5);`是一种越界行为。

### 6 字符串内容比较
在C中，我们比较两个字符串内容时，通常使用：
```C
strcmp(first, second) == 0
```
那么在Java中，我们这样写：
```Java
first.equals(second)
```
有点忘了上文的代码？我们举个更具体的例子ヾ(＠⌒ー⌒＠)ノ：
```Java
String command = "add_player";

if (command.equals("add_player")) {
    System.out.println("添加玩家");
}
```
这里 `.equals(...)` 返回一个 `boolean`，所以可以直接作为 `if` 的条件。

不要用 `==` 判断字符串内容是否相同哦😋。
```Java
String first = new String("Alice");
String second = new String("Alice");

System.out.println(first == second);      // false
System.out.println(first.equals(second)); // true
```
这两个字符串对象的内容一样，但它们是不同对象：
```
first  ──→ String 对象，内容为 Alice

second ──→ 另一个 String 对象，内容也为 Alice
```
这也是有可能导致WA的原因之一哦~因为同样不会报错！

当然，codex老师提醒我，有些字符串用 `==` 比较会碰巧得到 `true`，因为 Java 可能复用字符串对象。

话说回来，当变量可能为`null`时，可以把确定存在的字符串放到前面：
```Java
if ("add_player".equals(command)) {
    // ...
}
```
这样即使 `command` 是 `null`，结果也是 `false`，不会因为调用 `command.equals(...)` 而触发空指针异常。

### 7 字符串拼接与运算
Java可以用`+`拼接字符串：
```Java
String name = "Alice";
int hitPoint = 20;

System.out.println(name + " " + hitPoint);
```
输出：
```
Alice 20
```
数字遇到字符串拼接时，会转换为对应的文本。

不过要注意下方的情况：
```Java
System.out.println(1 + 2 + " HP");
```
此时会输出：
```
3 HP
```
而如果我们换个顺序：
```Java
System.out.println("HP " + 1 + 2);
```
则会输出：
```
HP 12
```
因为`+`会从左往右结合：
```
"HP " + 1 → "HP 1"
"HP 1" + 2 → "HP 12"
```
如果需要先求和，则应加括号：
```Java
System.out.println("HP " + (1 + 2));
```
此时就会得到`HP 3`啦~

### 8 字符串内容无法在原对象上进行修改
例如：
```Java
String text = "Hello";
text = text + " Java";
```
我们运行这个代码不会出发报错。但过程是产生拼接结果，再让`text`引用结果字符串，原来的字符串对象内容并没有被修改。

听起来有点绕？我们再来看一下：
```Java
String first = "Hello";
String second = first;

first = first + " Java";

System.out.println(first);  // Hello Java
System.out.println(second); // Hello
```
最后两个变量引用的内容不同。

这与上一部分中的：
```Java
Pet second = first;
second.grow();
```
的情况有区别：
 - `grow()`修改了共享宠物对象的内部状态。
 - 字符串拼接后赋值，变量改为引用拼接结果。

### 9 输出
我们在Java中常用三种输出：`print`、`println`、`printf`，分别使用不用的场景。

`print`输出后不换行：
```Java
System.out.print("Alice");
System.out.print(" ");
System.out.print(20);
```
会得到：
```
Alice 20
```

而`println`输出后会自动换行：
```Java
System.out.println("Alice");
System.out.println(20);
```
得到：
```
Alice
20
```
最后一种，也就是`printf`，长得跟C中一样，格式也十分类似：
```Java
System.out.printf("%s %d%n", "Alice", 20);
```
其余的我就不过多介绍，需要特别注意的是Java中的换行符为`%n`，而不是`\n`哦（＾∀＾●）ﾉｼ！


### 10 使用`Scanner`读取输入
介绍完了输出，那Java中的输入又是什么样子的呢？我们先来看一个程序：
```Java
import java.util.Scanner;

public class MainClass {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String name = scanner.next();
        int age = scanner.nextInt();

        System.out.println(name + " " + age);
    }
}
```
此时输入：
```
Mimi 2
```
则会得到输出：
```
Mimi 2
```
相信聪明的你心里一定有所感悟。

首先，我们需要引入`java.util`包中的`Scanner`类（前文我们说过，Java中输入输出都是类），这与C中的`#include`有些类似，但还是有所不同，我们就不在这里过多讨论。

来看这一行：
```Java
Scanner scanner = new Scanner(System.in);
```
这个结构是不是看起来有点眼熟？是的，我们之前看到过同样的结构：
```Java
Pet pet = new Pet("Mimi",2);
```
这是在说明我们创建了一个负责读取输入的`Scanner`对象。
`System.in`表示标准输入，目前我们可以将其理解为读取终端输入。

然后：
```Java
String name = scanner.next();
int age = scanner.nextInt();
```
代表分别读取一个字符串片段和一个整数。

我将几个常用的读入数据类型放到下面👇：
| 方法 | 读取内容 |
|---|---|
| `next()` | 下一个以空白符分隔的片段 |
| `nextInt()` | 下一个整数，结果为 `int` |
| `nextLong()` | 下一个整数，结果为 `long` |
| `nextDouble()` | 下一个浮点数，结果为 `double` |
| `nextLine()` | 从当前位置读到当前行结束，返回其中的文本 |
（其实我觉得这比C要好，当时我可是被读入到底用什么搞得晕头转向༼ つ ◕_◕ ༽つ）

需要注意的是（其实你们应该也发现了），`next()`读取时，会截断到空白符，如空格、制表符、换行符等。

而`nextLine()`呢，同C一样，会发生如下情况：
```Java
int count = scanner.nextInt();
String line = scanner.nextLine();
```
输入：
```
2
add_player Alice
add_player Bob
```
输出：
```
count = 2
line = ""
```
原因在于`nextInt()`读取整数`2`后，扫描位置还在第一行的行结束符之前。

接着`nextLint()`读取当前位置到一行结束的剩余内容，于是就会返回空字符串，并越过第一行的行结束符。

对于上面的情况，我们有两种解决方式：
No.1：额外读掉第一行的剩余内容：
```Java
int count = scanner.nextInt();
scanner.nextLine();

String line = scanner.nextLine();
```
（好眼熟啊喂，学会C语言，走遍天下都不怕！古人诚不欺我）。
No.2：始终按行读取，但进行转换：
```Java
int count = Integer.parseInt(scanner.nextLine().trim());
String line = scanner.nextLine();
```
这就与C的处理有所不同了，指导书中推荐的解析方式是第二种。（果然不论到哪里，输入输出都是我最头疼的部分，想当初数据结构期末，就是因为输出问题导致Rhiannon彻底失败，Rhiannon审了一百遍代码，下机后发现copy来的代码有个循环没删）

我们进一步详细看一下这个代码。

这段代码的作用是：
 < 读取一整行输入，去掉首位空白，把剩下的文本转化为整数存储到变量当中。
```Java
int count = Integer.parseInt(scanner.nextLine().trim());
```
这行代码其实是几个步骤的整合：
```Java
String original = scanner.nextLine();
String cleaned = original.trim();
int count = Integer.parseInt(cleaned);
```




### 11 字符串分割
在第二次作业中，我们遇到：
```Java
String[] parts = line.trim().split(" +");
```
拆开来看。

我们先定义（注意空白符）：
```Java
String line = "  add_potion   Alice   heal1   50  ";
```
首先，`line.tirm()`负责去掉首位空格，得到字符串：`add_potion   Alice   heal1   50`。

在这里，原来的变量`line`不会被修改，而`trim()`返回处理后的结果。

紧接着是`.split(" +")`，这个知识点就比较新颖了，意思是“按一个或多个普通空格分割”，` +`在这里是一个正则表达式：
 - 空格表示匹配普通空格
 - `+`表示前面的内容出现一次或多次。
这样我们得到的字符串数组就是：
```
parts[0] = "add_potion"
parts[1] = "Alice"
parts[2] = "heal1"
parts[3] = "50"
```
接着，我们就可以使用上一节中提到的方法将`part[3]`转化为`int`类型进行保存。

哦对！回来补充一下几个长度写法：
| 对象 | 获取长度或数量 |
|---|---|
| 数组 `parts` | `parts.length` |
| 字符串 `line` | `line.length()` |
| 下一部分的 `ArrayList` | `list.size()` |
（~~带括号or不带，这是个值得思考的问题~~）😋

### 12 读取操作的完整示例
说了这么多，我觉得放个代码切片，希望能够帮助大家回忆并整合一下：
```Java
import java.util.Scanner;

public class MainClass {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int count = Integer.parseInt(scanner.nextLine().trim());

        for (int i = 0; i < count; i++) {
            String line = scanner.nextLine();
            String[] parts = line.trim().split(" +");

            String command = parts[0];

            if ("add_player".equals(command)) {
                String name = parts[1];

                System.out.println("读取到玩家：" + name);
            } else if ("add_potion".equals(command)) {
                String name = parts[1];
                String potionId = parts[2];
                int amplifier = Integer.parseInt(parts[3]);

                System.out.println(
                    "读取到药水：" + name + " "
                    + potionId + " " + amplifier
                );
            }
        }
    }
}
```
输入：
```
3
add_player Alice
add_potion Alice heal1 50
add_player Bob
```
输出：
```
读取到玩家：Alice
读取到药水：Alice heal1 50
读取到玩家：Bob
```


## 三、怎样保存多个对象
这一部分，我们将学习`ArrayList`的相关内容，作为第二次作业的核心知识点，我们将解决对象的管理、查找以及删除的操作。

### 1 从C出发











