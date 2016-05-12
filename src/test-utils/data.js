import _ from 'lodash';
import cuid from 'cuid';

export const dataGenerator = (config = {}) => {
  const {
    primaryKeys = [
      { name: 'Sex', values: [1, 2, 3] },
      { name: 'Age', values: [1, 2, 3] },
      { name: 'Location', values: [1, 2] },
    ],
    valueKeys = [
      { name: 'mean', range: [100, 200], uncertainty: true },
      { name: 'Population', range: [200, 500], uncertainty: false }
    ],
    year = 2000,
    length = 10
  } = config;

  // Collect primary key values.
  // [
  //   [{k_1:v_1}, {k_1:v_2}, {k_1:v_3}],
  //   [{k_2:v_1}, {k_2:v_2}, {k_2:v_3}],
  //   [{k_3:v_1}, {k_3:v_2}]
  // ]
  const keyStore = _.map(primaryKeys, (k) => {
    return _.map(k.values, (v) => {
      const obj = {};
      obj[k.name] = v;
      return obj;
    });
  });

  // Create unique composite keys.
  // [
  //   {k_1:v_1, k_2:v_1, k_3:v_1},
  //   {k_1:v_2, k_2:v_1, k_3:v_1},
  //   {k_1:v_3, k_2:v_1, k_3:v_1},
  //   {k_1:v_1, k_2:v_2, k_3:v_1},
  //   {k_1:v_2, k_2:v_2, k_3:v_1},
  //   {k_1:v_3, k_2:v_2, k_3:v_1},
  //   {k_1:v_1, k_2:v_3, k_3:v_1},
  //   {k_1:v_2, k_2:v_3, k_3:v_1},
  //   {k_1:v_3, k_2:v_3, k_3:v_1},
  //   {k_1:v_1, k_2:v_1, k_3:v_2},
  //   {k_1:v_2, k_2:v_1, k_3:v_2},
  //   {k_1:v_3, k_2:v_1, k_3:v_2},
  //   {k_1:v_1, k_2:v_2, k_3:v_2},
  //   {k_1:v_2, k_2:v_2, k_3:v_2},
  //   {k_1:v_3, k_2:v_2, k_3:v_2},
  //   {k_1:v_1, k_2:v_3, k_3:v_2},
  //   {k_1:v_2, k_2:v_3, k_3:v_2},
  //   {k_1:v_3, k_2:v_3, k_3:v_2},
  // ]
  let uniqKeys = [{}];
  _.forEach(keyStore, (keyValues) => {
    const sto = [];
    _.forEach(keyValues, (keyObj) => {
      _.forEach(uniqKeys, (rowObj) => {
        sto.push(Object.assign({}, rowObj, keyObj));
      });
    });
    uniqKeys = sto;
  });


  function floor(number) {
    return Math.floor(number * 10) / 10;
  }

  function amp(range) {
    return (range[1] - range[0]) / 2;
  }

  function sAxis(range) {
    return (range[1] + range[0]) / 2;
  }

  function sin(x) {
    return Math.sin(x);
  }

  // Create data for value keys.
  // [
  //   [
  //     {k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
  //     {k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
  //     ...
  //     {k_a:v_18, k_b:v_18, k_c:v_18, k_d:v_18},
  //   ],
  //   [
  //     {k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
  //     {k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
  //     ...
  //     {k_a:v_18, k_b:v_18, k_c:v_18, k_d:v_18},
  //   ],
  //   ...
  //   [
  //     {k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
  //     {k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
  //     ...
  //     {k_a:v_18, k_b:v_18, k_c:v_18, k_d:v_18},
  //   ],
  // ]
  const valueData = [];
  for (let j = 0; j < length; j++) {
    const segment = [];
    for (let i = 0; i < uniqKeys.length; i++) {
      const rowObj = {};
      for (let k = 0; k < valueKeys.length; k++) {
        const valObj = valueKeys[k];
        const obj = {};
        // sinusoidal data generator y=Asin(2x/L+B)+D
        const value = floor(amp(valObj.range) * sin(2 * j / length + k + i) + sAxis(valObj.range));
        obj[valObj.name] = value;
        if (valObj.uncertainty) {
          obj[`${valObj.name}_ub`] = floor(value + amp(valObj.range) / 4);
          obj[`${valObj.name}_lb`] = floor(value - amp(valObj.range) / 4);
        }
        Object.assign(rowObj, obj);
      }
      segment.push(rowObj);
    }
    valueData.push(segment);
  }


  // Populate rows.
  // [
  //   {k_1:v_1, k_2:v_1, k_3:v_1, k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
  //   {k_1:v_2, k_2:v_1, k_3:v_1, k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
  //   ...
  // ]
  const rows = [];
  _.forEach(valueData, (valArr, i) => {
    const yObj = { year_id: year + i };
    _.forEach(valArr, (valRow, j) => {
      const rowObj = { id: cuid() };
      Object.assign(rowObj, valRow, uniqKeys[j], yObj);
      rows.push(rowObj);
    });
  });

  return rows;
};
