const express = require('express');
const IPFS = require('ipfs-api');

//file system module to read json file
var fs=require('fs')
var Web3=require('web3');

//infura provides ipfs api to write to global IPFS network
//that can be accessed as https://gateway.ipfs.io/ipfs/<hashOfFile>
const ipfs = new IPFS({host:'ipfs.infura.io', port:5001, protocol:'https'});
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


app.listen(3000, ()=>{
	console.log('Server listening on port 3000');
});
