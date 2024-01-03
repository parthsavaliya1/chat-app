import React, { useContext } from 'react'
import { useFetchRecipent } from '../../hooks/useFetchRecipent'
import { Stack } from 'react-bootstrap';
import Avtar from '../../assets/avtar.svg'
import { ChatContext } from '../../context/ChatContext';
import { unReadNotification } from '../../utils/unReadNotification';
import useFetchLatestMessage from '../../hooks/useFetchLatestMessage';
import moment from 'moment';

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipent(chat, user);
    const { onlineUsers, notifications, markThisUserNotificationAsread } = useContext(ChatContext)

    const { latestMessage } = useFetchLatestMessage(chat)

    const unReadNotifications = unReadNotification(notifications)
    const thisUserNotifications = unReadNotifications?.filter((n) => n?.senderId === recipientUser?._id);


    const isOnline = onlineUsers?.some((user) => recipientUser?._id === user?.userId)

    const truncateText = (text) => {
        let shortText = text?.substring(0, 20);

        if (text?.length > 20) {
            shortText = shortText + "..."
        }

        return shortText;
    }

    return (
        <Stack role='button' direction='horizontal' gap={3} className='user-card align-items-center p-2 justify-content-between' onClick={() => {
            if (thisUserNotifications?.length !== 0) {
                markThisUserNotificationAsread(thisUserNotifications, notifications)
            }
        }}>
            <div className='d-flex'>
                <div className='me-2'>
                    <img src={Avtar} height={'35px'} />
                </div>
                <div className='text-content'>
                    <div className='name'>
                        {recipientUser?.name}
                    </div>
                    <div className='text'>
                        {latestMessage?.text && (
                            <span>{truncateText(latestMessage?.text)}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className='d-flex flex-column align-items-end'>
                <div className='date'>
                    {moment(latestMessage?.createdAt).calendar()}

                </div>
                <div className={thisUserNotifications?.length > 0 ? 'this-user-notifications' : ''}>{thisUserNotifications?.length > 0 ? thisUserNotifications?.length : ''}</div>
                <span className={isOnline ? 'user-online' : ''}></span>
            </div>
        </Stack>
    )
}

export default UserChat
