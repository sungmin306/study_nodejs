const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true})); //-> 적힌 거를 해석할 수 있게 도와줌
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs')
var db;
MongoClient.connect('mongodb+srv://another0306:whtjdals0306@cluster0.4zzgfc3.mongodb.net/?retryWrites=true&w=majority', function(error, client){

    if (error) return console.log(error);
    //서버띄우는 코드 여기로 옮기기

    db = client.db('todoapp');
    
    // db.collection('post').insertOne( {이름: 'John', 나이: 20}, function(에러, 결과){
    //     console.log('저장완료');
    // });

    app.listen(8080, function(){
        console.log('listening on 8080')
    }); // 서버를 열 수가 있음

})


//누군가가 /pet으로 방문을 하면..
//pet 관련된 안내문을 띄워주자
app.get('/pet',function(req,res){
    res.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

//숙제
app.get('/beauty',function(req,res){  //callback 함수라고함 함수안에 함수를 실행시켜준다 이런 의미
    res.send('뷰티용품 쇼핑 페이지입니다.');
});

app.get('/',function(req,res){ // "/" 하나만 보내면 홈페이지
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', function(req,res){
    res.sendFile(__dirname + '/write.html');
});

//어떤 사람이 /add 경로로 post 요청을 하면..
//?? 를 해주세요~

app.post('/add', function(req, res){
    res.send('전송완료')
    // console.log(req.body.title);
    // console.log(req.body.date);
    db.collection('counter').findOne({name : '게시물갯수'}, function(error, result){
        //console.log(result.totalPost) // 총 게시물 갯수
        var 총게시물갯수 = result.totalPost
        db.collection('post').insertOne({_id : 총게시물갯수 + 1, 제목: req.body.title, 날짜: req.body.date}, function(에러, 결과){
            //console.log('저장완료');
             //+ counter 라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함;
            db.collection('counter').updateOne({name: '게시물갯수'},{ $inc : {totalPost:1} },function(error, result){
                if(error){return console.log(error)}
            }) // 한번에 많이는 updateMany update는 operator 연산자를 사용해야함
    });// counter 에 있는 값을 찾겠다
    //DB에 저장해주세요-> 통해서 영구저장 가능
    });

app.delete('/delete', function(req,res){
    console.log(req.body)
    //req.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요


})

    
});



app.get('/list', function(req, res){

    //db에 저장된 post라는 collections안의 ???의 데이터를 꺼내주세요
    db.collection('post').find().toArray(function(에러, 결과){
        //console.log(결과);
        res.render('list.ejs', {posts : 결과 });
    });
    

})