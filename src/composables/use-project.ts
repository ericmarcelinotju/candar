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
    // TODO :: validate quotation must exist
    return project?.status === 'quotation'
  })

  const isAlmostExpired = computed(() => {
    // TODO :: validate project expiry
    return dayjs().diff(dayjs(project?.created_at), 'day') > 15
  })

  const taskProgress = computed(() => {
    const finishedTasks = project.tasks.filter(task => task.isFinish)

    if (project.tasks.length <= 0) {
      return ''
    }
    return `${finishedTasks.length}/${project.tasks.length}`
  })

  const hasTag = computed(() => isNeedQuotation.value || isAlmostExpired.value)

  return {
    avatar,
    userInitial,
    isAlmostExpired,
    isNeedQuotation,
    taskProgress,
    hasTag
  }
}

export {
  useProject
}
