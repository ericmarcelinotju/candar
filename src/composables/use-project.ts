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

  const isExpired = computed(() => {
    return project?.isExpired
  })

  const isAlmostExpired = computed(() => {
    console.log('CREATED AT', project?.createdAt)
    console.log('EXPIRED AT', project?.expiredAt)
    console.log(dayjs().diff(dayjs(project?.createdAt), 'day'))
    return dayjs(project?.expiredAt).diff(new Date(), 'day') >= 2
  })

  const taskProgress = computed(() => {
    const finishedTasks = project.tasks.filter(task => task.isFinish)

    if (project.tasks.length <= 0) {
      return ''
    }
    return `${finishedTasks.length}/${project.tasks.length}`
  })

  const hasTag = computed(() => isNeedQuotation.value || isAlmostExpired.value || isQuoted.value || isExpired.value)

  const isEditable = computed(() => {
    return !isExpired.value && project.status !== 'lose' && project.status !== 'win'
  })

  return {
    avatar,
    userInitial,
    isAlmostExpired,
    isNeedQuotation,
    isQuoted,
    isExpired,
    taskProgress,
    hasTag,
    isEditable
  }
}

export {
  useProject
}
