import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ChartComponent({ sortedTranscations }) {


  const data = sortedTranscations.map((item) => {
    return { date: item.date, amount: item.amount }
    console.log("dataa>>>", data);

  })


  return (
    <div className='charts-wrapper'>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorfulLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8884d8" />
              <stop offset="50%" stopColor="#82ca9d" />
              <stop offset="100%" stopColor="#ffc658" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          {/* <Tooltip /> */}
          {/* <Legend /> */}
          <Line type="monotone" dataKey="amount" stroke="url(#colorfulLine)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ChartComponent;