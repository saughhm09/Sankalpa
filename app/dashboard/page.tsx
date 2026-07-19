import { Navigation } from '@/components/layout/navigation'
import { DashboardView } from '@/features/dashboard/dashboard-view'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <DashboardView />
      </main>
    </>
  )
}
