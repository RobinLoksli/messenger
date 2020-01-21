const User = require('./../models/UserModel');

function getUniq(users, findedUsers){
    let finded = false;
    for (let i = 0; i < findedUsers.length; i++){
        finded = false;
        for(let j = 0; j < users.length; j++){
            if (users[j]._id + '' == findedUsers[i]._id + ''){
                finded = true;
                break;
            }
        }
        if (finded == false){
            users.push(findedUsers[i]);
        }
    }
}

function getWords(string){
    let words = [];
    let newString = [];

    string = string + '';
    string = string.toLowerCase();
    newString = string.split(/\p{Zs}/gu);

    for(let i = 0; i < newString.length; i++){
        if(newString[i].length != 0){
            words.push(newString[i]);
        }
    }
    return words;
}

exports.index = async function(req, res){
    let users = [];
    let ages  = [];
    let curDate = new Date();
    let maxDate =  await User.find({}).sort({dateBorn : -1}).limit(1);
    let minDate =  await User.find({}).sort({dateBorn :  1}).limit(1);

    if((maxDate && minDate) != undefined){
        for (let i = minDate[0].dateBorn.getFullYear() ; i < maxDate[0].dateBorn.getFullYear() + 2 ; i ++){
            ages.push(curDate.getFullYear() - i);
        }
    }

    res.render('search/index',{
        ages : ages,
    });
}

exports.actionIndex = async function(req, res){
  let words   = [];
  let users   = [];
  let ages    = [];
  let body    = req.body;
  let curDate =  new Date();
  let maxDate =  await User.find({}).sort({dateBorn : -1}).limit(1);
  let minDate =  await User.find({}).sort({dateBorn :  1}).limit(1);
  let findedUsers = [];

  if((maxDate && minDate) != undefined){
      for (let i = minDate[0].dateBorn.getFullYear() ; i < maxDate[0].dateBorn.getFullYear() + 2 ; i ++){
          ages.push(curDate.getFullYear() - i);
      }
  }
  console.log(body.param);
  if (body.param == undefined){

      if(body.userName.length != 0){
          words = getWords(body.userName);
          users = await User.find({$or : [{"name.firstName" : body.userName} , {"name.secondName" : body.userName}] });
      }
      if(body.age != undefined){

          findedUsers =  await User.find({dateBorn : {$gte: curDate.getFullYear() - body.age - 1 + '-'+ (curDate.getMonth()+1)+'-'+curDate.getDate(),
           $lte : curDate.getFullYear() - body.age + '-'+ (curDate.getMonth()+1)+'-'+curDate.getDate()}});
          getUniq(users,findedUsers);

      }
  }else{
      users = await User.find({ $and : [
          {$or : [{"name.firstName" : body.userName} , {"name.secondName" : body.userName}] },
          {dateBorn : {$gte: curDate.getFullYear() - body.age - 1 + '-'+ (curDate.getMonth()+1)+'-'+curDate.getDate(),
           $lte : curDate.getFullYear() - body.age + '-'+ (curDate.getMonth()+1)+'-'+curDate.getDate()}}
      ]})
  }

  res.render('search/index',{s
      users : users,
      ages  : ages,
  });
}

function lolol(){
    console.log('fuck');
}
