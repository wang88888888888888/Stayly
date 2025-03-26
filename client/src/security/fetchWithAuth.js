// This is fetchWithAuth.js:

export async function fetchWithAuth(url, options = {}) {
    try {
      let res = await fetch(url, { ...options, credentials: "include" });
  
      if (res.status === 401) {
        // Refresh token if access token has expired
        const refreshRes = await fetch(
          `${process.env.REACT_APP_API_URL}/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          }
        );
  
        if (refreshRes.ok) {
          res = await fetch(url, { ...options, credentials: "include" });
        } else {
          // If refresh token fails, redirect to login
          window.location.href = "/login";
          return;
        }
      }
  
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
  
      return res;
    } catch (error) {
      console.error("Error during fetchWithAuth:", error);
      throw error;
    }
  }
  
  export async function fetchGetWithAuth(url) {
    try {
      const res = await fetchWithAuth(url);
      return res.json();
    } catch (error) {
      console.error("Error during fetchGetWithAuth:", error);
      throw error;
    }
  }
  
  export async function fetchPostWithAuth(url, data) {
    return fetchWithAuth(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  