import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/service";
import { io } from 'socket.io-client'

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [chatError, setChatError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([])
    const [currentChat, setIsCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [messageError, setIsMessageError] = useState(null)
    const [sendTextMessageError, setIsSendTextMessageError] = useState(null);
    const [newMessage, setIsNewMessage] = useState(null)
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setIsOnlineUsers] = useState([])
    const [notifications, setNotifications] = useState([])
    const [allUsers, setIsAllUsers] = useState([])

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        return () => {
            newSocket.disconnect()
        }
    }, [user])

    useEffect(() => {
        if (socket === null) return
        socket.emit('addNewUser', user?._id)
        socket.on('getOnlineUsers', (res) => {
            setIsOnlineUsers(res)
        })
        return () => {
            socket.off('getOnlineUsers')
        }
    }, [socket])

    useEffect(() => {
        if (socket === null) return

        const recipientId = currentChat?.members?.find((id) => id !== user?._id);

        socket.emit('sendMessage', {
            ...newMessage, recipientId
        })
    }, [newMessage])

    useEffect(() => {
        if (socket === null) return

        socket.on('getMessage', (res) => {
            if (currentChat?._id !== res?.chatId) return
            setMessages((prev) => [...prev, res])
        })

        socket.on('getNotification', (res) => {
            const isChatOpen = currentChat?.members?.some((id) => id === res?.senderId);
            if (isChatOpen) {
                setNotifications((prev) => [{ ...res, isRead: true }, ...prev])
            } else {
                setNotifications((prev) => [res, ...prev])
            }
        })

        return () => {
            socket.off('getMessage');
            socket.off('getNotifications')
        }
    }, [socket, currentChat])

    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users`);
            if (response?.error) {
                return console.log('Error while get user', response?.error);
            }

            const pChats = response?.filter((u) => {
                let isChatCreated = false;
                if (user?._id === u?._id) return false
                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat?.members[0] === u?._id || chat?.members[1] === u?._id;
                    })
                }
                return !isChatCreated;
            })

            setPotentialChats(pChats)
            setIsAllUsers(response)
        }
        getUsers()
    }, [userChats])


    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setIsUserChatLoading(true);
                setChatError(null)
                const response = await getRequest(`${baseUrl}/chat/${user?._id}`);
                setIsUserChatLoading(false)
                if (response?.error) {
                    return setChatError(response);
                }
                setUserChats(response)
            }
        }
        getUserChats()
    }, [user])

    useEffect(() => {
        const getMessages = async () => {
            setIsMessageLoading(true);
            setIsMessageError(null);
            const response = await getRequest(`${baseUrl}/message/${currentChat?._id}`);

            setIsMessageLoading(false)
            if (response?.error) {
                setIsMessageError(response?.errors)
                return console.log('Error while getting message', response.error);
            }
            setMessages(response)
        }
        getMessages()
    }, [currentChat])

    const updateCurrentChat = useCallback((chat) => {
        setIsCurrentChat(chat)
    }, [])

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chat/create`, JSON.stringify({ firstId, secondId }));

        if (response?.error) {
            return console.log(response.error)
        }

        setUserChats((prev) => [...prev, response])
    }, [])

    const sendTextMessage = useCallback(async (textMsg, sender, currentChatId, setTextMessage) => {
        if (!textMsg) return console.log('Type something !!!')
        const response = await postRequest(`${baseUrl}/message/create`, JSON.stringify({ chatId: currentChatId, senderId: sender?._id, text: textMsg }));

        if (response?.error) {
            setIsSendTextMessageError(response?.errors)
            return console.log('Error while getting message', response.error);
        }

        setIsNewMessage(response)
        setMessages((prev) => [...prev, response])
        setTextMessage('')


    }, [])

    const markAllAsReadNotification = useCallback((notifications) => {
        const mNotification = notifications?.map((n) => {
            return { ...n, isRead: true }
        })
        setNotifications(mNotification)
    }, [])

    const markAsReadNotification = useCallback((n, userChat, user, notifications) => {
        const desiredChat = userChat?.find((chat) => {
            const chatMembers = [user?._id, n?.senderId];
            const isDesireChat = chat?.members?.every((member) => {
                return chatMembers?.includes(member)
            })
            return isDesireChat;
        })

        const mNotification = notifications?.map((el) => {
            if (n?.senderId === el?.senderId) {
                return { ...n, isRead: true }
            } else {
                return el
            }
        })
        updateCurrentChat(desiredChat)
        setNotifications(mNotification)
    }, [])

    const markThisUserNotificationAsread = useCallback((thisUserNotification, notifications) => {
        const mNotification = notifications?.map((el) => {
            let notification;
            thisUserNotification?.forEach((n) => {
                if (n?.senderId === el?.senderId) {
                    notification = { ...n, isRead: true }
                } else {
                    notification = el
                }
            })
            return notification;
        })
        setNotifications(mNotification)
    }, [])

    console.log(notifications)

    return (
        <ChatContext.Provider value={{ userChats, isUserChatLoading, chatError, potentialChats, createChat, updateCurrentChat, messages, currentChat, isMessageLoading, messageError, sendTextMessage, onlineUsers, notifications, allUsers, markAllAsReadNotification, markAsReadNotification, markThisUserNotificationAsread }}>
            {children}
        </ChatContext.Provider>
    )

}