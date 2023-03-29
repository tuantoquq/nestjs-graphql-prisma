import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ResMessages } from '../constants/message.response';

export function errorFormatter(error: GraphQLError) {
  console.log(error.extensions);
  const originalError: any = error.extensions.originalError;
  let message: any = originalError
    ? originalError.message
    : ResMessages.COMMON.DEFAULT_ERROR;
  const graphqlFormattedError: GraphQLFormattedError = {
    message: Array.isArray(message) ? message[0] : message,
    extensions: {
      code: error.extensions.code,
      stacktrace: error.extensions.stacktrace,
    },
  };
  return graphqlFormattedError;
}
