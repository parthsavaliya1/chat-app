import React, { useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { unReadNotification } from '../../utils/unReadNotification'
import moment from 'moment'

const Notification = () => {
    const [isOpen, setisOpen] = useState(false)
    const { user } = useContext(AuthContext)
    const { notifications, userChats, allUsers, markAllAsReadNotification, markAsReadNotification } = useContext(ChatContext)

    const unReadNotifications = unReadNotification(notifications);
    console.log(allUsers)
    const modifiedNotification = notifications?.map((n) => {

        const sender = allUsers?.find((user) => user?._id === n?.senderId)
        console.log(sender)
        return {
            ...n,
            senderName: sender?.name
        }
    })
    console.log(modifiedNotification)
    return (
        <div className='notifications'>
            <div className="notifications-icon" onClick={() => setisOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-left-fill" viewBox="0 0 16 16">
                    <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                </svg>
                {
                    unReadNotifications?.length === 0 ? null : (
                        <span className='notification-count'>
                            <span className=''>{unReadNotifications?.length}</span>
                        </span>
                    )
                }
            </div>
            {isOpen && (
                <div className="notifications-box">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        <div className='mark-as-read' onClick={() => markAllAsReadNotification(notifications)}>
                            Mark all as read
                        </div>
                    </div>
                    {modifiedNotification?.length === 0 ? <span className='notification'> No Notification yet...</span> : (
                        modifiedNotification?.map((noti, index) => (
                            <div key={index} className={noti?.isRead ? 'notification' : 'notification not-read'} onClick={() => {
                                markAsReadNotification(noti, userChats, user, notifications),
                                    setisOpen(false)
                            }}>
                                <span>{`${noti?.senderName} sent a new message`}</span>
                                <span className='notification-time'>{moment(noti?.date).calendar()}</span>
                            </div>
                        ))
                    )}
                </div>
            )
            }

        </div >
    )
}

export default Notification