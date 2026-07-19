import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)

export { dayjs }

export const formatDate = (date: Date | string) => {
  return dayjs(date).format('MMM DD, YYYY')
}

export const formatTime = (date: Date | string) => {
  return dayjs(date).format('hh:mm A')
}

export const formatDateTime = (date: Date | string) => {
  return dayjs(date).format('MMM DD, YYYY hh:mm A')
}

export const getGreeting = () => {
  const hour = dayjs().hour()
  
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export const isTodayDate = (date: Date | string) => {
  return dayjs(date).isToday()
}

export const isTomorrowDate = (date: Date | string) => {
  return dayjs(date).isTomorrow()
}

export const getStartOfDay = (date?: Date | string) => {
  return dayjs(date).startOf('day').toDate()
}

export const getEndOfDay = (date?: Date | string) => {
  return dayjs(date).endOf('day').toDate()
}

export const getStartOfWeek = (date?: Date | string) => {
  return dayjs(date).startOf('week').toDate()
}

export const getEndOfWeek = (date?: Date | string) => {
  return dayjs(date).endOf('week').toDate()
}

export const getStartOfMonth = (date?: Date | string) => {
  return dayjs(date).startOf('month').toDate()
}

export const getEndOfMonth = (date?: Date | string) => {
  return dayjs(date).endOf('month').toDate()
}
