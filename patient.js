$(document).ready( async function () { 

   //alert("Install Metamask, Create an Account, Setting up with Whyzehealth Blockchain");

   // //select user account
   // web3 = new Web3(window.ethereum)
   //  window.ethereum.enable().catch(error => {
   //      // User denied account access
   //      console.log(error)
   //  });

    // var userAccount=web3.currentProvider.selectedAddress;

    var _account= await web3.eth.getAccounts();
    userAccount = _account[0];
    console.log(userAccount);


    if(!userAccount){
      alert("User account is not selected");
      return;
    }


     $("#addCredit").click(function(){

          _web3.eth.sendTransaction({from:"0x2889392d845BAA82802532D627558BEe86653DE8", to:userAccount, 
            value: web3.utils.toWei('10', 'ether'), gasLimit: 35000, gasPrice: 20000000000});
     });


   //writing to blockchain and ipfs
    $("#addInfo").click( function(){

        console.log("Adding Patient Info to blockchain");

        var _name = $("#_name").val();
        var _email = $("#_email").val();
        var _mobile = $("#_mobile").val();

        // //writing to blockchain
        // instance.methods.writePatientDetails(_name,_email,_mobile).send({
        //   from: userAccount,
        //   gas:350000,
        //   gasPrice:'125000000000'
        // })
        // .then(function(tx){
        //   console.log("write patient id to blockchain:",tx);
        // });


        var userDetails = JSON.stringify({
          "name": _name,
          "email":_email,
          "mobile":_mobile
        });

        //write User data to IPFS
        $.ajax({
              url:"http://localhost:3000/addUser",
              method:"POST",
              data:userDetails,
              contentType:"application/json",
              async: false,
              success: async function(_hash){ 

                if(_hash.status==="error"){
                    console.log(_hash);
                }

                  console.log("write Json to IPFS:"+_hash);
                 // var _uri="https://gateway.ipfs.io/ipfs/"+_hash;
                  var _uri="http://40.121.85.175:8080/ipfs/"+_hash; //node 1
                  _uri=_uri.toString();
                  console.log(_uri);

  
                  //adding _hash to blockchain
                  await instance.methods.writePatientInfo(userAccount,_hash).send({
                    from: userAccount,
                    gas:450000,
                    gasPrice:'125000000000'
                  })
                  .then(function(tx){
                    console.log("write patient info hash to blockchain:",tx);
                  });


              }

        });




    });



    //view patient id
    $("#viewInfo").click(async function(){

        console.log("reading patient records");

        var result= await instance.methods.getPatientInfo(userAccount).call();
        var _uri="http://40.121.85.175:8080/ipfs/"+result;
        document.getElementById('patientInfo').innerHTML= _uri;

    });





      // await instance.methods.getPatientId().call({from: '0xC42c43502b494c6c49170229a4E92b261413fc53'}, 
      //     function(error, result){
      //       console.log(result);
      //       document.getElementById('patientInfo').innerHTML= result;
      //    }
      // );
      //console.log("Patient Id", pid);
      

      // .then (receipt =>{
      //   console.log(receipt);
      // }).catch(err=>{
      //   console.log(err);
      // });
      


      // instance.events.allEvents()
      // .on('eventCreatePatient',(event)=>{
      //   console.log(event);
      // })
      // .on('error', console.error);

      // instance.getPastEvents('eventCreatePatient',
      //                 {
      //                   fromBlock:0,
      //                   toBlock:'latest'
      //                 },
      //                 (error,events)=>{
      //                   if(error){
      //                     console.log(error);
      //                   }
      //                    let len=events.length;
      //                    console.log(len);

      //                    for(let i=len-1; i>=0;i--){
      //                       var tmp=events[i];
      //                       var tname=tmp.returnValues['name'];
      //                       var temail=tmp.returnValues['email'];
      //                       var tmobile=tmp.returnValues['mobile'];
      //                       var tstp=tmp.returnValues['timestamp'];
      //                       var str = tname +" : "+ temail +" : "+ tmobile+" : "+tstp;
      //                       document.getElementById('patientInfo').innerHTML+=str+"<br>";
      //                    }
      //                 }
      //           );








});