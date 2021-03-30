const express = require("express");
const vaccineController = require("./vaccine.controller");
const router = express.Router();

router.get("/inoculate", vaccineController.getAllInoculate);
router.get("/vaccine", vaccineController.getAllVaccine);

router.get("/inoculate/detail", vaccineController.getInoculateDetail);
router.get("/vaccine/detail", vaccineController.getVaccineDetail);

router.post("/new-inoculate", vaccineController.newInoculate);
router.post("/new-vaccine", vaccineController.newVaccine);

router.post("/update-inoculate", vaccineController.updateInoculate);
router.post("/update-vaccine", vaccineController.updateVaccine);

router.post("/delete-inoculate", vaccineController.deleteInoculate);
router.post("/delete-vaccine", vaccineController.deleteVaccine);

module.exports = router;
