// src/pages/Table.tsx

import React, { useEffect, useState } from 'react';
import { makeFetchRequest } from '../fetchConfig';

interface LogData {
  logName: string;
  timestamp: string;
}

export const Table = () => {
  const [data, setData] = useState<LogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const id = 123; // Replace with the actual id you need

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await makeFetchRequest(`/api/v1/data?id=${id}`, {
          method: 'GET',
        });
        setData(result);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Log Data</h1>
      <table>
        <thead>
          <tr>
            <th>Log Name</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((log, index) => (
            <tr key={index}>
              <td>{log.logName}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

