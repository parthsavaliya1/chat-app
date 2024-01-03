import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { baseUrl, getRequest } from '../utils/service';

const useFetchLatestMessage = (chat) => {
    const {newMessage,notifications} = useContext(ChatContext);
    const [latestMessage,setIsLatestMessage] = useState(null);

    useEffect(() => {
        const getMessage = async() => {
            const response = await getRequest(`${baseUrl}/message/${chat?._id}`);

            if(response?.error) {
                return console.log(response?.error);

            }

            const lastMessage = response[response?.length-1];
            setIsLatestMessage(lastMessage)
        }
        getMessage()
    },[newMessage,notifications])
  return {latestMessage}
}

export default useFetchLatestMessage
