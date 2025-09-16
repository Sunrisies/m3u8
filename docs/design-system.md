# StreamHub 设计系统

## 🎨 视觉风格统一规范

### 配色方案
- **主色调**: 蓝色系 (#3b82f6)
- **背景色**: 
  - 浅色模式: #ffffff
  - 深色模式: #0f172a
- **文字颜色**:
  - 主文字: hsl(var(--foreground))
  - 次要文字: hsl(var(--muted-foreground))

### 字体系统
- **主字体**: Geist Sans
- **等宽字体**: Geist Mono
- **字体大小层级**:
  - 页面标题: text-3xl (30px)
  - 区块标题: text-xl (20px)
  - 卡片标题: text-base (16px)
  - 正文: text-sm (14px)
  - 辅助信息: text-xs (12px)

### 间距系统
- **页面容器**: container px-4 py-6
- **区块间距**: mb-8 (32px)
- **卡片间距**: gap-6 (24px)
- **内容间距**: p-4 (16px)

### 组件规范

#### 页面布局
```tsx
<div className="min-h-screen bg-background">
  <Navigation />
  <main className="container px-4 py-6">
    {/* 页面内容 */}
  </main>
</div>
```

#### 页面标题
```tsx
<div className="mb-8">
  <h1 className="text-3xl font-bold mb-2">页面标题</h1>
  <p className="text-muted-foreground">页面描述</p>
</div>
```

#### 视频卡片
```tsx
<Card className="group overflow-hidden transition-all hover:shadow-lg">
  <div className="relative aspect-video overflow-hidden">
    <img className="h-full w-full object-cover transition-transform group-hover:scale-105" />
    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
    <Button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100">
      <Play className="h-4 w-4" />
    </Button>
    <Badge className="absolute bottom-2 left-2" variant="secondary">分类</Badge>
    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">时长</div>
  </div>
  <CardContent className="p-4">
    <h3 className="font-semibold text-balance leading-tight mb-2">标题</h3>
    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">描述</p>
    <div className="mb-2 text-xs text-muted-foreground">创作者 • 时间</div>
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Eye className="h-3 w-3" />
        观看次数
      </div>
      <div className="flex items-center gap-1">
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        评分
      </div>
    </div>
  </CardContent>
</Card>
```

### 响应式断点
- **移动端**: < 640px (sm)
- **平板端**: 640px - 1024px (md/lg)
- **桌面端**: > 1024px (xl)

### 网格系统
- **移动端**: grid-cols-1
- **平板端**: sm:grid-cols-2
- **桌面端**: lg:grid-cols-2 xl:grid-cols-3

### 动画效果
- **过渡时间**: transition-all (150ms)
- **悬停缩放**: group-hover:scale-105
- **阴影效果**: hover:shadow-lg
- **透明度**: opacity-0 group-hover:opacity-100

### 主题切换
- **位置**: 导航栏右侧显眼位置
- **移动端**: 侧边栏底部
- **支持**: 浅色/深色/系统自动

## 📱 页面一致性检查清单

### 所有页面必须包含:
- [x] Navigation 组件
- [x] 统一的页面布局结构
- [x] 一致的标题样式
- [x] 统一的卡片设计
- [x] 响应式网格布局
- [x] 主题切换支持

### 已统一的页面:
- [x] 首页 (app/page.tsx)
- [x] 观看页面 (app/watch/[id]/page.tsx)
- [x] 个人中心 (app/profile/page.tsx)
- [x] 视频网格组件 (components/video-grid.tsx)

## 🔧 技术实现

### CSS 变量系统
所有颜色使用 CSS 变量，支持主题切换:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Tailwind 配置
```js
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ...
      }
    }
  }
}