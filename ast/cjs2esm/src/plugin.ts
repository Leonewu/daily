import getVisitors from "./visitor"

export default function transformPlugin() {
  const errors = [];
  const visitor = getVisitors(errors);
  return {
    visitor
  }
}