import React from 'react'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { UserState } from '../../contexts/UserProvider'
import { ChatState } from '../../contexts/ChatProvider'
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge'
import { getSender } from '../../helpers/ChatHelper'
import { useNavigate } from 'react-router-dom';

const MessagesDropdown = () => {

  const { user } = UserState()
  const { setSelectedChat, notification, setNotification } = ChatState();
  const navigate = useNavigate();
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
              navigate('/chats');
              setNotification(notification.filter(n => n._id !== notif._id))
              setSelectedChat(notif.chat)
            }}>
              {`${getSender(user, notif.chat.users)} sent you a new message`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </li>
  )
}

export default MessagesDropdown