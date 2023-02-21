import React, { useState, useEffect } from 'react';

// Load helpers.
import CSVtoJSON from './helpers/CSVtoJSON.js';
import ChartBarLine from './components/ChartBarLine.jsx';

import '../styles/styles.less';

function Figure1() {
  // Data states.
  const [dataFigure, setDataFigure] = useState(false);

  const cleanData = (data) => data.map((el, i) => {
    const labels = Object.keys(el).filter(val => val !== 'Name').map(val => Date.UTC(parseInt(val, 10), 0, 1));
    const values = Object.values(el).map(val => (parseFloat(val))).filter(val => !Number.isNaN(val));

    return ({
      data: values.map((e, j) => ({
        x: labels[j],
        y: e
      })),
      name: el.Name,
      type: (i === 0) ? 'column' : 'line',
      zoneAxis: 'x',
      zones: [{
        value: Date.UTC(parseInt(2022, 10), 0, 1)
      }, {
        color: (i === 0) ? 'rgba(0, 158, 219, 0.4)' : '#009edb'
      }],
      yAxis: i
    });
  });

  useEffect(() => {
    const data_file = `${(window.location.href.includes('unctad.org')) ? 'https://storage.unctad.org/2023-ldc5/' : './'}assets/data/2023-ldc5_figure_1.csv`;
    try {
      fetch(data_file)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(body => setDataFigure(cleanData(CSVtoJSON(body))));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="app">
      {dataFigure && (
      <ChartBarLine
        idx="1"
        data={dataFigure}
        note="The data reflects the current list of 46 Least Developed Countries; figures for 2022 and 2023 are preliminary."
        source="International Debt Statistics database"
        subtitle="Debt service on external debt, total (Billion US$) and Total debt service (% of exports of goods, services and primary income)"
        suffix=""
        title="Soaring debt burden jeopardizes recovery of least developed countries"
        ylabel=""
      />
      )}
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default Figure1;
