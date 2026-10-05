# 相邻字符抵消

> 题目标识：`Pre_cancel`

## 1 题目描述

给定一个只包含大写英文字母的字符串。若两个相同字符相邻，则这两个字符同时消失。字符消失后，新形成的相邻字符仍须按照相同规则继续抵消，直到字符串中不存在相邻且相同的字符。

请使用 MIPS 汇编程序输出最终得到的字符串。最终结果与优先消去哪一对相同字符无关。

例如：

```text
ABBACDDCE -> AACDDCE -> CDDCE -> CCE -> E
```

## 2 输入格式

输入一行字符串，满足以下条件：

- 字符串长度为 `1` 至 `1000`。
- 字符串仅包含大写英文字母 `A` 至 `Z`。

## 3 输出格式

- 若最终字符串非空，输出最终字符串并换行。
- 若最终字符串为空，输出 `EMPTY` 并换行。

## 4 输入输出样例

### 样例一

输入：

```text
ABBACDDCE
```

输出：

```text
E
```

### 样例二

输入：

```text
ABCCBA
```

输出：

```text
EMPTY
```

## 5 提交要求

1. 使用 MIPS 汇编语言完成程序。
2. 程序入口必须使用 `.globl main`。
3. 程序结束时必须通过系统调用正常退出：

```mips
li $v0, 10
syscall
```

## 6 C 语言参考代码

```c
#include <stdio.h>

#define MAX_LEN 1000

int main(void) {
    char input[MAX_LEN + 1];
    char stack[MAX_LEN + 1];
    int top = 0;

    scanf("%s", input);

    for (int i = 0; input[i] != '\0'; i++) {
        if (top > 0 && stack[top - 1] == input[i]) {
            top--;
        } else {
            stack[top++] = input[i];
        }
    }

    if (top == 0) {
        printf("EMPTY\n");
    } else {
        stack[top] = '\0';
        printf("%s\n", stack);
    }

    return 0;
}
```

