import { Box, Container, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { UserState } from '../contexts/UserProvider'
import Banner from '../components/miscellaneous/Banner';
import axios from 'axios';

const Transactionpage = () => {

  const { user } = UserState();
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {

    console.log('user', user)

    const fetchUserTransaction = async () => {

      const response = await axios.get('/api/transaction/', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      const transactions = response.data;
      console.log(transactions)
    }
    fetchUserTransaction()
  }, [])

  return (
    <>
      {user &&
        <Container maxW='xl' centerContent>
          <Banner />

          <Box
            bg={'white'}
            w={'100%'}
            p={'3'}
            borderRadius={'lg'}
            borderWidth={'1px'}
          >
            <Box maxW='32rem'>
              <Text fontSize={'2xl'} fontFamily={'Work sans'} textAlign={'center'}>
                Your transactions
              </Text>
            </Box>

            <Box>

            </Box>
          </Box>
        </Container>

      }
    </>
  )
}

export default Transactionpage