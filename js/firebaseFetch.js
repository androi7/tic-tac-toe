const firebase = {
  baseURL: 'https://tic-tac-toe-39e7e.firebaseio.com/',

  getData: async function(path) {
    const url = this.baseURL + `${path}.json`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
      throw new Error('response GET failed!');
    } catch(error) {
      console.log(error);
    }
  },

  postData: async function(path, data) {
    const url = this.baseURL + `${path}.json`;
    const jsonData = JSON.stringify(data);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: jsonData,
        headers: { 'Content-type': 'application/json'}
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        return jsonResponse;
      } throw new Error('response POST failed!');
    } catch(error) {
      console.log(error);
    }
  }
};
