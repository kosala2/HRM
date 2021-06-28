$(document).ready( function () { 

    $("#addInfo").click(async function(){


        if(!account){
          alert("Select an authorised account to create assets");
          return;
        }

        console.log("Adding Patient Info to blockchain");

        var _id = $("#_id").val();

        instance.methods.setPatientId(_id).send({
          from: account,
          gas:350000,
          gasPrice:'125000000000'
        })
        .then(function(tx){
          console.log("write patient id to blockchain:",tx);
        });


    });



  //view patient id
  $("#viewInfo").click(async function(){

      console.log("reading patient records");

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

	 instance.getPastEvents('eventCreatePatient',
                      {
                        fromBlock:0,
                        toBlock:'latest'
                      },
                      (error,events)=>{
                        if(error){
                          console.log(error);
                        }
                         let len=events.length;
                         console.log("len",len);

                         //for(let i=len-1; i>=0;i--){
                            var tmp=events[len-1];
                            var tid=tmp.returnValues['id'];
                            var tstp=tmp.returnValues['timestamp'];
                            var str = tid +" : "+ tstp;
                            document.getElementById('patientInfo').innerHTML+=tid+"<br>";
                         //}
                      }
                );

  });


});
