export const unReadNotification = (notifications) => {
    return notifications?.filter((n) => n?.isRead === false)
}