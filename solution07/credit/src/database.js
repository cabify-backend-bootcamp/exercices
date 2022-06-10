import mongoose from "mongoose";
import urls from "./urls.js";

const database = "cabify_bootcamp";

function createConnection(name, server, database) {
  return {
    name,
    isPrimary: false,
    isActive: true,
    conn: mongoose.createConnection(`mongodb://${server}/${database}`, {
      useNewUrlParser: true,
      autoReconnect: true
    })
  };
}

function setupConnection(connection, backup) {
  connection.conn.on("disconnected", () => {
    console.log("Node down:", connection.name);
    connection.isActive = false;
    if (connection.isPrimary) {
      connection.isPrimary = false;
      backup.isPrimary = backup.isActive;
    }
  });
  connection.conn.on("reconnected", () => {
    console.log("Node up:", connection.name);
    connection.isActive = true;
    connection.isPrimary = !backup.isPrimary;
  });
}

const connections = [
  createConnection("PRIMARY", urls.MONGODB_URL, database),
  createConnection("REPLICA", urls.REPLICA_URL, database)
];

connections[0].isPrimary = true;
setupConnection(connections[0], connections[1]);
setupConnection(connections[1], connections[0]);

export default {
  get(dbKey) {
    let conn;
    if (dbKey === undefined || dbKey === "primary") {
      conn = connections.find(connection => connection.isPrimary == true);
    } else if (dbKey === "replica") {
      conn = connections.find(connection => connection.isPrimary == false);
    }
    if (conn) {
      console.log("Requested connection:", dbKey);
      console.log("Found:", conn.name);
    }
    return conn.conn;
  },

  isReplicaOn() {
    replicaOn = connections[0].isActive && connections[1].isActive;
    console.log(`Replica is ${replicaOn ? "ON" : "OFF"}`);
    return replicaOn;
  }
};
