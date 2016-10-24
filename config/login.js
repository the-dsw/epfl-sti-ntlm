module.export = function(){
  'use strict';
  var httpntlm = require('httpntlm'); // HTTP authentication NTLM

  httpntlm.get({
      url: "https://cmisrvm1.epfl.ch/cmi/v1.5/copernic_2/#",
      username: 'm$',
      password: 'stinks',
      workstation: 'choose.something',
      domain: ''
  }, function (err, res){
      if(err) return err;

      console.log(res.headers);
      console.log(res.body);
  });
};
