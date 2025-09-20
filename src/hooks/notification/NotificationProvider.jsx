import { useCallback, useState } from 'react'
import { NotificationContext } from './NotificationContext'


const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const removeNotification = useCallback((id) => {
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, [])

    const clearNotifications = useCallback(() => {
      setNotifications([])
    }, [])
  const addNotification = useCallback((notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title,
      message: notification.message,
      duration: notification.duration || 5000
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
  }, [removeNotification])

 

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
export default NotificationProvider;