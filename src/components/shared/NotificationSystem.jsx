import { useNotification } from '../../hooks/notification/useNotifications'
import '../../styles/NotificationSystem.css'

const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotification()

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className="notification-system">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type} has-icon`}
          onClick={() => removeNotification(notification.id)}
          role="alert"
          aria-live="polite"
        >
          <div className="notification-content">
            <div className="notification-title">
              {getNotificationIcon(notification.type)} {notification.title}
            </div>
            {notification.message && (
              <div className="notification-message">{notification.message}</div>
            )}
          </div>
          <div 
            className="notification-progress"
            style={{ animationDuration: `${notification.duration}ms` }}
          />
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem