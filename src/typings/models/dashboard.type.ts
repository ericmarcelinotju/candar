import { Project } from '@/typings/models/project.type'

export class ProjectByStatus {
    count: number
    status: string
}

export class ProjectStatusBySource {
    source: string
    status: string
    count: number
}
export class ProjectBySource {
    source: string
    status: ProjectStatusBySource[]
}
export class Dashboard {
    activeProject: number
    almostDueProject: number
    projectBySource: ProjectBySource[]
    projectByStatus: ProjectByStatus[]
    projects: Project[]
}
