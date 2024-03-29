const diaryWeightHeightModel = require("../../../models/diary-weight-height.model");
const weightHeightStandardModel = require("../../../models/weight-height-standard.model");
const moment = require("moment");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");
const diaryModel = require("../../../models/diary.model");

const monthDiff = function (d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

module.exports = weightHeightDiaryController = {
  deleteEvent: async function (req, res) {
    try {
      await diaryWeightHeightModel.setDelete(req.body.id);
      res.send({ success: true });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllEvent: async function (req, res) {
    try {
      const data = await diaryWeightHeightModel.getAllByDiaryId(req.query.id);

      //sort data by date descending
      data.sort(utilFuncs.compareAsc);

      //for warning feature
      const diaryInfo = await diaryModel.getSingle(req.query.id);
      // console.log(diaryInfo);
      const weightStandards = await utilFuncs.getStandard(
        "w",
        diaryInfo.gender
      );

      // console.log(weightStandards);
      const heightStandards = await utilFuncs.getStandard(
        "h",
        diaryInfo.gender
      );

      //format log_date for client's usage
      data.forEach((element) => {
        let monthAge = monthDiff(diaryInfo.dob, element.log_date);
        console.log(monthAge);
        element.log_date = moment(element.log_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );

        //for warning feature
        let wState = 0;
        let hState = 0;
        if (weightStandards[monthAge]) {
          if (element.weight < weightStandards[monthAge].lower_point) {
            wState = -1;
          } else if (element.weight > weightStandards[monthAge].upper_point) {
            wState = 1;
          }
        }

        if (heightStandards[monthAge]) {
          if (element.height < heightStandards[monthAge].lower_point) {
            hState = -1;
          } else if (element.height > heightStandards[monthAge].upper_point) {
            hState = 1;
          }
        }

        element.warning = [wState, hState];
        // console.log(monthAge, element.warning);
      });

      //send data to client
      res.send({
        success: true,
        events: data,
      });
    } catch (error) {
      console.log(error);
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getEventDetail: async function (req, res) {
    try {
      const datum = await diaryWeightHeightModel.getSingle(req.body.id);

      //format log_date for client's usage
      datum.log_date = moment(datum.log_date, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );

      //send datum to client
      res.send({ success: true, eventInfor: datum });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getStandardParam: async function (req, res) {
    try {
      const data = await weightHeightStandardModel.getAllByOption(
        req.query.type,
        req.query.gender
      );

      //send data to client
      res.send({ success: true, standardParams: data });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getGraphData: async function (req, res) {
    try {
      const diaryInfo = await diaryModel.getSingle(req.query.id);
      // console.log(diaryInfo);

      if (diaryInfo) {
        //get diary's events
        const events = await diaryWeightHeightModel.getAllByDiaryId(
          req.query.id
        );
        const monthAge = monthDiff(diaryInfo.dob, new Date()) + 1;

        let diaryWeights = {};
        let diaryHeights = {};
        for (let item of events) {
          let monthAge = monthDiff(
            new Date(diaryInfo.dob),
            new Date(item.log_date)
          );
          // console.log("--------------------------");
          // // console.log(new Date());
          // console.log(diaryInfo.dob);
          // console.log(item.log_date);
          // console.log(monthAge);
          // console.log("--------------------------");
          diaryWeights[monthAge] = item.weight;
          diaryHeights[monthAge] = item.height;
        }

        //get standards
        const weightStandards = await weightHeightStandardModel.getAllByOption(
          "w",
          diaryInfo.gender,
          monthAge
        );

        const heightStandards = await weightHeightStandardModel.getAllByOption(
          "h",
          diaryInfo.gender,
          monthAge
        );

        let weightData = [];
        let heightData = [];

        for (let item of weightStandards) {
          let datum = {
            month: item.month,
            average_point: item.average_point,
            std_area: [item.lower_point, item.upper_point],
            real_value: diaryWeights[item.month],
          };

          weightData.push(datum);
        }

        for (let item of heightStandards) {
          let datum = {
            month: item.month,
            average_point: item.average_point,
            std_area: [item.lower_point, item.upper_point],
            real_value: diaryHeights[item.month],
          };

          heightData.push(datum);
        }

        //send data to client
        res.send({
          success: true,
          weightData,
          heightData,
          // diaryHeights,
          // diaryWeights,
        });
      } else {
        console.log("invalid id_diary");
        res
          .status(406)
          .send({ success: false, err_message: "invalid id_diary" });
        return;
      }
    } catch (error) {
      console.log(error);
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  newEvent: async function (req, res) {
    try {
      //call global function to upload image and return url if existed
      const uploadResponse = await utilFuncs.uploadImage(
        req,
        process.env.CLOUD_DIARY_WEIGHT_HEIGHT_PRESET
      );

      //create new event according to user input
      const newEvent = {
        id_diary: req.query.id, //id of log in account
        weight: req.body.weight,
        height: req.body.height,
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        image: uploadResponse.url,
        isDel: 0,
      };

      //add new diary to db
      const ret = await diaryWeightHeightModel.add(newEvent);

      //for warning feature
      const diaryInfo = await diaryModel.getSingle(req.query.id);
      let monthAge = monthDiff(diaryInfo.dob, new Date(newEvent.log_date));

      const datum = await diaryWeightHeightModel.getSingle(ret.insertId);
      datum.log_date = moment(datum.log_date, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );

      // console.log(diaryInfo);
      const weightStandards = await utilFuncs.getStandard(
        "w",
        diaryInfo.gender
      );

      // console.log(weightStandards);
      const heightStandards = await utilFuncs.getStandard(
        "h",
        diaryInfo.gender
      );

      let wState = 0;
      let hState = 0;
      if (weightStandards[monthAge] && newEvent.weight) {
        if (newEvent.weight < weightStandards[monthAge].lower_point) {
          wState = -1;
        } else if (newEvent.weight > weightStandards[monthAge].upper_point) {
          wState = 1;
        }
      }

      if (heightStandards[monthAge] && newEvent.height) {
        if (newEvent.height < heightStandards[monthAge].lower_point) {
          hState = -1;
        } else if (newEvent.height > heightStandards[monthAge].upper_point) {
          hState = 1;
        }
      }

      datum.warning = [wState, hState];

      //send success message to client
      res.send({ success: true, eventInfor: datum });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  updateEvent: async function (req, res) {
    try {
      //create new event according to user input
      const updatedEvent = {
        id: req.body.id, //id of event
        weight: req.body.weight,
        height: req.body.height,
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        id_diary: req.query.id, //id of log in account
      };

      //check if user want to change images or not
      if (req.body.isImageChange === "true") {
        const uploadResponse = await utilFuncs.uploadImage(
          req,
          process.env.CLOUD_DIARY_WEIGHT_HEIGHT_PRESET
        );

        updatedEvent.image = uploadResponse.url;
      }

      //add new diary to db
      await diaryWeightHeightModel.update(updatedEvent);

      //get just updated datum in db to send to client
      const datum = await diaryWeightHeightModel.getSingle(req.body.id);

      //for warning feature
      const diaryInfo = await diaryModel.getSingle(req.query.id);
      let monthAge = monthDiff(diaryInfo.dob, new Date(updatedEvent.log_date));
      console.log(monthAge);

      //format log_date for client's usage
      datum.log_date = moment(datum.log_date, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );

      // console.log(diaryInfo);
      const weightStandards = await utilFuncs.getStandard(
        "w",
        diaryInfo.gender
      );

      // console.log(weightStandards);
      const heightStandards = await utilFuncs.getStandard(
        "h",
        diaryInfo.gender
      );

      let wState = 0;
      let hState = 0;
      if (weightStandards[monthAge] && updatedEvent.weight) {
        if (updatedEvent.weight < weightStandards[monthAge].lower_point) {
          wState = -1;
        } else if (
          updatedEvent.weight > weightStandards[monthAge].upper_point
        ) {
          wState = 1;
        }
      }

      if (heightStandards[monthAge] && updatedEvent.height) {
        if (updatedEvent.height < heightStandards[monthAge].lower_point) {
          hState = -1;
        } else if (
          updatedEvent.height > heightStandards[monthAge].upper_point
        ) {
          hState = 1;
        }
      }

      datum.warning = [wState, hState];

      //send success message to client
      res.send({ success: true, eventInfor: datum });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  template: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },
};
