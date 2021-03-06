'use strict';
const fs= require('fs');
const request = require('request');
const Progress = require('progress');

var totalBytes, downloadedBytes, bar, fileName = Date.now() + '.png';
var urlFile = process.argv[2];
if(!urlFile) {
	console.log('Missing parameter urlFile.');
	return;
}
//https://download.unsplash.com/photo-1429277096327-11ee3b761c93
console.time('download');
request.get(urlFile)
.on('response', function(res) {
	//downloadedBytes = 0;
	totalBytes = parseInt(res.headers['content-length'], 10);
	//console.log('Total bytes: ' + totalBytes);
	bar = new Progress('downloading [:bar] :percent :etas', {
		complete: '=',
		incomplete: ' ',
		width: 50,
		total: totalBytes
	});
})
.on('data', function(chunk) {
	//downloadedBytes += chunk.length;
	//console.log(downloadedBytes + " / " + totalBytes);
	bar.tick(chunk.length);
})
.on('error', function(err) {
	console.log('Download error ', err);
})
.pipe(fs.createWriteStream(fileName)
	.on('finish', function() {
		console.timeEnd('download');
		console.log('Done write to file: ' + fileName);
	})
	.on('error', function(err) {
		console.log('Error write to file ', err);
	}));