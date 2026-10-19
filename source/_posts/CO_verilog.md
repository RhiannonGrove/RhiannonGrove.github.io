---
title: verilog语法初步
date: 2026-10-19 22:25:00
tags:
 - 计组
---

## 前言
  这是Rhiannon挫败激情下的产物。P1上机三道题只过了一道，但是Rhiannon自认为写的程序没什么问题，给的输入输出样例也是一样的，然而测试点却是 `WA` ，这无疑狠狠摧毁了Rhiannon的自信心，在焦急等待P1课下提交开放时，Rhiannon决定写这篇`verilog语法初步`（没错本来没打算写）。
  
  （~~所以这种受挫来写blog的冲动是哪来的~~）

  鉴于这只用来复习用，所以阅读顺序可能会对新朋友不太友好。
  
## 1 下载及创建新文件

  略。

## 2 电路模块  `module`
  在创建好文件后，verilog会贴心的给我们写好一些必备物品，其中就包含 `module` ，但是我们在这里还要说一下。

  `module`是verilog中的基本组织单位，可以理解为“一个带输入输出接口的电路”。

  ```verilog
  module and_gate(
    input wire a,
    input wire b,
    output wire y
  );

    assign y = a & b ;

  endmodule
  ```
## 3 信号类型：`wire`和`reg`
  `wire`相当于logisim中的导线，而`reg`呢，就是寄存器啦。

### 3.1 声明
  除了需要的输入输出信号之外，我们通常还需要中间变量，因此我们需要声明一些变量or常量。那么我们先来说明一下`wire`和`reg`两种如何进行声明。
  
  在logisim的学习中，我们已经知道一个信号在声明时一定要加上其位宽，在verilog中也是一样的：
  ```verilog
wire [7:0] a;
reg [7:0] b;
  ```
  在这段代码中，`a`与`b`都是位宽为8的变量。当然你也能`wire [8:1] a` 甚至 `wire [1:8] a`，不过这样做可能导致后期debug时非常痛苦，建议使用常规做法，相信我，可以帮你节省很多时间。😉

 ### 3.2 赋值
  那么需要注意的是两者的赋值方式。

  `wire`型变量用`assign`进行赋值，例如：
  ```verilog
wire a;
assign a = 1'b0;
```
  而`reg`型变量则需要放到`always`、`initial`等模块中进行赋值，例如：
  ```verilog
wire a;
reg b;
always @(*) begin
  b <= a;
end
  ```
  当然我们也能：
 ```verilog
assign flag = data[0];
assign low = data[3:0];
```

## 4 数字格式
  在verilog中，与C语言有很大区别的地方在与对一个变量进行赋值。我们先来学习一下数字表示。

  在verilog中，有：
| 写法 | 含义 |
|---|---|
| `1'b0` | 1 位二进制 0 |
| `4'b1010` | 4 位二进制 1010 |
| `8'd25` | 8 位十进制 25 |
| `8'hA5` | 8 位十六进制 A5 |
| `4'b0000` | 4 位全部为 0 |
