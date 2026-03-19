import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell } from 'lucide-react'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Your workout dashboard is being built. More features coming soon.
        </p>
      </div>

      <Card className="max-w-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <Dumbbell className="h-5 w-5 text-sky-500" />
          <CardTitle className="text-base">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Plans, workout logging, and progress reports are on the way.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
