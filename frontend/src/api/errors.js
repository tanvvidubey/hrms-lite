const DEFAULT_MESSAGE = "Something went wrong. Please try again.";
const MESSAGES = {
  400: "The request was invalid. Please check your input.",
  403: "You don't have permission to do this.",
  404: "The requested item was not found.",
  500: "Something went wrong on our end. Please try again later.",
  network: "Unable to connect. Please check your connection and try again.",
};

export function getErrorMessage(err) {
  if (!err) return DEFAULT_MESSAGE;
  const status = err.response?.status;
  if (err.code === "ERR_NETWORK" || err.message === "Network Error") return MESSAGES.network;
  const data = err.response?.data;
  if (!data) return MESSAGES[status] || err.message || DEFAULT_MESSAGE;
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.detail) return Array.isArray(data.detail) ? data.detail[0] : data.detail;
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];
  const firstField = Object.values(data)[0];
  if (firstField) return Array.isArray(firstField) ? firstField[0] : firstField;
  return MESSAGES[status] || err.message || DEFAULT_MESSAGE;
}

export function getValidationErrors(err) {
  const data = err?.response?.data;
  if (!data || typeof data !== "object") {
    return { form: getErrorMessage(err) };
  }
  if (data.detail && !Object.keys(data).some((k) => k !== "detail")) {
    return { form: Array.isArray(data.detail) ? data.detail[0] : data.detail };
  }
  if (data.non_field_errors?.length) {
    return { form: data.non_field_errors[0], ...flattenFieldErrors(data) };
  }
  return flattenFieldErrors(data);
}

function flattenFieldErrors(data) {
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "detail" || key === "message") continue;
    const msg = Array.isArray(value) ? value[0] : value;
    if (msg != null) out[key] = msg;
  }
  return out;
}
