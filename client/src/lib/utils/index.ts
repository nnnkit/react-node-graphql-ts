import { notification, message } from "antd";

export const displaySuccessNotification = (
  message: string,
  description: string = ""
) => {
  return notification["success"]({
    message,
    description,
    placement: "topLeft",
    style: {
      marginTop: "50px",
    },
  });
};
export const displayErrorMessage = (error: string) => {
  return message.error(error);
};
