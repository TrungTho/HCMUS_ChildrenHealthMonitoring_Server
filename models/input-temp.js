const weightHeightStandardModel = require("./weight-height-standard.model");

module.exports = async function (app) {
  a = [
    // "13 72.1 76.9 81.8",
    // "14 73.1 78.0 83.0",
    // "15 74.1 79.1 84.2",
    // "16 75.0 80.2 85.4",
    // "17 76.0 81.2 86.5",
    // "18 76.9 82.3 87.7",
    // "19 77.7 83.2 88.8",
    // "20 78.6 84.2 89.8",
    // "21 79.4 85.1 90.9",
    // "22 80.2 86.0 91.9",
    // "23 81.0 86.9 92.9",
    // "24 81.7 87.8 93.9",
    // "24 81.0 87.1 93.2",
    // "25 81.7 88.0 94.2",
    // "26 82.5 88.8 95.2",
    // "27 83.1 89.6 96.1",
    // "28 83.8 90.4 97.0",
    // "29 84.5 91.2 97.9",
    // "30 85.1 91.9 98.7",
    // "31 85.7 92.7 99.6",
    // "32 86.4 93.4 100.4",
    // "33 86.9 94.1 101.2",
    // "34 87.5 94.8 102.0",
    // "35 88.1 95.4 102.7",
    // "36 88.7 96.1 103.5",
    // "37 89.2 96.7 104.2",
    // "38 89.8 97.4 105.0",
    // "39 90.3 98.0 105.7",
    // "40 90.9 98.6 106.4",
    // "41 91.4 99.2 107.1",
    // "42 91.9 99.9 107.8",
    // "43 92.4 100.4 108.5",
    // "44 93.0 101.0 109.1",
    // "45 93.5 101.6 109.8",
    // "46 94.0 102.2 110.4",
    // "47 94.4 102.8 111.1",
    // "48 94.9 103.3 111.7",
    // "49 95.4 103.9 112.4",
    // "50 95.9 104.4 113.0",
    // "51 96.4 105.0 113.6",
    // "52 96.9 105.6 114.2",
    // "53 97.4 106.1 114.9",
    // "54 97.8 106.7 115.5",
    // "55 98.3 107.2 116.1",
    // "56 98.8 107.8 116.7",
    // "57 99.3 108.3 117.4",
    // "58 99.7 108.9 118.0",
    // "59 100.2 109.4 118.6",
    // "60 100.7 110.0 119.2",
  ];
  // console.log(a);
  for (let item of a) {
    let str = item.split(" ");
    const obj = {
      month: parseInt(str[0]),
      gender: 0,
      type: "h",
      lower_point: parseFloat(str[1]),
      upper_point: parseFloat(str[3]),
      average_point: parseFloat(str[2]),
    };
    // await weightHeightStandardModel.add(obj);
    // console.log("ok " + obj.month);
    // console.log(str);
    // console.log(JSON.stringify(obj));
  }
};
