import React from 'react'
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { Container, Stack } from 'react-bootstrap'
import UserChat from '../components/Chat/UserChat'
import PotentialChats from '../components/Chat/POtentialChats'
import ChatBox from '../components/Chat/ChatBox'

const Chat = () => {
    const { userChats, isUserChatLoading, updateCurrentChat } = useContext(ChatContext);
    const { user } = useContext(AuthContext);

    return (
        <>
            <Container>
                <PotentialChats />
                {userChats?.length < 1 ? null : (
                    <Stack direction="horizontal" gap={4} className='align-items-start'>
                        <Stack className='messages-box flex-grow-0 pe-3' gap={3}>
                            {isUserChatLoading ? (
                                <p>Loading chats</p>
                            ) : (
                                userChats?.map((chat, index) => (
                                    <div key={index} onClick={() => updateCurrentChat(chat)}>
                                        <UserChat chat={chat} user={user} />
                                    </div>
                                ))
                            )}
                        </Stack>
                        <ChatBox />
                    </Stack>
                )}
            </Container>
        </>
    )
}

export default Chat
