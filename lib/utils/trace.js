import setup from "./setup";

const trace = ({ message, category = "trace", data }) => {
  const newTrace = { timestamp: new Date(), message, category, data };
  setup.tracer({ ...newTrace });
};

const overloading = (...args) => {
  if (typeof args[0] === "string") {
    const [message, category, data] = args;
    trace({ message, category, data });
  }
  trace(args[0]);
};

export default overloading;
