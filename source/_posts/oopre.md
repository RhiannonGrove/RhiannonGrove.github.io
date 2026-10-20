---
title: 一周通关oopre
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

## 从C语言的结构体出发
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
