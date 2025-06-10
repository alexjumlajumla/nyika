/**
 * Maps authentication error codes to user-friendly messages
 */
interface AuthErrorMessages {
  [key: string]: string;
}

export const AUTH_ERRORS: AuthErrorMessages = {
  // Firebase/Supabase Auth errors
  'auth/invalid-email': 'auth.invalidEmail',
  'auth/user-disabled': 'auth.userDisabled',
  'auth/user-not-found': 'auth.userNotFound',
  'auth/wrong-password': 'auth.wrongPassword',
  'auth/email-already-in-use': 'auth.emailInUse',
  'auth/operation-not-allowed': 'auth.operationNotAllowed',
  'auth/weak-password': 'auth.weakPassword',
  'auth/too-many-requests': 'auth.tooManyRequests',
  'auth/account-exists-with-different-credential': 'auth.accountExistsWithDifferentCredential',
  'auth/invalid-credential': 'auth.invalidCredential',
  'auth/requires-recent-login': 'auth.requiresRecentLogin',
  'auth/provider-already-linked': 'auth.providerAlreadyLinked',
  'auth/credential-already-in-use': 'auth.credentialAlreadyInUse',
  'auth/invalid-verification-code': 'auth.invalidVerificationCode',
  'auth/invalid-verification-id': 'auth.invalidVerificationId',
  'auth/expired-action-code': 'auth.expiredActionCode',
  'auth/invalid-action-code': 'auth.invalidActionCode',
  'auth/missing-verification-code': 'auth.missingVerificationCode',
  'auth/missing-verification-id': 'auth.missingVerificationId',
  
  // Custom errors
  'auth/email-not-verified': 'auth.emailNotVerified',
  'auth/account-exists': 'auth.accountExists',
  'auth/network-request-failed': 'auth.networkRequestFailed',
  'auth/popup-closed-by-user': 'auth.popupClosedByUser',
  'auth/cancelled-popup-request': 'auth.cancelledPopupRequest',
  'auth/popup-blocked': 'auth.popupBlocked',
  'auth/unauthorized-domain': 'auth.unauthorizedDomain',
  'auth/web-storage-unsupported': 'auth.webStorageUnsupported',
};

/**
 * Gets a user-friendly error message for an authentication error
 * @param error The error object or string from the authentication service
 * @param defaultMessage Default message to return if no match is found
 * @returns A translation key for the error message
 */
export function getAuthErrorMessage(
  error: unknown,
  defaultMessage: string = 'auth.unknownError'
): string {
  if (!error) return defaultMessage;
  
  // Handle Error objects
  if (error instanceof Error) {
    return AUTH_ERRORS[error.message] || error.message || defaultMessage;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return AUTH_ERRORS[error] || error || defaultMessage;
  }
  
  // Handle objects with code or message properties
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.code && typeof errorObj.code === 'string') {
      return AUTH_ERRORS[errorObj.code] || errorObj.code || defaultMessage;
    }
    if (errorObj.message && typeof errorObj.message === 'string') {
      return AUTH_ERRORS[errorObj.message] || errorObj.message || defaultMessage;
    }
  }
  
  return defaultMessage;
}

/**
 * Checks if an error is an authentication error that should be shown to the user
 * Some errors are expected and handled by the auth flow, so we don't need to show them
 */
export function isUserFacingAuthError(error: unknown): boolean {
  if (!error) return false;
  
  // These are errors that we expect and handle in the UI
  const nonUserFacingErrors = [
    'auth/popup-closed-by-user',
    'auth/cancelled-popup-request',
    'auth/web-storage-unsupported',
  ];
  
  if (error instanceof Error) {
    return !nonUserFacingErrors.includes(error.message);
  }
  
  if (typeof error === 'string') {
    return !nonUserFacingErrors.includes(error);
  }
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.code && typeof errorObj.code === 'string') {
      return !nonUserFacingErrors.includes(errorObj.code);
    }
    if (errorObj.message && typeof errorObj.message === 'string') {
      return !nonUserFacingErrors.includes(errorObj.message);
    }
  }
  
  return true;
}
