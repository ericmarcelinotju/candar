import { Project } from '@/typings/models/project.type'

export class ProjectByStatus {
    count: number
    status: string
}
export class Dashboard {
    activeProject: number
    almostDueProject: number
    projectByStatus: ProjectByStatus[]
    projects: Project[]
}
