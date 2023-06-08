import React, { useState } from 'react'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { UserState } from '../contexts/UserProvider'
import { ChatState } from '../contexts/ChatProvider'
import { BellIcon, ChatIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge'
import { getSender } from '../helpers/ChatHelper'
import { useNavigate } from 'react-router-dom';

const MessagesDropdown = () => {

  const { user } = UserState()
  const { setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <li className="nav-item dropdown no-arrow mx-1">
      <Menu >
        <MenuButton className={'nav-link'}>
          <NotificationBadge
            count={notification.length}
            effect={Effect.SCALE}
          />
          <i className="fas fa-envelope fa-fw fa-2x"></i>

        </MenuButton>
        <MenuList pl={2}>
          {!notification.length && "No new messages"}
          {notification.map(notif => (
            <MenuItem key={notif._id} onClick={() => {
              setSelectedChat(notif.chat)
              setNotification(notification.filter(n => n !== notif))
            }}>
              {notif.chat.isGroupChat
                ? `New message in ${notif.chat.chatName}`
                : `${getSender(user, notif.chat.users)} sent you a new message`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </li>
  )
}

export default MessagesDropdown