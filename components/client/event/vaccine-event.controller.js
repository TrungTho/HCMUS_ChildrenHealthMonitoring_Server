const diaryVaccineModel = require("../../../models/diary-vaccine.model");
const diaryModel = require("../../../models/diary.model");
const userModel = require("../../../models/user.model");
const moment = require("moment");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");
const inoculateModel = require("../../../models/inoculate.model");
const vaccineModel = require("../../../models/vaccine.model");
const axios = require("axios").default;

module.exports = vaccineDiaryController = {
  deleteEvent: async function (req, res) {
    try {
      await diaryVaccineModel.setDelete(req.body.id);
      res.send({ success: true });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllEvent: async function (req, res) {
    try {
      const data = await diaryVaccineModel.getAllByDiaryId(req.query.id);

      //sort data by date descending
      data.sort(utilFuncs.compareDesc);

      //format log_date for client's usage
      data.forEach((element) => {
        element.log_date = moment(element.log_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );
      });

      //send data to client
      res.send({ success: true, events: data });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllVaccine: async function (req, res) {
    try {
      const data = await inoculateModel.getAllVaccine();
      res.send({ success: true, vaccines: data });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllVaccineName: async function (req, res) {
    try {
      const data = await vaccineModel.getAllVaccineName();
      res.send({ success: true, vaccines: data });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getVaccineAllocation: async function (req, res) {
    try {
      //get data depends on vaccine name
      const data = await vaccineModel.getAllocationByVaccineName(
        req.query.vaccineName
      );
      //split data to separate string
      allocations = data.split(", ");
      res.send({ success: true, allocations });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getEventDetail: async function (req, res) {
    try {
      const data = await diaryVaccineModel.getSingle(req.body.id);

      //format log_date for client's usage
      data.log_date = moment(data.log_date, "YYYY-MM-DD").format("DD/MM/YYYY");
      data.vaccine = data.vaccine.split(", ");
      data.vaccineName = data.vaccineName.split(", ");

      //send data to client
      res.send({ success: true, eventInfor: data });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getInjectionOverview: async function (req, res) {
    try {
      //get all which the baby has to injected
      const inoculates = await inoculateModel.getVaccineAmount();
      let resData = {};
      for (let item of inoculates) {
        resData[item.vaccine.trim()] = {
          totalAmount: item.amount,
          injectedTime: 0,
          injections: [],
        };
      }
      // console.log(resData);
      // //get all vaccine data that system has
      // const vaccines = await vaccineModel.getAll();
      // //change data from array to obj to access in O(n) complexity
      // let vaccinesObject = {};
      // for (let item of vaccines) {
      //   vaccinesObject[item.vaccineName] = item.allocate;
      // }

      //get all vaccine event of this diary
      const events = await diaryVaccineModel.getAllByDiaryId(req.query.id);

      for (let item of events) {
        let arrAllocations = item.vaccine.split(",");
        for (let allocation of arrAllocations) {
          // console.log(allocation.trim());
          if (resData[allocation.trim()]) {
            resData[allocation.trim()].injectedTime++;
            resData[allocation.trim()].injections.push({
              eventId: item.id,
              vaccineName: item.vaccineName,
              date: item.log_date,
            });
          }
        }
      }

      //send data to client
      res.send({ success: true, data: resData });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  newEvent: async function (req, res) {
    try {
      //call global function to upload image and return url if existed
      const uploadResponse = await utilFuncs.uploadImage(
        req,
        process.env.CLOUD_DIARY_VACCINE_TRACK_PRESET
      );

      // console.log(req.body);

      //create new event according to user input
      const newEvent = {
        id_diary: req.query.id,
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        image: uploadResponse.url,
        vaccine: JSON.parse(req.body.vaccine).join(", "),
        vaccineName: JSON.parse(req.body.vaccineName).join(", "),
        doctor: req.body.doctor,
        isDel: 0,
        isRemind: req.body.isRemind === "true" ? 1 : 0,
        remindDate: new Date(req.body.remindDate),
        isScheduled: false,
      };

      //add new diary to db
      const ret = await diaryVaccineModel.add(newEvent);

      //check if custom reminder true/false => create task to send reminder
      if (req.body.isRemind === "true") {
        console.log("remind=true");
        //check reminder's date is current date or not
        //if true => add to array task
        //if not => just add data to db and it will be processed later by mail server
        const curDate = new Date();
        const inputDate = new Date(req.body.remindDate);

        console.log(
          inputDate +
            "==>" +
            inputDate.getHours() +
            ":" +
            inputDate.getMinutes() +
            ":" +
            inputDate.getSeconds()
        );
        // console.log(curDate.toDateString(), inputDate.toDateString());

        if (curDate.toDateString() === inputDate.toDateString()) {
          console.log("--------custom reminder-------");
          //prepare contents for task in mail server
          const diaryInfor = await diaryModel.getSingle(req.query.id);
          const userInfor = await userModel.getSingle(diaryInfor.id_user);

          const contents = {
            clientFullname: userInfor.fullname,
            clientEmail: userInfor.email,
            diaryName: diaryInfor.fullname,
            emailContents:
              "<p><strong>" +
              1 +
              ". Vaccine " +
              JSON.parse(req.body.vaccineName).join(", ") +
              "</strong>" +
              " (Ngừa các bệnh: " +
              JSON.parse(req.body.vaccine).join(", ") +
              ") </p>",
          };

          // console.log("contents", contents);

          //call API from mail server to add new task
          await axios({
            method: "post",
            url:
              process.env.MAIL_SERVER +
              "/vaccine-notification-mail/new-custom-task",
            withCredentials: true,

            data: {
              eventId: ret.insertId,

              timeString: `${inputDate.getSeconds()} ${inputDate.getMinutes()} ${inputDate.getHours()} * * *`,

              contents,
            },
          })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log("error", error);
              res.status(406).send({ success: false, err_message: error });
              return;
            });
        }
      }

      //get full datum back from db to check add successfully
      const datum = await diaryVaccineModel.getSingle(ret.insertId);
      datum.log_date = moment(datum.log_date, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );

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
        id_diary: req.query.id, //id of log in account
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        vaccine: JSON.parse(req.body.vaccine).join(", "),
        vaccineName: JSON.parse(req.body.vaccineName).join(", "),
        doctor: req.body.doctor,
        isRemind: req.body.isRemind === "true" ? 1 : 0,
        remindDate: new Date(req.body.remindDate),
        isScheduled: false,
      };

      //get current event's data to compare later
      const oldEventData = await diaryVaccineModel.getSingle(req.body.id);

      //check if user want to change images or not
      if (req.body.isImageChange === "true") {
        const uploadResponse = await utilFuncs.uploadImage(
          req,
          process.env.CLOUD_DIARY_VACCINE_TRACK_PRESET
        );

        updatedEvent.image = uploadResponse.url;
      }

      //add new diary to db
      await diaryVaccineModel.update(updatedEvent);

      //check if isRemind change or not?
      if (req.body.isReminderChange === "true") {
        //check if custom reminder true/false
        //if true => update task to send reminder
        //if false => find & stop task in array task in mail server
        if (req.body.isRemind === "true") {
          // console.log("remind=true");
          //check reminder's date is current date or not
          //if true => find & update task in array task
          //if not => find & stop task in array task (if existed)
          const curDate = new Date();
          const inputDate = new Date(req.body.remindDate);

          console.log(curDate.toDateString(), inputDate.toDateString());

          //check if remind date is today????
          if (curDate.toDateString() === inputDate.toDateString()) {
            //call API from mail server to add new task
            console.log("--------update custom reminder-------");

            const diaryInfor = await diaryModel.getSingle(req.query.id);
            const userInfor = await userModel.getSingle(diaryInfor.id_user);

            const contents = {
              clientFullname: userInfor.fullname,
              clientEmail: userInfor.email,
              diaryName: diaryInfor.fullname,
              emailContents:
                "<p><strong>" +
                1 +
                ". Vaccine " +
                JSON.parse(req.body.vaccineName).join(", ") +
                "</strong>" +
                " (Ngừa các bệnh: " +
                JSON.parse(req.body.vaccine).join(", ") +
                ") </p>",
            };

            console.log("contents", contents);

            //call mail server to update task in arrTask (if exist)
            await axios({
              method: "post",
              url:
                process.env.MAIL_SERVER +
                "/vaccine-notification-mail/update-custom-task",
              withCredentials: true,

              data: {
                eventId: req.body.id,

                timeString: `${inputDate.getSeconds()} ${inputDate.getMinutes()} ${inputDate.getHours()} * * *`,

                contents,
              },
            })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log("error", error);
                return res.status(406).send({
                  success: false,
                  err_message:
                    "error in when call mail server to update task!!!'",
                });
              });
          } else {
            console.log(
              "remind=true & not today => find & stop & destroy task"
            );
            //call mail sever api to stop task with eventId=req.body.id
            await axios({
              method: "post",
              url:
                process.env.MAIL_SERVER +
                "/vaccine-notification-mail/destroy-custom-task",
              withCredentials: true,

              data: {
                eventId: req.body.id,
              },
            })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log("error", error);
                return res.status(406).send({
                  success: false,
                  err_message:
                    "error when call mail server to stop & destroy task",
                });
              });
          }
        } else {
          //if user change event from remind = true => remind = true
          console.log("remind=false => find & stop task");
          //call mail sever api to stop task with eventId=req.body.id
          await axios({
            method: "post",
            url:
              process.env.MAIL_SERVER +
              "/vaccine-notification-mail/stop-custom-task",
            withCredentials: true,

            data: {
              eventId: req.body.id,
            },
          })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log("error", error);
              return res.status(406).send({
                success: false,
                err_message: "error when call mail server to stop task",
              });
            });
        }
      }

      //get just updated datum in db to send to client
      const datum = await diaryVaccineModel.getSingle(req.body.id);

      //format log_date for client's usage
      datum.log_date = moment(datum.log_date, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );

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
