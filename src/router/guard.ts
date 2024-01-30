import stores from '@/stores'
import { login } from './routes/auth'

export const guardGuest = (to, from, next) => {
  if (stores.getters['auth/isLoggedIn']) {
    next('/')
  } else {
    next()
  }
}
export const guardAuth = (to, from, next) => {
  if (stores.getters['auth/isLoggedIn']) {
    next()
  } else {
    next(login.name)
  }
}
