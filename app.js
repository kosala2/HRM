const express = require('express');
const IPFS = require('ipfs-api');

//file system module to read json file
var fs=require('fs')
var Web3=require('web3');

//infura provides ipfs api to write to global IPFS network
//that can be accessed as https://gateway.ipfs.io/ipfs/<hashOfFile>
//const ipfs = new IPFS({host:'ipfs.infura.io', port:5001, protocol:'https'});
const ipfs = new IPFS({host:'40.121.85.175', port:5001, protocol:'http'});
var path = require('path');

const app = express();
app.use(express.json());

  var provider = 'http://51.144.99.189:8000' //node 3
  var web3Provider = new Web3.providers.HttpProvider(provider);
  var web3 = new Web3(web3Provider);


//setting virtual path so that js files can be read from html files.
app.use('/', express.static(path.join(__dirname, '/')));

console.log(__dirname);

app.get('/patient', function(req, res) {
    res.sendFile(path.join(__dirname + '/patient.html'));
});

app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/register.html'));
});

app.get('/registerUser',async function(req,res)
{
const account =  await web3.eth.personal.newAccount(req.query.password)
res.send({"Account craeted": account})
})

app.get('/getAccount', function(req,res){
const password = "hsk";
const keystore = fs.readFileSync("UTC--2021-06-25T11-18-04.885203509Z--ffb6b4d9f4ac86102ab953d70ed117f6984633fc", 'utf8');
const decryptedAccount =
web3.eth.accounts.decrypt(JSON.parse(keystore), password);
res.send(decryptedAccount)
});


//read abi
app.get('/abi', function(req,res){
	var contract_json = "./build/contracts/PatientControl.json";
	var parsed= JSON.parse(fs.readFileSync(contract_json));
	var abi = parsed.abi;
	res.send(abi);
});


//write token details to IPFS - pass token details as a json object
app.post('/addUser', async(req,res)=>{
	const data =req.body;
	const jsonData=JSON.stringify(data);
	console.log("User details :"+jsonData);

	//write json object to IPFS
	const filesAdded = await ipfs.add(Buffer.from(jsonData));
	const fileHash=filesAdded[0].hash;
	console.log("@server - User file hash :"+ fileHash);

	return res.send(fileHash); 
	//url to view the message connected from fileHash is as follows.
	// https://gateway.ipfs.io/ipfs/QmdtfayHRcUzeZjfVYdm9ZshfzagbWEoeJYbWiE6FiqAFN
});




app.listen(3000, ()=>{
	console.log('Server listening on port 3000');
});
