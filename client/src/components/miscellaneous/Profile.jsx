import { Alert, AlertIcon, AlertTitle, Input, Text } from '@chakra-ui/react'
import React from 'react'
const Profile = ({ user }) => {

  return (
    <>
      <Text fontSize={'2xl'} textAlign={'center'}>Your infomation</Text>
      <Text fontSize={'lg'}>Username</Text>
      <Input mb={3} variant='filled' placeholder='Username' value={user.name} isDisabled />
      <Text fontSize={'lg'}>Email</Text>
      <Input mb={3} variant='filled' placeholder='Email' value={user.email} isDisabled />
      <Text fontSize={'lg'}>Balance</Text>
      <Input mb={3} variant='filled' placeholder='Balance' value={user.balance} isDisabled />
      <Text fontSize={'lg'}>Status </Text>
      {user.card_disabled
        ? <Alert status='error'>
          <AlertIcon />
          <AlertTitle>Your card is currently disabled</AlertTitle>
        </Alert>
        : <Alert status='success'>
          <AlertIcon />
          Your card is avaiable
        </Alert>
      }
    </>
  )
}

export default Profile