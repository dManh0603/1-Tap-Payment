import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Box, Spinner } from '@chakra-ui/react'
import { formatDate } from '../helpers/ViewHelper';
import { DataTable } from 'simple-datatables';
import { useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet'

const Activities = () => {
  const [userActivities, setUserActivities] = useState([]);
  const storedToken = localStorage.getItem('userToken');
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!storedToken) return navigate('/')

    const fetchUserActivities = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };
      try {
        const { data } = await axios.get('/api/admin/activity', config);
        setUserActivities(data);
        console.log(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserActivities();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const table = new DataTable(tableRef.current, {
        // Configure the options for the table here
      });
      // Custom search bar styles
      const searchInput = tableRef.current.querySelector('.dataTables_filter input');
      if (searchInput) {
        searchInput.style.border = '1px solid black';
      }

      return () => {
        table.destroy();
      };
    }
  }, [isLoading]);

  return (
    <>
      <Helmet>
        <link href="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/style.min.css" rel="stylesheet" />
      </Helmet>
      {isLoading && userActivities
        ?
        <div className='w-100'>
          <Box pt={'40vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </Box>
        </div>
        :
        <div id="content-wrapper" className="d-flex flex-column">
          <div className="container-fluid px-4">
            <h1 className="h3 mb-0 text-gray-800">Total traffic</h1>
            <div className="card mb-4">
              <div className="card-body">
                <table id="datatablesSimple" ref={tableRef}>
                  <thead>
                    <tr>
                      <th>Actions</th>
                      <th>Message</th>
                      <th>Pay</th>
                      <th>Vehicle</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActivities.map((a) => (
                      <tr key={a._id}>
                        <td>
                          <a href={`/user/${a.userId}`}>
                            <i className="fas fa-eye"></i>
                          </a>
                        </td>
                        <td>{a.message}</td>
                        <td>{a.amount} VND</td>
                        <td>{a.type}</td>
                        <td>{formatDate(a.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Activities;
