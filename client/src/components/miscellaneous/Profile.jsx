import { Alert, AlertIcon, AlertTitle, Input, Text } from '@chakra-ui/react'
import React from 'react'
const Profile = ({ user }) => {

  return (
    <>
      <Text fontSize={'3xl'} textAlign={'center'}>Your infomation</Text>
      <Text fontSize={'xl'}>Username</Text>
      <Input mb={3} variant='filled' placeholder='Username' value={user.name} isDisabled />
      <Text fontSize={'xl'}>Email</Text>
      <Input mb={3} variant='filled' placeholder='Email' value={user.email} isDisabled />
      <Text fontSize={'xl'}>Balance</Text>
      <Input mb={3} variant='filled' placeholder='Balance' value={user.balance} isDisabled />
      <Text fontSize={'xl'}>Status </Text>
      {user.card_disabled
        ? <Alert status='error'>
          <AlertIcon />
          <AlertTitle>Your card is currently disabled</AlertTitle>
          {/* <AlertDescription>Contact admin to reactivate it</AlertDescription> */}
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