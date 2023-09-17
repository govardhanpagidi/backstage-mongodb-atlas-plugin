import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as crypto from 'crypto';
import { useTable } from 'react-table';

const apiKey = '';
const apiPrivateKey = '';
const baseUrl = 'https://cloud.mongodb.com/api/atlas/v1.5/groups/64bad960538ae76ec5c70050/clusters';

class Projects extends React.Component<{ columns: any, data: any }> {
  render() {
    let {columns, data} = this.props;
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({
      columns,
      data,
    });

    return (
      <table {...getTableProps()} style={{border: '1px solid black'}}>
        <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} style={{background: 'gray'}}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} style={{padding: '10px', border: '1px solid black'}}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} style={{background: 'lightgray'}}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()} style={{padding: '10px', border: '1px solid black'}}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }
}

const ProjectList = () => {
  const [tableData, setTableData] = useState([]);
  const columns = [
    {
      Header: 'Name',
      accessor: 'Name', // Replace with your actual field names
    },
    {
      Header: 'Id',
      accessor: 'Id', // Replace with your actual field names
    },
    // Add more columns as needed
  ];

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = '/groups'; // Specify the API endpoint you want to call
      const timestamp = Math.floor(new Date().getTime() / 1000);
      const nonce = crypto.randomBytes(16).toString('hex');
      const message = `${timestamp}${nonce}`;
      const hmac = crypto.createHmac('sha256', apiPrivateKey);
      hmac.update(message);
      const digest = hmac.digest('hex');
      const authHeader = `Digest apiKey="${apiKey}", nonce="${nonce}", digest="${digest}", created="${timestamp}"`;

      try {
        const response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        });
        setTableData(response.data); // Assuming the API response is an array of objects
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>MongoDB Atlas Data</h1>
      <Projects columns={columns} data={tableData} />
    </div>
  );
};

export default ProjectList;
