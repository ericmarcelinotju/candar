import { Project } from '@/typings/models/project.type'

export class Dashboard {
    activeProject: number
    wonProject: number
    lostProject: number
    initiateProject: number
    qualificationProject: number
    quotationProject: number
    leadProject: number
    projects: Project[]
}
