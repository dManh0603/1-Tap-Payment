import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { formatDate } from '../helpers/ViewHelper';
import axios from 'axios';
import { Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text } from '@chakra-ui/react';

const TransactionDetails = () => {

  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [user, setUser] = useState(null);
  const storedToken = localStorage.getItem('userToken')

  useEffect(() => {
    const fetchTransaction = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };
      const { data } = await axios.get(`/api/admin/transaction/${id}`, config);
      console.log(data);
      if (data) {
        setTransaction(data.transaction);
        setUser(data.user);
      }
    }
    fetchTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {
        transaction && (
          <div className="d-flex justify-content-center w-100">
            <Card w={'100%'}>
              <CardHeader>
                <Heading size='lg'>Transaction #{transaction._id}</Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                  <Box>
                    <Heading size='md' textTransform='uppercase'>
                      User information
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                      User name: {user && user.name}
                    </Text>
                    <Text pt='2' fontSize='sm'>
                      User email: {user && user.email}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size='md' textTransform='uppercase'>
                      Transaction information
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                      Status: {transaction.PP_info.status}
                    </Text>
                    <Text pt='2' fontSize='sm'>
                      Amount: {transaction.amount}
                    </Text>
                    <Text pt='2' fontSize='sm'>
                      Pay at: {formatDate(transaction.createdAt)}
                    </Text>
                    <Text pt='2' fontSize='sm'>
                      Payment id: {transaction.PP_info.payment_id}
                    </Text>
                    <Text pt='2' fontSize='sm'>
                      Payer email: {transaction.PP_info.payer_email_address}
                    </Text>
                  </Box>
                  <Box></Box>
                </Stack>
              </CardBody>
            </Card>
          </div>

          // <div className="d-flex justify-content-center align-items-center">
          //   <div className="container mt-0">
          //     <div className="row g-5 w-100">
          //       <div className="row col-12 col-lg-8 ">
          //         <h2 className="text-center m-3">Transaction {transaction._id}</h2>
          //       </div>
          //       <div className="row col-lg-4 ">
          //         <div className="card border-0">
          //           <div className="card-header border-0">
          //             <h4 className="mt-1" style={{ color: 'black'}}>User information</h4>
          //           </div>
          //           <div className="card-body border-0">
          //             <p className="card-text">
          //               Email: {user && user.email}

          //             </p>
          //             <p className="card-text">
          //               Name: {user && user.name}
          //             </p>
          //           </div>
          //         </div>

          //         <div className="card border-0">
          //           <div className="card-header border-0">
          //             <h4 className="mt-1" style={{ color: 'black'}}>Transaction information</h4>
          //           </div>
          //           <div className="card-body border-0">
          //             <p className="card-text">
          //               Status: {transaction.PP_info.status}
          //             </p>
          //             <p className="card-text">
          //               Amount: {transaction.amount}
          //             </p>
          //             <p className="card-text">
          //               Pay at: {formatDate(transaction.createdAt)}
          //             </p>
          //             <p className="card-text">
          //               Payment id: {transaction.PP_info.payment_id}
          //             </p>
          //             <p className="card-text">
          //               Payer email: {transaction.PP_info.payer_email_address}
          //             </p>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </div>
        )
      }

    </>
  )
}

export default TransactionDetails