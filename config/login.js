module.export = function(){
  'use strict';

  var httpntlm = require('httpntlm'); // HTTP authentication NTLM
  var username = ''; // username epfl
  var password = ''; // password epfl
  var workstation = 'choose.something'; //
  var domain = ''; // intranet

  httpntlm.get({
      url: "https://cmisrvm1.epfl.ch/cmi/v1.5/copernic_2/#",
      username: username,
      password: password,
      workstation: workstation,
      domain: domain
  }, function (err, res){
      if(err) return err;

      console.log(res.headers);
      console.log(res.body);
  });
};
