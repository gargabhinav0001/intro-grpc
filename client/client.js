const PROTO_PATH = "../Customer.proto";

const grpc = require("@grpc/grpc-js");
const grpcLoader = require("@grpc/proto-loader");

const packageDefinition = grpcLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  enums: String,
  long: String,
  arrays: true,
});

const customerService =
  grpc.loadPackageDefinition(packageDefinition).CustomerService;

const client = new customerService(
  "127.0.0.1:30043",
  grpc.credentials.createInsecure()
);

module.exports = client;
