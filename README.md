# <u>Keith DeSantis Submission for Avantos Jr. Front End Developer</U> #

Please find my submission for the coding challenged enclosed.

Follow this [link](https://youtu.be/QBNBIvok_MI) to see the video of me programming part of this application.

## Folder Structure ##

* `desantis_avantos_application`
    * This contains my React and Typescript application. It was built using `create react app`.
    * `ReactFlow` was utilized for the base of the UI, then built upon. I included minimal styling for the sake of time.
    * Some personal business regrettably came up during the time limit of this project so I did not have as much time as I'd have liked to dedicate to it. As a consequence of this I do not have test cases built up, but prioritized getting a minimal viable product up and running.
    * While there are some cut corners here and there, I am overall happy with what I've made and what I've learned during this process. I hadn't touched `ReactFlow` before this, but will certainly be using it from now on.
* `frontendserver`
    * This is a forked version of the mock front end server you provided [here](https://github.com/mosaic-avantos/frontendchallengeserver)
    * I configured the app to run on port `3001`, so the main application has port `3000` available to use.

## Running the App ##

Follow the steps below to run the application:
* Open a terminal (with npm installed) and navigate to the `frontendserver` folder.
* Run `npm start` (you may need to run `npm install` depending on your setup)
* This should start the mock frontendserver which my app will fetch the graph.json from. I configured it to run on port `3001`. 
    * This can be changed if you would like, but be sure to also modify the `const endpointURL = "http://localhost:3001/api/v1/1/actions/blueprints/1/graph"` line in `AppContext.tsx` to use the corresponding port so the app can reach the frontendserver.
* In a separate terminal, navigate to the `desantis_avantos_application` folder.
* Run `npm start` (you may need to run `npm install` depending on your setup)
* In your web browser, navigate to `http://localhost:3000` to access the app

## Notes to Consider and Reflection ##

I enjoyed this project a ton. It's always refreshing when a company you're applying to gives you the chance to do some real programming and exposes you to new things.

A few thing I believe I did well on this project:
* I utilized `React Contexts` to avoid passing inordinate amounts of variables and functions between components. Separating the majority of global functionality into a separate `AppContext.tsx` file allowed `App.tsx` to remain simple and modular. The use of `export` with custom `useXXXContext` hooks allowed my other components to easily access only those contexts they needed to operate, while remaining clean and modular.
* While I had some confusion about the exact details of what the challenge description was asking for, I believe I did my best to interpret the instructions and apply them directly.
    * As proof of this, rather than hard coding the majority of logic or graph traversal based on the `graph.json` provided in the `frontendserver` repo, I instead built adaptable logic based around the JSON's schema.
    * This means my code will be able to take in other `graph.json` files that differ (so long as they follow the same format) and generate graphs accordingly.
    * In the `graph.json`, 3 different forms were listed, with each node pointing to one of the three. Rather than hard code in these values (even though all 3 forms had the same `fields_schema`), I programmatically parsed the data so that nodes would only be able to select field options from the corresponding fields in a node's form's `field_schema`.
    * Finally, I implemented my own method of tracking node parentage in the `DAG`, and traversing the `DAG` to determine all ancestors and roots of a given node. I am new to `ReactFlow`, so I assume there is a cleaner way to do this that is shipped with it, but I was unable to find much relating to the use case needed (most docs discussing parent nodes were about `SubFlows`).
    * I also use the `map()` function to generate unique Prefill and Mapping modals for each node and each node's mappable values. This ensured each node's saved configuration was unique and persisted, even when the modals were closed or other modals were opened.

## Adding New Data ##

As I mentioned above, I built out the application logic to programmatically render the nodes and Prefill options based entirely on the `graph.json` served by the `frontendserver`. To add new fields, nodes, or edges, simply adjust the `graph.json` while still adhering to its overall format, and the application will dynamically adjust.

Thank you for this opportunity and I hope to hear from you soon!

Keith DeSantis (keithwdesantis@gmail.com)