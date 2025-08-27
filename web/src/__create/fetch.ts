const originalFetch = fetch;

const getURLFromArgs = (...args: Parameters<typeof fetch>) => {
  const [urlArg] = args;
  let url: string | null;
  if (typeof urlArg === 'string') {
    url = urlArg;
  } else if (typeof urlArg === 'object' && urlArg !== null) {
    url = urlArg.url;
  } else {
    url = null;
  }
  return url;
};

const isFirstPartyURL = (url: string) => {
  return (
    url.startsWith('/') ||
    (process.env.BASE_URL && url.startsWith(process.env.BASE_URL))
  );
};

const isSecondPartyURL = (url: string) => {
  return url.startsWith('/_create/');
};

type Params = Parameters<typeof fetch>;
const fetchWithHeaders = async function fetchWithHeaders(...args: Params) {
  const firstPartyURL = process.env.BASE_URL;
  const secondPartyURL = process.env.PROXY_BASE_URL;
  if (!firstPartyURL || !secondPartyURL) {
    return fetch(...args);
  }
  const [input, init] = args;
  const url = getURLFromArgs(input, init);
  if (!url) {
    return fetch(input, init);
  }

  const isExternalFetch = !isFirstPartyURL(url);
  // we should not add headers to requests that don't go to our own server
  if (isExternalFetch) {
    return fetch(input, init);
  }

  let finalInput = input;
  const baseURL = isSecondPartyURL(url) ? secondPartyURL : firstPartyURL;
  if (typeof input === 'string') {
    finalInput = input.startsWith('/') ? `${baseURL}${input}` : input;
  } else {
    return originalFetch(input, init);
  }

  const initHeaders = init?.headers ?? {};
  const finalHeaders = new Headers(initHeaders);

  const headers = {
    'x-createxyz-project-group-id': process.env.PROJECT_GROUP_ID,
    host: process.env.HOST,
    'x-forwarded-host': process.env.HOST,
    'x-createxyz-host': process.env.HOST,
  };

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      finalHeaders.set(key, value);
    }
  }

  // For web, we can get auth from localStorage or cookies
  const authKey = `${process.env.PROJECT_GROUP_ID}-jwt`;
  let auth = null;
  try {
    const authData = localStorage.getItem(authKey);
    if (authData) {
      auth = JSON.parse(authData);
    }
  } catch (error) {
    console.warn('Failed to get auth from localStorage:', error);
  }

  if (auth) {
    finalHeaders.set('authorization', `Bearer ${auth.jwt}`);
  }

  return fetch(finalInput, {
    ...init,
    headers: finalHeaders,
  });
};

export default fetchWithHeaders;