import useSWR from "swr";

export default function gasFetch(apiRoute, body = {}) {
  const productionURL =
    "https://script.google.com/macros/s/AKfycbyauoZ-BwvcMVzZ_KM8ypQq-8iwXYzUIXsyvfKnz1qXUDcz2W1NNKJUGXQvdmLN05tEow/exec";

  const devURL =
    "https://script.google.com/macros/s/AKfycbyauoZ-BwvcMVzZ_KM8ypQq-8iwXYzUIXsyvfKnz1qXUDcz2W1NNKJUGXQvdmLN05tEow/exec";

  const url =
    process.env.NODE_ENV === "production"
      ? `${devURL}?insertLogs=true`
      : `${devURL}?debug=1`;

  let token = "";

  if (
    !apiRoute.includes("/login") &&
    !apiRoute.includes("/verify") &&
    !apiRoute.includes("/forget-password")
  ) {
    let type = apiRoute.replace("https://", "").split("/")[1];

    let tokenInfo = localStorage.getItem(`${type}TokenInfo`);

    if (!tokenInfo) {
      window.location = `/${type}/login`;
      return Promise.reject("Token not found. Please login again.");
    }

    let tokenInfoJSON = JSON.parse(tokenInfo);

    if (tokenInfoJSON.expire < new Date().getTime()) {
      window.location = `/${type}/login`;
      return Promise.reject("Token expired. Please login again.");
    }

    token = tokenInfoJSON.token;
  }

  // route

  let options = {
    method: "POST",
    body: JSON.stringify(body),
  };

  if (apiRoute.includes("https://")) {
    options.headers = {
      "Content-Type": "application/json",
    };
    options.body = JSON.stringify({
      ...body,
      token,
    });
    return fetch(apiRoute, options);
  }

  return fetch(
    `${url}${token ? `&token=${token}` : ""}&route=${apiRoute}`,
    options
  );
}

const fetcher = ([apiRoute, body]) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await gasFetch(apiRoute, body);

      let reponseJSON = await response.json();

      if (reponseJSON.status) {
        resolve(reponseJSON.data);
      } else {
        reject(reponseJSON.error);
      }
    } catch (err) {
      reject(err.message ?? err);
    }
  });
};

export function useGASFetch(apiRoute, body) {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    [apiRoute, body],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    isLoading,
    error: error,
    mutate,
    isValidating,
  };
}

const authChecker = (type) => {
  let tokenInfo = localStorage.getItem(`${type}TokenInfo`);

  if (!tokenInfo) {
    return false;
  }

  let tokenInfoJSON = JSON.parse(tokenInfo);

  if (tokenInfoJSON.expire < new Date().getTime()) {
    return false;
  }

  return true;
};

export const useAuthCheck = (type) => {
  const { data, error, isLoading, mutate } = useSWR(type, authChecker);

  return {
    data,
    isLoading,
    error: error,
  };
};

const authRemover = (type) => {
  localStorage.removeItem(`${type}TokenInfo`);

  return true;
};

export const useLogOut = (type) => {
  const { data, error, isLoading } = useSWR(type, authRemover);

  return {
    data,
    isLoading,
    error: error,
  };
};
