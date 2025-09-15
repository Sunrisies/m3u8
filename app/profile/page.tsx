import { Navigation } from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Cog, History, User } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  // 模拟用户数据
  const user = {
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/placeholder.svg?height=128&width=128",
    joinDate: "2023年10月",
    watchHistory: [
      {
        id: "1",
        title: "Amazing Nature Documentary: Wildlife in 4K",
        thumbnail: "/nature-documentary-wildlife.jpg",
        watchedAt: "昨天",
        progress: 75,
      },
      {
        id: "2",
        title: "Tech Innovation Summit 2024: AI & Robotics",
        thumbnail: "/tech-conference-ai-robotics.jpg",
        watchedAt: "3天前",
        progress: 100,
      },
      {
        id: "3",
        title: "Cooking Masterclass: Professional Techniques",
        thumbnail: "/cooking-masterclass-chef-kitchen.jpg",
        watchedAt: "上周",
        progress: 45,
      },
    ],
    savedVideos: [
      {
        id: "4",
        title: "Space Exploration: Mars Mission Updates",
        thumbnail: "/placeholder.svg?height=120&width=160",
        savedAt: "2周前",
      },
      {
        id: "5",
        title: "Digital Art Tutorial: Advanced Techniques",
        thumbnail: "/digital-art-tutorial.jpg",
        savedAt: "1个月前",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-8">
        {/* 主题切换按钮 - 移动端显示在右上角 */}
        <div className="fixed top-4 right-4 z-50 md:hidden">
          <ThemeToggle />
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="mb-4 text-3xl font-bold md:mb-0">个人中心</h1>
          {/* 主题切换按钮 - 桌面端 */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* 用户信息卡片 */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-8 pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">加入时间</span>
                    <span>{user.joinDate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link href="/profile/settings">
                      <Cog className="h-4 w-4" />
                      账户设置
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link href="/profile/history">
                      <History className="h-4 w-4" />
                      完整观看历史
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 内容区域 */}
          <div className="md:col-span-2">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="history" className="flex-1">
                  <History className="mr-2 h-4 w-4" />
                  观看历史
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex-1">
                  <Clock className="mr-2 h-4 w-4" />
                  稍后观看
                </TabsTrigger>
                <TabsTrigger value="account" className="flex-1">
                  <User className="mr-2 h-4 w-4" />
                  账户信息
                </TabsTrigger>
              </TabsList>

              {/* 观看历史标签内容 */}
              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>最近观看</CardTitle>
                    <CardDescription>您最近观看的视频</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.watchHistory.map((video) => (
                        <div key={video.id} className="flex gap-4">
                          <div className="relative aspect-video h-20 w-36 overflow-hidden rounded-md">
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              className="h-full w-full object-cover"
                            />
                            {/* 进度条 */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${video.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <h3 className="line-clamp-2 text-sm font-medium">{video.title}</h3>
                              <p className="text-xs text-muted-foreground">{video.watchedAt}</p>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/watch/${video.id}`}>继续观看</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 稍后观看标签内容 */}
              <TabsContent value="saved" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>稍后观看</CardTitle>
                    <CardDescription>您保存的视频</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.savedVideos.map((video) => (
                        <div key={video.id} className="flex gap-4">
                          <div className="aspect-video h-20 w-36 overflow-hidden rounded-md">
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <h3 className="line-clamp-2 text-sm font-medium">{video.title}</h3>
                              <p className="text-xs text-muted-foreground">保存于 {video.savedAt}</p>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/watch/${video.id}`}>观看</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 账户信息标签内容 */}
              <TabsContent value="account" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>账户信息</CardTitle>
                    <CardDescription>管理您的个人信息</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">用户名</label>
                        <p className="rounded-md border p-2">{user.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">电子邮箱</label>
                        <p className="rounded-md border p-2">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">加入时间</label>
                        <p className="rounded-md border p-2">{user.joinDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">账户类型</label>
                        <p className="rounded-md border p-2">标准用户</p>
                      </div>
                    </div>

                    <Button className="mt-4">编辑个人信息</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}