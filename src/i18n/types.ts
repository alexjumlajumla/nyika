// Define the shape of our translation messages
export interface Messages {
  [key: string]: string | Messages;
}

// Type for the request configuration
export interface RequestConfig {
  locale: string;
  messages: Messages;
  now?: Date;
  timeZone?: string;
}

// Type for the function that loads messages
export type GetRequestConfigParams = {
  locale: string;
};
