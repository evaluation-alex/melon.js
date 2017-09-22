import setup from "./setup";

const trace = ({ message, category = "trace", data }) => {
  const newTrace = { timestamp: new Date(), message, category, data };
  setup.tracer(newTrace);
};

const overloading = (...args) => {
  if (typeof args[0] === "string") {
    const [message, data, category] = args;
    trace({ message, data, category });
  } else {
    trace(args[0]);
  }
};

overloading.log = (message, data) => {
  trace({ message, data, category: "log" });
};

export default overloading;
