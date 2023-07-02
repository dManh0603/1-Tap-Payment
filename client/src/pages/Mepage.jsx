import { Box, Container, Input, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserState } from '../contexts/UserProvider';
import Banner from '../components/miscellaneous/Banner';
import Profile from '../components/miscellaneous/Profile';
import DepositModal from '../components/miscellaneous/DepositModal';
import DeactivateCardModal from '../components/miscellaneous/DeactivateCardModal';
import TransferMoney from '../components/TransferMoney';

const Mepage = () => {

  const navigate = useNavigate();
  const { user } = UserState();

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken === null) return navigate('/');
    console.log('user', user);

  }, []);

  return (
    <>
      {user &&
        <Container maxW='4xl' centerContent>
          <Banner />

          {/* Content */}
          {/* <Box
            bg={'white'}
            w={'100%'}
            p={'3'}
            borderRadius={'lg'}
            borderWidth={'1px'}
            display={'flex'}
            justifyContent={'space-evenly'}
          > */}
          <Tabs w={'100%'}>
            <TabList>
              <Tab>Summary</Tab>
              <Tab>Transfer money</Tab>
              <Tab>Other actions</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box w={'100%'}>
                  <Profile user={user} />

                  <Box mt={3} display={'flex'} justifyContent={'space-between'}>
                    {user.card_disabled ? <Text as={'i'}>Contact admin for any help</Text> : <DeactivateCardModal user={user} />}
                    <DepositModal />
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box w={'100%'}>
                  <TransferMoney />
                </Box>
              </TabPanel>
              <TabPanel>
                <p>Other actions!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
          {/* Content - Personal In4 */}
          {/* <Box w={'65%'}>
              <Profile user={user} />

              <Box mt={3} display={'flex'} justifyContent={'space-between'}>
                {user.card_disabled ? <Text as={'i'}>Contact admin for any help</Text> : <DeactivateCardModal user={user} />}
                <DepositModal />
              </Box>
            </Box> */}

          {/* Content - Action */}
          {/* <Box w={'25%'}>
              <Text fontSize={'2xl'} textAlign={'center'}>Actions</Text>

            </Box> */}
          {/* </Box> */}
        </Container>

      }
    </>
  )
}

export default Mepage