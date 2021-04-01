const express = require("express");
const weightHeightStandard = require("./w-h-standard.controller");
const router = express.Router();

router.get("/", weightHeightStandard.getAllStandard);
router.get("/detail", weightHeightStandard.getStandardDetail);

router.post("/new", weightHeightStandard.newStandard);
router.post("/update", weightHeightStandard.updateStandard);
router.post("/delete", weightHeightStandard.deleteStandard);

module.exports = router;
