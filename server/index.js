// gRPC server

const PROTO_PATH = "../Customer.proto";

const grpc = require("@grpc/grpc-js");
const grpcLoader = require("@grpc/proto-loader");

const packageDefinition = grpcLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  enums: String,
  long: String,
  arrays: true,
});

const customerProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const customers = [
  {
    id: "C001",
    name: "Alice Johnson",
    age: 30,
    address: "123 Maple Street, Springfield, IL",
  },
  {
    id: "C002",
    name: "Bob Smith",
    age: 25,
    address: "456 Oak Avenue, Metropolis, NY",
  },
  {
    id: "C003",
    name: "Charlie Brown",
    age: 35,
    address: "789 Pine Road, Gotham City, NJ",
  },
  {
    id: "C004",
    name: "Diana Prince",
    age: 28,
    address: "101 Elm Street, Themyscira, WA",
  },
  {
    id: "C005",
    name: "Edward Elric",
    age: 22,
    address: "202 Birch Lane, Central City, CA",
  },
];

const tempCustomer = {
  id: "12",
  name: "zyv",
  age: 29,
  address: "UK",
};

server.addService(customerProto.CustomerService.service, {
  GetAll: (call, callback) => {
    callback(null, { customers });
  },
  Get: (call, callback) => {
    console.log("#### Server received request:", call.request);
    const customer = customers.find(
      (customer) => customer.id === call.request.id
    );
    if (customer) {
      callback(null, customer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Requested data is not available",
      });
    }
  },
  Insert: (call, callback) => {
    const { name, age, address } = call.request;
    customers.push({
      id: (customers.length + 1).toString(),
      name,
      age,
      address,
    });
    callback(null, {
      code: grpc.status.OK,
      details: "Details added",
    });
  },
  Update: (call, callback) => {
    const { id, name, age, address } = call.request;
    const { index } = customers.indexOf((customer) => customer.id === id);
    customers[index] = {
      id,
      name,
      age,
      address,
    };

    callback(null, {
      code: grpc.status.OK,
      details: "Details updated",
    });
  },
  Remove: (call, callback) => {
    const idExist = customers.find(
      (customer) => customer.id === call.request.id
    );

    if (!idExist) {
      callback({
        code: grpc.status.UNAVAILABLE,
        details: "Identified wrong ID",
      });
    } else {
      customers.splice(idExist, 1);

      callback(null, {
        code: grpc.status.OK,
        details: "Data removed",
      });
    }
  },
});

server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (!err) {
      server.start();
    }
  }
);
