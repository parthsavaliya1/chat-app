import React, { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

const PotentialChats = () => {
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
    const { user } = useContext(AuthContext)
    return (
        <>
            <div className="all-users" >
                {potentialChats && potentialChats?.map((u, index) => (
                    <div className="single-user" onClick={() => createChat(user?._id, u?._id)} key={index}>
                        {u?.name}
                        <span className={onlineUsers?.some((user) => u?._id === user?.userId) ? `user-online` : ''}></span>
                    </div>
                ))}
            </div>
        </>
    )
}

export default PotentialChats