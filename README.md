# livedoc

livedoc is a javascript library that generates a generic UI for REST API document. It generates result as a single html file and various variation.

## Requirement
[Node](https://nodejs.org/en/)

## Installation
```bash
npm install livedoc
```

## Structure


```js
{
   "name": string,
   "summary": string,
   "metadata": {
      "Version": string,
      "License": string,
      "Terms of service": string
   },
   "host": string,
   "port": {
      "http": int,
      "https": int
   },
   "basePath": string,
   "currentHost": string -- reserve for internal use,
   "currentScheme": string -- reserve for internal use,
   "appConfig": {
      "bgColor": {
         "default": string
      },
      "showDevPlayground": boolean -- showing request & response panel,
      "showNav": boolean,
      "fixedNav": boolean
   },
   "appData": {
      "search": string,
      "console": string,
      "consoleLogs": [string],
      "showConsole": boolean
   },
   "apis": [
      {
         "path": [string],
         "visible": boolean,
         "showMe": boolean,
         "methods": [
            {
               "name": string -- GET POST PUT etc.,
               "visible": boolean,
               "tags": [string],
               "summary": string,
               "desc": string,
               "params": [
                  {
                     "name": string,
                     "location": string,
                     "desc": string,
                     "required": boolean,
                     "schema": string,
                     "schemaState": [-- reserve for internal use],
                     "value": string,
                     "type": string
                  }
               ],
               "responses": [
                  {
                     "code": string,
                     "desc": string,
                     "schema": string,
                     "schemaState": [-- reserve for internal use]
                  }
               ],
               "examples": {},
               "request": {
                  "schemes": [string],
                  "headers": [object],
                  "choosen": {
                     "scheme": "http",
                     "headers": {object},
                     "body": string,
                     "headerName": string,
                     "headerValue": string,
                     "result": string reserve for internal use
                  }
               },
               "showTool": boolean,
               "showMe": boolean
            }
         ]
      }
   ]
}
```

## Example
todo: add example here

## Escaping Guide
- Use `JSON.stringify` to do 1st pass escape
- The second pass escape needed to escape reserve tokens of `string.proto.replace()`

| Pattern |                                Inserts                                 |
| ------- | ---------------------------------------------------------------------- |
| $$      | Inserts a "$".                                                         |
| $&      | Inserts the matched substring.                                         |
| $`      | Inserts the portion of the string that precedes the matched substring. |
| $'      | Inserts the portion of the string that follows the matched substring.  |
| $n      | Where n is a positive integer less than 100                            |

> $n inserts the nth parenthesized submatch string, provided the first argument was a RegExp object. Note that this is 1-indexed.

## License
The contents of this repository are covered under the [MIT License](LICENSE)
