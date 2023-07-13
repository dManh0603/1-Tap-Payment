import { ChatIcon } from '@chakra-ui/icons'
import { Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import ChatBox from './ChatBox'
import axios from 'axios'
import { UserState } from '../../contexts/UserProvider'
import ChatProvider, { ChatState } from '../../contexts/ChatProvider'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import ChatList from './ChatList'

const ChatButton = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const { user } = UserState()

  const toast = useToast();
  const storedToken = localStorage.getItem('userToken');

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      };
      console.log('access chat')

      const { data } = await axios.post('/api/chat', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      console.log('retrieved chat data', data);
      setSelectedChat(data);
      setLoading(false);

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error retrieving your chats',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const handleChatClick = () => {
    onOpen();
    // accessChat('6475d74a202e98a518cbca9b');
    // setNotification([])
  }

  return (
    <>

      <Button colorScheme='blue' onClick={handleChatClick}>
        <NotificationBadge
          count={notification.length}
          effect={Effect.SCALE}
        />
        <ChatIcon />
      </Button>
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} size={'md'}>
        <DrawerOverlay />
        
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Let's have a conversation.</DrawerHeader>
          <DrawerBody >
            {selectedChat
              ? <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              : <ChatList fetchAgain={fetchAgain} />
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer></>
  )
}

export default ChatButton