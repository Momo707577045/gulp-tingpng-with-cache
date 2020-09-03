### 「过滤重复压缩」
### 「替换源文件」
### 「静默压缩，不生成冗余文件」

## 项目特点
- 【过滤重复压缩】
  - 自动记录已被压缩过的图片，跳过压缩，加快进度。
  - 记录图片压缩后的 md5 值，再次运行压缩脚本时，跳过压缩。
  - 通过 md5 值比较文件变更，即使「文件迁移」也能自动过滤。
  - 通过 md5 值比较文件变更，即使「使用同名文件替换」也能自动识别，并压缩，没有漏网之鱼。
- 【替换源文件】
  - 压缩成功，直接替换源文件，不生成冗余文件，不需要复制粘贴，移动图片。
  - 静默压缩，对项目无感知，无任何影响。
- 【自动切换 api key】
  - tinypng 申请的 [api key](https://tinypng.com/developers) 每月只有 500 次免费压缩额度。
  - 可设置多个 api key，当某 key 超过使用次数时，自动切换下一个 key 进行压缩。
- 【压缩报告】
  - 记录每个图片的压缩数据，并生成汇总信息。
- 【压缩安全边界】
  - 压缩安全线，当压缩比例低于该百分比值时，保持源文件，避免过分压缩，损伤图片质量。
- 【源码携带详细备注，自带测试图片】
  - 降低源码阅读门槛，降低测试门槛，减低使用门槛。
  - 推荐阅读源码，打破恐惧，便于定制个性化需求。


## [项目地址](https://github.com/Momo707577045/gulp-tingpng-with-cache)


## 参数介绍
| 参数名 | 值类型 | 是否必填 | 参数作用 | 默认值 | 推荐值 |
| :------: | :------: | :------: | :------: | :------: | :------: |
| apiKeyList | Array | 必填 | tiny png 的 api key 数组，当其中一个不可用或超过使用次数时，自动切换下一个 key 调用 | 无 | 无 |
| reportFilePath | Number | 非必填 | 压缩报告文件路径，记录图片的压缩比例，生产压缩报告 | 无 | __dirname + '/tinyPngReport.json' |
| md5RecordFilePath | Number | 非必填 | 压缩后图片 md5 记录文件，如果待压缩图片的 md5 值存在于该文件，则跳过压缩，解决「重复压缩」问题 | 无 | __dirname + '/md5RecordFilePath.json' |
| minCompressPercentLimit | Number | 非必填 | 压缩安全线，当压缩比例低于该百分比时，保持源文件，避免图片过分压缩，损伤显示质量 | 0 | 10 |


## 示例运行步骤
- 第一步：npm install
- 第二步：gulp


## 测试资源
- test-img：图片压缩测试目录
- test-img-origin：测试图片备份目录，用于恢复测试


## 运行效果
![运行效果](http://upyun.luckly-mjw.cn/Assets/tinypng/001.png)

## 压缩报告
![压缩报告](http://upyun.luckly-mjw.cn/Assets/tinypng/002.png)

## md5 记录
![md5 记录](http://upyun.luckly-mjw.cn/Assets/tinypng/003.png)


## 特别感谢
- 感谢 Gaurav Jassal，本项目改编自他的 [gulp-tinypng](https://github.com/creativeaura/gulp-tinypng)
