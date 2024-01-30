import { useI18n } from 'vue-i18n'
import { notify as n } from 'notiwind'

const useNotify = (
  formName: string,
) => {
  const { t } = useI18n()

  const notify = (
    actionName:string = 'action',
    type:string = 'success',
    message?:string,
    timeout:number = 2000,
  ) => {
    n({
      group: 'bottom',
      type: type,
      title: t(`app.components.notification.${type}.defaultTitle`),
      text: message || t(`app.components.notification.${type}.defaultMessage`, { name: formName, action: actionName })
    }, timeout)
  }

  return {
    notify
  }
}

export {
  useNotify
}
