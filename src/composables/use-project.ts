import { computed } from 'vue'
import dayjs from 'dayjs'
import { Project } from '@/typings/models/project.type'

const useProject = (project?: Project) => {
  const avatar = computed(() => {
    return project.user?.avatar
  })

  const userInitial = computed(() => {
    return project.user?.username[0]
  })

  const isNeedQuotation = computed(() => {
    return project?.status === 'quotation' && project?.quotations?.length <= 0
  })

  const isQuoted = computed(() => {
    return project?.quotations?.length > 0
  })

  const isAlmostExpired = computed(() => {
    // TODO :: validate project expiry
    return dayjs().diff(dayjs(project?.createdAt), 'day') > 15
  })

  const taskProgress = computed(() => {
    const finishedTasks = project.tasks.filter(task => task.isFinish)

    if (project.tasks.length <= 0) {
      return ''
    }
    return `${finishedTasks.length}/${project.tasks.length}`
  })

  const hasTag = computed(() => isNeedQuotation.value || isAlmostExpired.value || isQuoted.value)

  return {
    avatar,
    userInitial,
    isAlmostExpired,
    isNeedQuotation,
    isQuoted,
    taskProgress,
    hasTag
  }
}

export {
  useProject
}
