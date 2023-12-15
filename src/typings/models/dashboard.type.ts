import { Project, ProjectStatus } from '@/typings/models/project.type'
import { QuotationStatus } from '@/typings/models/quotation.type'

export class ProjectByStatus {
    count: number
    status: ProjectStatus
}

export class QuotationByStatus {
    count: number
    status: QuotationStatus
}

export class ProjectStatusBySource {
    source: string
    status: ProjectStatus
    count: number
}

export class ProjectBySource {
    source: string
    status: ProjectStatusBySource[]
}

export class DashboardFilter {
    userId: string
}

export class Dashboard {
    activeProject: number
    almostDueProject: number
    projectBySource: ProjectBySource[]
    projectByStatus: ProjectByStatus[]
    quotationByStatus: QuotationByStatus[]
    projects: Project[]
}
