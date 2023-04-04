# Today in History API

Welcome to the Today in History API! This API provides a list of historical events that occurred on the current day in history. It is perfect for use in educational applications, trivia games, or any other project that requires information about historical events. This project as build with the proposal of understand some backend scenarios, to lean more about build an API and to understand how to deploy a backend application. This Project has built using [Node.js](https://nodejs.org/en) with express and [puppeteer](https://pptr.dev)

This API as hosted on the following link: [today-in-history-api-pi.vercel.app](today-in-history-api-pi.vercel.app)

You can use the following endpoints
- `/en/today` - to get all the historical events on current date
- `/en/23/03` - to get all tge historical events on the selected date. Following the pattern `/language/day/month`. The available languages are `pt - portuguese`  and `en - english`.

## Installation

To install the Today in History API for your own, simply clone this repository to your local machine using the following command:

```bash
git clone https://github.com/lukaskunn/today-in-history-api.git
```

Once you have cloned the repository, you need run the following command to install necessary packages:

```bash
yarn
```

Once you completed installed all the necessary dependencies you can run the following command to start run the API on your local machine

```bash
yarn dev
```


The API will then be available at http://localhost:3000.

## Usage

To use the Today in History API, simply make a GET request to the following endpoint:

```bash
http://localhost:3000/en/today
```


This will return a JSON object containing a list of historical events that occurred on the current day in history.

```bash
http://localhost:3000/en/23/03
```

This will return a JSON object containing a list of historical events that occurred on 23rd of March.

## Contributing

If you would like to contribute to the Today in History API, simply fork this repository, make your changes, and submit a pull request. We welcome contributions of all kinds, whether it's fixing a bug, adding a new feature, or just improving the documentation.

## Credits

The Today in History API was created by [Lukas Kunn](https://github.com/lukaskunn).

## License

The Today in History API is released under the [MIT License](https://opensource.org/licenses/MIT).

