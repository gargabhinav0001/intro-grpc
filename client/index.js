// make use of REST APIs from client to call gRPC server

const client = require("./client");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  client.GetAll(null, (err, data) => {
    if (!err) {
      res.send(data.customers);
    } else res.send({ message: err });
  });
});

app.get("/:id", (req, res) => {
  console.log("#### request is: ", req);
  console.log("#### response is: ", res);
  client.Get({ id: req.params.id }, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.error("Error calling Get: ", err);
      res.status(500).send({ error: err.message || "An error occurred" });
    }
  });
});
// app.get("/:id", (req, res) => {
//   client.Get({ id: req.params.id }, (err, data) => {
//     if (!err) {
//       res.send(data);
//     } else {
//       console.error("Error calling Get: ", err);
//       res.status(500).send({ error: err.message || "An error occurred" });
//     }
//   });
// });

app.post("/create", (req, res) => {
  client.Insert(req.body, (err, data) => {
    if (!err) {
      res.send(data);
    } else console.error(err);
  });
});

app.post("/:id", (req, res) => {});

app.post("/:id", (req, res) => {});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
