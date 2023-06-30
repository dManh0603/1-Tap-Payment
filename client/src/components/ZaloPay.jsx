import { Box } from '@chakra-ui/react'
import React from 'react'
import Helmet from 'react-helmet'
import { Button } from '@chakra-ui/react'
import axios from 'axios'

const ZaloPay = ({ amount }) => {

  const userToken = localStorage.getItem('userToken');

  const handleClick = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
      const body = {
        amount
      }

      const { data } = await axios.post('/api/zalopay/create', body, config)
      // Open a new tab with the order URL
      window.open(data.order_url, '_blank');
    } catch (error) {
      console.log(error)
    } finally {
      console.log("end of request")
    }

  }

  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/blue.css" />
      </Helmet>
      <Box >
        <p>Vui lòng chọn hình thức thanh toán:</p>
        <div className="mb-1">
          <label><input type="radio" name="iCheck" className="iradio_flat-blue" /> Ví <img src="/images/logo-zalopay.svg" alt="" style={{ display: "inline" }} /></label>
        </div>
        <div className="mb-1">
          <label><input type="radio" name="iCheck" className="iradio_flat-blue" /> Visa, Mastercard, JCB <span className="txtGray">(qua cổng ZaloPay)</span></label>
        </div>
        <div className="mb-1">
          <label><input type="radio" name="iCheck" className="iradio_flat-blue" defaultChecked /> Thẻ ATM <span className="txtGray">(qua cổng ZaloPay)</span></label>
        </div>
        <Button colorScheme='blue' mb={3} onClick={handleClick}>Tiếp tục với ZaloPay</Button>
      </Box>
    </>
  )
}

export default ZaloPay