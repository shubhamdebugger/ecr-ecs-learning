import { customAlphabet } from 'nanoid';
import { APP_CONSTANTS } from '../constants/app.constants';
import { urlExistsByShortCode } from '../repositories/url.repository';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyz0123456789',
  APP_CONSTANTS.SHORT_CODE_LENGTH,
);

export const generateShortCode = (): string => {
  return nanoid();
};

export const generateUniqueShortCode = async (): Promise<string> => {
  let shortCode: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate a unique short code after maximum attempts');
    }
    shortCode = generateShortCode();
    attempts++;
  } while (await urlExistsByShortCode(shortCode));

  return shortCode;
};

export const isValidShortCode = (code: string): boolean => {
  return /^[a-zA-Z0-9_-]{3,50}$/.test(code);
};
