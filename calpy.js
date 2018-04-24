var pythonShell = require('python-shell');
var pyshell = new pythonShell('TspAlgo.py', {pythonPath : "python3", mode: 'text', args: [[ '40.1195547', '-88.2336343' ],[ '40.1195547','40.127922','40.1105839','40.1121494','40.1008296','40.1104086','40.1111456' ],
	[ '-88.2336343','-88.25666','-88.207086','-88.208272','-88.235555','-88.238954','-88.244168' ],
	[ -1, 4, 11, 0, 1, 79, 92 ],[ 0, 0, 0, 0, 0, 1, 1 ]]
});
console.log(pyshell.args)
let start_place = '1301 W Springfield Ave, Urbana, IL';
pyshell.send("hello");
pyshell.on('message', function (res) {
	console.log(res)
});