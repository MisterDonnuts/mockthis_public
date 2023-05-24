<h1 align="center">MockThis<br> - Create Mock data using AI</h1>

MockThis, is a web-app that makes it easy to create mock JSON to test your apps. It starts with a simple step: all you have to do is write down your class or interface definition in any code language, and you will get a mocked JSON response in an instant. To make it even better, MockThis uses AI to interpret the data and deliver accurate results quickly.

You don't have to waste time searching for different mocked JSONs or going back and forth between writing and copy pasting. You can get realistic results in a fraction of the time.

Visit my website https://mister.dev/ for more information to subscribe to my newsletter and i will let you know about my new projects or updates. You can also follow me on Twitter @MisterDonnuts.
Try Mockthis on https://mockthis.app.

Thank you for your support and I look forward to your feedback!
<br>

## 📖 How to use:

Use MockThis its super easy, if you want a JSON of your classes, just paste them in the box, click submit and Voila! (ok... its no that fast) you can use this feature to just get information about anything you need and describe in the interface the way you want this data will be delivered.
Also you can send a JSON to get generate classes, interfaces, objects or whatever you want in any code lenguaje, just flip the cards, paste your JSON, write the desired result (and if you have especial requierements like use specific decorators you can write it clickin in the "add notes" button).


## 🛠️ Installation

### Local Development Environment

1. Clone the repository:

    ```bash
    git clone https://github.com/MisterDonnuts/mockthis_public.git
    ```

2. This contains the two projects, frontend and api so you have to go inside them to install it:

    ```bash
    cd mockthis_public/mockthis_front
    npm install
    ```
     ```bash
    cd mockthis_public/mockthis_back
    npm install
    ```

3. Run the frontend (made in svelte):
    ```bash
    npm run dev -- --open
    ```
4. Run the api:
    ```bash
    npm run dev:watch
    ```


5. Input your OPENAI API key in the .env file on mockthis_back folder, get your API_KEY in https://platform.openai.com/account/api-keys

    ```bash
    OPENAI_API_KEY=$YOUR_API_KEY
    ```

## 👥 Contributing

Contributions to MockThis are welcome and encouraged! To contribute just:
1. Fork the repository
2. Make your changes in a new branch and push them to your fork
3. Submit a Pull Request!

## 📜 License

MockThis is under the MIT [License](LICENSE).
