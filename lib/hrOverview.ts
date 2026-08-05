import { prisma } from './prisma'

function lastNDays(n: number) {
  const days: Date[] = []
  const today = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    d.setUTCDate(d.getUTCDate() - i)
    days.push(d)
  }
  return days
}

function isWeekday(d: Date) {
  const day = d.getUTCDay()
  return day !== 0 && day !== 6
}

export async function getHrOverview(tenantId: string) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30)

  const [users, timeEntries, leaveRequests, onboardingTasks] = await Promise.all([
    prisma.user.findMany({ where: { tenantId, isActive: true } }),
    prisma.timeEntry.findMany({ where: { tenantId, date: { gte: thirtyDaysAgo } } }),
    prisma.leaveRequest.findMany({ where: { tenantId, status: 'PENDING' } }),
    prisma.task.findMany({
      where: {
        tenantId,
        category: 'Onboarding',
        status: { notIn: ['COMPLETED', 'CANCELLED'] }
      }
    })
  ])

  const recentWeekdays = lastNDays(7).filter(isWeekday)

  return users.map((user) => {
    const userEntries = timeEntries.filter((entry) => entry.userId === user.id)
    const entryDates = new Set(userEntries.map((entry) => entry.date.toISOString().slice(0, 10)))

    const missingTimeEntries = recentWeekdays.filter(
      (day) => !entryDates.has(day.toISOString().slice(0, 10))
    ).length

    const unusualTimeEntries = userEntries.filter(
      (entry) => entry.hoursWorked <= 0 || entry.hoursWorked > 12
    ).length

    const pendingLeaveCount = leaveRequests.filter((leave) => leave.userId === user.id).length
    const onboardingTasksPending = onboardingTasks.filter((task) => task.assignedToId === user.id).length

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      pendingLeaveCount,
      onboardingTasksPending,
      missingTimeEntries,
      unusualTimeEntries
    }
  })
}
