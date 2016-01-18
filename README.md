# TM-Spektrum-SCS-Perf-2016
Local multiuser web based application for musical performance.

## To install
You need [Node.js](https://nodejs.org/) and [Gibberish](https://github.com/charlieroberts/Gibberish) installed.  
Copy the project to a local directory.  
Open the command line and navigate to the project folder.  
Populate the dependencies with  
```shell
npm install --save
```
then run  
```shell
node index.js
```
Visit [http://localhost:3000](http://localhost:3000) on Chrome or Firefox.  
Open the browser's JavaScript/Web Console and enter.  
```shell
app.socket.emit('start')
```   
You may now close the console and start having fun clicking your mouse :)
