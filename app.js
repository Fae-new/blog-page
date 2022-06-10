const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash')
const mongoose=require('mongoose')
const ejs=require('ejs');
const { indexOf } = require('lodash');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
mongoose.connect('mongodb+srv://jibola2:test123@cluster0.cw4vt.mongodb.net/blogdb')
mongoose.connection.once('open',function(){console.log('connected to db sucessfully')})
let posts=[]
const homeStartingContent = " ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.set('view engine','ejs');
const postSchema={
    title:String,
    content:String
}

const Post=mongoose.model('Post',postSchema)



app.get('/',function(req,res){
   
    Post.find({},function(err,data){
        if(!err){
            res.render('home',{homeStartingContent:homeStartingContent,posts:data});
        }
    })

})


app.get('/:nextPage',function(req,res){
if( req.params.nextPage=='about'){
    res.render('about',{aboutContent:aboutContent});
}

else if( req.params.nextPage=='contact'){
    res.render('contact',{contactContent:contactContent});
}
else if( req.params.nextPage=='compose'){
    res.render('compose')
}
else if(req.params.nextPage=='deletepost'){
    res.render('deletepost')
}

    })

    app.get('/posts/:postName',function(req,res){
           const requestedUrl=  _.lowerCase(req.params.postName)

           Post.find({},function(err,data){
        for(i=0;i<data.length;i++){

            const storedUrl= _.lowerCase(data[i].title)
            

            if(storedUrl===requestedUrl){

              
                  if(!err){
                    res.render('post',{postHeader:data[this.i].title,postBody:data[this.i].content})
                  }
                  else{console.log(err);}
             
               
                

            }
          

        }
    })
   
       
    })


    app.post('/posts/:postName',function(req,res){
const post2Del=req.body.deletedPost
Post.findOneAndDelete({title:post2Del},function(err) {
    if(!err){console.log('deleted successfully')
res.redirect('/')}
    else{console.log(err);}
    
})


    })

    app.post('/deletepost',function(req,res) {
        const deletedPost=req.body.postTitle
        Post.findOneAndDelete({title:deletedPost},function(err){
            if(err){
                console.log(err)
            }
            else{ res.redirect('/');
                console.log('succesfully deleted');
           }
        })
     
       
    })
    


app.post('/compose',function(req,res){
//     const post= new Post({
//         title: _.capitalize(req.body.postTitle),
//         content:req.body.postBody
//     });

// post.save();

Post.insertMany(   {
    title: _.capitalize(req.body.postTitle),
    content:req.body.postBody
},function(err){
    if(!err){res.redirect('/')}
    else{console.log}(err)
}

)
   




})


app.listen(process.env.PORT||3000,function(){
    console.log('server started on port 3000');
})