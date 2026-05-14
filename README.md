# Novel Redirect Landing

独立小说类 App 短跳转承接页：访问我方入口后记录基础 page_view，并无感跳转到客户长链接。

## 配置

Vercel 环境变量：

- `DESTINATION_URL`：客户原始长链接，必填。
- `NEXT_PUBLIC_GA_ID`：可选，GA4 Measurement ID；配置后会加载 gtag 并发送 page_view。

## 路由

- `/`：默认跳转入口
- `/r`：推荐投放入口

入口参数会透传到最终客户链接；同名参数入口覆盖客户链接。
