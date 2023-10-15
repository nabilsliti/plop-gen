Pgen
======

A tool based on plop.js that gives you a simple way to generate your react, angular, vue and stencil components.
You can create also structures and patterns in our code (routes, controllers, components, helpers, etc).

## Installation
##### Add `pgen` to your project
```
$ npm install --save-dev pgen
```
##### Install `pgen` globally
```
$ npm install -g pgen
```

## CLI Usage
Once pgen is installed, you are ready to run ``pgen`` from the terminal.

##### Usage:
```bash
$ pgen          // Select from a list of available generators
$ pgen <name>   // Run a generator registered under that name
```
##### Options:

```bash
$ pgen -h, --help        // Show the help
$ pgen -i, --init        // Create a basic plopfile.js
$ pgen -p, --plopfile    // Path to the plopfile
$ pgen -v, --version     // Display current version
$ pgen --cwd             // Directory from which relative paths are calculated against
```
##### Examples:

```bash
$ pgen
$ pgen create-component --cwd /path/where/you/will/create/your/component
$ pgen rename-component
```

## Create a component

1. You need just to run `pgen` from the terminal
```bash
$ pgen
```
1. Then, choose the `create-component` generator
   

Or you can run directly this command:

```bash
$ pgen create-component
```

3. Then, choose the framework you like to use from the list:
    - react
    - angular
    - vue
    - stencil

4. Enter the name of your component
5. Select the where you want to create the component.
Enjoy :) your component was created
   

## Rename component

If you need to rename a component:

You need just to run `pgen` from the terminal
```bash
$ pgen
```
Then, choose the `rename-component` generator
   
Or you can run directly this command:

```bash
$ pgen rename-component
```

Then follow the steps.

## License

Licensed under [MIT](./LICENSE).
