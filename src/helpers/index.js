/* eslint-disable prettier/prettier */
export function configureFakeBackend() {
  return function (url, opts) {
    const {method} = opts;
    const body = opts.body && JSON.parse(opts.body);

    return new Promise((resolve, reject) => {
      setTimeout(handleRoute, 500);

      function handleRoute() {
        switch (true) {
          case url.endsWith('/messages/add') && method === 'POST':
            return dataMessage();
          default:
            return fetch(url, opts)
              .then(response => resolve(response))
              .catch(error => reject(error));
        }
      }

      function dataMessage() {
        const {messages: details} = body;
        console.log('Data sent successfully');
        return ok({
          data: details,
        });
      }

      function ok(details) {
        resolve({
          ok: true,
          text: JSON.stringify(details),
        });
      }
    });
  };
}
