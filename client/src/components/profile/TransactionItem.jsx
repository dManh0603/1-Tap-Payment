import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'

const TransactionItem = (props) => {
  function convertToGMT7(dateString) {
    const date = new Date(dateString);
    const gmtOffset = 7 * 60 * 60 * 1000; // GMT+7 offset in milliseconds
    const gmt7Date = new Date(date.getTime() + gmtOffset);
    const formattedDate = gmt7Date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'GMT'
    });
    return formattedDate;
  }

  const { transaction } = props;

  return (
    <Box>
      {transaction && transaction.type === 'TRANSFER'
        ? <>
          <Heading size='sm' textTransform='uppercase'>
            You transfer {transaction.amount} VND to {transaction.receiver.name}
          </Heading>
          <Text fontSize='sm'>
            <br />
            Transactions id: {transaction._id}
            <br />
            Method: {transaction.method}
            <br />
            {convertToGMT7(transaction.createdAt)}
          </Text>
        </>
        : <>
          <Heading size='sm' textTransform='uppercase'>
            You deposited {transaction.amount} VND
          </Heading>
          <Text fontSize='sm'>
            <br />
            Transactions id: {transaction._id}
            Method: {transaction.method}
            <br />
            Pay by: {transaction.info.payer_email_address}
            <br />
            Payment id: {transaction.info.payment_id}
            <br />
            {convertToGMT7(transaction.createdAt)}
          </Text>
        </>}

    </Box>
  )
}

export default TransactionItem