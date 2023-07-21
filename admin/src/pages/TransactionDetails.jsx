import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { formatAmount, formatDate } from '../helpers/ViewHelper';
import axios from 'axios';
import { Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text } from '@chakra-ui/react';

const TransactionDetails = () => {

  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
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
        setTransaction(data);
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
                      Payer information
                    </Heading>
                    <Text pt='2' fontSize='md'>
                      User name: {transaction.created_by.name}
                    </Text>
                    <Text pt='2' fontSize='md'>
                      User email: {transaction.created_by.email}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size='md' textTransform='uppercase'>
                      Transaction information
                    </Heading>
                    <Text pt='2' fontSize='md'>
                      App transaction id: {transaction.app_trans_id}
                    </Text>
                    <Text pt='2' fontSize='md'>
                      Zalopay transaction id: {transaction.zp_trans_id}
                    </Text>
                    <Text pt='2' fontSize='md'>
                      Type: {transaction.type}
                    </Text>
                    <Text pt='2' fontSize='md'>
                      Status: {transaction.status}
                    </Text>
                    <Text pt='2' fontSize='md'>
                      Amount: {formatAmount(transaction.amount)} VND
                    </Text>
                    <Text pt='2' fontSize='md'>
                      Happened at: {formatDate(transaction.createdAt)}
                    </Text>
                    <Text pt='2' fontSize='md'>
                      Receiver name: {transaction.receiver.name}
                    </Text>
                    <Text pt='2' fontSize='md'>
                      Receiver email: {transaction.receiver.email}
                    </Text>
                  </Box>
                  <Box></Box>
                </Stack>
              </CardBody>
            </Card>
          </div>
        )
      }
    </>
  )
}

export default TransactionDetails