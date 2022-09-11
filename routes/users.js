const express = require("express");
const router = express.Router();

router
  .route("/:id")
  .get((req, res) => {})
  .post((req, res) => {})
  .put((req, res) => {})
  .delete((req, res) => {});

router.get("/", (request, response) => {
  response.send("User List");
});

router.get("/new", (request, response) => {
  response.send("User New Form");
});

router.post("/", (request, respsonse) => {
  response.send("Create User");
});

router.get("/:id/:message", (request, response) => {
  const { id, message } = request.params;
  response.send(`Crazy User ID: ${id + 99} and stupid message: ${message}`);
});

router.param("id", (req, res, next, id) => {
  console.log(id);
});

module.exports = router;
